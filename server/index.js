import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001; // Run on 3001 to avoid conflict with Vite (5173)

app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper to get user by email
const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

// Auth Routes
app.post('/api/register', async (req, res) => {
    const { email, password, metadata } = req.body;
    const { firstName, lastName } = metadata || {};
  
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const result = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, password, firstName || null, lastName || null, metadata || '{}']
    );
    
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await getUserByEmail(email);
    if (!user || user.password !== password) { // In prod, use bcrypt!
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/user/update', async (req, res) => {
  const { email, data } = req.body; // Expecting clientMetadata, displayName, etc.
  
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Merge existing metadata with new data
    const currentMetadata = user.metadata || {};
    // If data.clientMetadata is provided, merge it
    let newMetadata = { ...currentMetadata };
    
    if (data.clientMetadata) {
        newMetadata = { ...newMetadata, ...data.clientMetadata };
    }
    
    // Also store displayName in metadata for easy retrieval if passed
    if (data.displayName) {
        newMetadata.displayName = data.displayName;
    }
    
    await pool.query(
      'UPDATE users SET metadata = $1 WHERE email = $2',
      [newMetadata, email]
    );

    // Also update specific columns if needed, but for now metadata JSONB is flexible
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/user/:email', async (req, res) => {
  try {
    const user = await getUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/change-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.password !== currentPassword) {
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [newPassword, email]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Banking Routes

// Get user accounts
app.get('/api/accounts', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const result = await pool.query('SELECT * FROM accounts WHERE user_id = $1 ORDER BY id ASC', [user.id]);
    
    // If no accounts, create default ones for new users (migration for existing users without accounts)
    if (result.rows.length === 0) {
        // Create Checking
        const checkingRes = await pool.query(
            `INSERT INTO accounts (user_id, name, account_number, balance, type) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [user.id, 'Trust Bank Checking', '****' + (user.metadata?.accountNumber?.slice(-4) || '0000'), 500.00, 'checking']
        );
        // Create Savings
        const savingsRes = await pool.query(
            `INSERT INTO accounts (user_id, name, account_number, balance, type) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [user.id, 'Trust Bank Savings', '****' + (Math.floor(Math.random() * 9000) + 1000), 500.00, 'savings']
        );

        // Record Initial Deposits
        const accounts = [checkingRes.rows[0], savingsRes.rows[0]];
        for (const account of accounts) {
            await pool.query(`
                INSERT INTO transactions (account_id, date, description, category, amount, status, type)
                VALUES ($1, CURRENT_DATE, 'Opening Deposit', 'Deposit', 500.00, 'completed', 'credit')
            `, [account.id]);
        }

        return res.json({ accounts: accounts });
    }

    res.json({ accounts: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user transactions
app.get('/api/transactions', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Join with accounts to ensure we only get transactions for this user's accounts
    const result = await pool.query(`
        SELECT t.*, a.name as account_name 
        FROM transactions t
        JOIN accounts a ON t.account_id = a.id
        WHERE a.user_id = $1
        ORDER BY t.date DESC, t.created_at DESC
    `, [user.id]);

    res.json({ transactions: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Perform Transfer (Internal)
app.post('/api/transfer', async (req, res) => {
    const { email, fromAccountId, toAccountId, amount, memo } = req.body;
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const user = await getUserByEmail(email);
        if (!user) throw new Error('User not found');

        // Verify ownership and balance
        const fromAccountRes = await client.query('SELECT * FROM accounts WHERE id = $1 AND user_id = $2', [fromAccountId, user.id]);
        const fromAccount = fromAccountRes.rows[0];
        
        if (!fromAccount) throw new Error('Source account not found');
        if (parseFloat(fromAccount.balance) < parseFloat(amount)) throw new Error('Insufficient funds');

        const toAccountRes = await client.query('SELECT * FROM accounts WHERE id = $1 AND user_id = $2', [toAccountId, user.id]);
        const toAccount = toAccountRes.rows[0];
        if (!toAccount) throw new Error('Destination account not found');

        // Deduct
        await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromAccountId]);
        
        // Add
        await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toAccountId]);

        // Record Transactions
        // Debit record for sender
        await client.query(`
            INSERT INTO transactions (account_id, date, description, category, amount, status, type)
            VALUES ($1, CURRENT_DATE, $2, 'Transfer', $3, 'completed', 'debit')
        `, [fromAccountId, `Transfer to ${toAccount.name}: ${memo || ''}`, -amount]);

        // Credit record for receiver
        await client.query(`
            INSERT INTO transactions (account_id, date, description, category, amount, status, type)
            VALUES ($1, CURRENT_DATE, $2, 'Transfer', $3, 'completed', 'credit')
        `, [toAccountId, `Transfer from ${fromAccount.name}: ${memo || ''}`, amount]);

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(400).json({ error: err.message || 'Transfer failed' });
    } finally {
        client.release();
    }
});

// Deposit Check / Add Funds (External)
app.post('/api/deposit', async (req, res) => {
    const { email, accountId, amount, description, category } = req.body;
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const user = await getUserByEmail(email);
        
        // Verify account ownership
        const accountRes = await client.query('SELECT * FROM accounts WHERE id = $1 AND user_id = $2', [accountId, user.id]);
        if (accountRes.rows.length === 0) throw new Error('Account not found');

        // Update balance
        await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, accountId]);

        // Record Transaction
        await client.query(`
            INSERT INTO transactions (account_id, date, description, category, amount, status, type)
            VALUES ($1, CURRENT_DATE, $2, $3, $4, 'completed', 'credit')
        `, [accountId, description || 'Deposit', category || 'Deposit', amount]);

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
});

// Send Money (External) / Pay Bill
app.post('/api/payment', async (req, res) => {
    const { email, accountId, amount, description, category } = req.body;
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const user = await getUserByEmail(email);
        
        // Verify account ownership and balance
        const accountRes = await client.query('SELECT * FROM accounts WHERE id = $1 AND user_id = $2', [accountId, user.id]);
        const account = accountRes.rows[0];
        
        if (!account) throw new Error('Account not found');
        if (parseFloat(account.balance) < parseFloat(amount)) throw new Error('Insufficient funds');

        // Deduct balance
        await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, accountId]);

        // Record Transaction
        await client.query(`
            INSERT INTO transactions (account_id, date, description, category, amount, status, type)
            VALUES ($1, CURRENT_DATE, $2, $3, $4, 'completed', 'debit')
        `, [accountId, description, category || 'Payment', -amount]);

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
});

// Banking Routes (to be used later by dashboard)
// ...

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

