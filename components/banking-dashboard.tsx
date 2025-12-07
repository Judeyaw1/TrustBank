import { useState, useEffect } from 'react';
import { useUser } from '../lib/stack';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { AccountsOverview } from './accounts-overview';
import { TransactionHistory } from './transaction-history';
import { TransferMoney } from './transfer-money';
import { PayBills } from './pay-bills';
import { AccountSettings } from './account-settings';
import { SendMoney } from './send-money';
import { DepositCheck } from './deposit-check';
import { OpenAccount } from './open-account';
import { Cards } from './cards';
import { Onboarding } from './onboarding';

interface BankingDashboardProps {
  onLogout: () => void;
}

export type View = 'dashboard' | 'transactions' | 'transfer' | 'bills' | 'settings' | 'send-money' | 'deposit' | 'open-account' | 'cards';

export interface Account {
  id: number | string;
  name: string;
  accountNumber: string;
  balance: number;
  type: string;
}

export interface Transaction {
  id: number | string;
  date: string;
  description: string;
  category: string;
  account: string;
  amount: number;
  status: 'completed' | 'pending';
  type: 'credit' | 'debit';
}

export function BankingDashboard({ onLogout }: BankingDashboardProps) {
  const user = useUser();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (user && !user.clientMetadata?.onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleOnboardingComplete = async () => {
    if (user) {
      await user.update({
        clientMetadata: {
          ...user.clientMetadata, // Preserve existing metadata
          onboardingCompleted: true
        }
      });
      setShowOnboarding(false);
    }
  };
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchUserData = async () => {
    if (!user) return;
    try {
        const accResponse = await fetch(`http://localhost:3001/api/accounts?email=${user.email}`);
        const accData = await accResponse.json();
        if (accData.accounts) {
            // Map DB fields to frontend interface
            const mappedAccounts = accData.accounts.map((acc: any) => ({
                id: acc.id,
                name: acc.name,
                accountNumber: acc.account_number,
                balance: parseFloat(acc.balance),
                type: acc.type
            }));
            setAccounts(mappedAccounts);
        }

        const txResponse = await fetch(`http://localhost:3001/api/transactions?email=${user.email}`);
        const txData = await txResponse.json();
        if (txData.transactions) {
             const mappedTransactions = txData.transactions.map((tx: any) => ({
                id: tx.id,
                date: new Date(tx.date).toLocaleDateString(),
                description: tx.description,
                category: tx.category,
                account: tx.account_name, // Using joined name from backend
                amount: parseFloat(tx.amount),
                status: tx.status,
                type: tx.type
            }));
            setTransactions(mappedTransactions);
        }
    } catch (err) {
        console.error("Failed to fetch user data:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  // Load newly opened accounts from localStorage
  useEffect(() => {
    // Only proceed if accounts are initialized
    // ... existing logic but should trigger re-fetch or add to DB
    // Ideally open-account.tsx should call backend, but for now we sync if missing
  }, [currentView]); // Simplified dependency

  const handleTransfer = async (fromId: string | number, toId: string | number, amount: number, memo: string) => {
    if (!user) return;
    try {
        const response = await fetch('http://localhost:3001/api/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                fromAccountId: fromId,
                toAccountId: toId,
                amount,
                memo
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Transfer failed');
        }
        
        // Refresh data
        await fetchUserData();
    } catch (err) {
        console.error(err);
        alert("Transfer failed. Please try again.");
    }
  };

  const handleDeposit = async (accountId: string | number, amount: number) => {
    if (!user) return;
    try {
        const response = await fetch('http://localhost:3001/api/deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                accountId,
                amount,
                description: 'Mobile Check Deposit',
                category: 'Deposit'
            })
        });

        if (!response.ok) throw new Error('Deposit failed');
        await fetchUserData();
    } catch (err) {
        console.error(err);
        alert("Deposit failed.");
    }
  };

  const handleSendMoney = async (fromAccountId: string | number, amount: number, recipient: string, memo: string) => {
    if (!user) return;
    try {
        const response = await fetch('http://localhost:3001/api/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                accountId: fromAccountId,
                amount,
                description: `Sent to ${recipient}`,
                category: 'Transfer'
            })
        });

        if (!response.ok) throw new Error('Payment failed');
        await fetchUserData();
    } catch (err) {
        console.error(err);
        alert("Send money failed.");
    }
  };

  const handlePayBill = async (fromAccountId: string | number, amount: number, payeeName: string) => {
    if (!user) return;
    try {
        const response = await fetch('http://localhost:3001/api/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                accountId: fromAccountId,
                amount,
                description: `Bill Payment: ${payeeName}`,
                category: 'Bills & Utilities'
            })
        });

        if (!response.ok) throw new Error('Bill payment failed');
        await fetchUserData();
    } catch (err) {
        console.error(err);
        alert("Bill payment failed.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {showOnboarding && (
        <Onboarding 
          onComplete={handleOnboardingComplete} 
          userName={user?.clientMetadata?.userId || user?.displayName || 'User'} 
        />
      )}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-8">
          {currentView === 'dashboard' && (
            <AccountsOverview 
              accounts={accounts} 
              transactions={transactions}
              onNavigate={setCurrentView} 
            />
          )}
          {currentView === 'transactions' && (
            <TransactionHistory 
              transactions={transactions} 
              onBack={() => setCurrentView('dashboard')} 
            />
          )}
          {currentView === 'transfer' && (
            <TransferMoney 
              accounts={accounts} 
              onTransfer={handleTransfer} 
              onBack={() => setCurrentView('dashboard')} 
            />
          )}
          {currentView === 'bills' && (
            <PayBills 
              accounts={accounts}
              transactions={transactions}
              onPayBill={handlePayBill}
              onBack={() => setCurrentView('dashboard')} 
            />
          )}
          {currentView === 'send-money' && (
            <SendMoney 
              accounts={accounts}
              transactions={transactions}
              onSend={handleSendMoney}
              onBack={() => setCurrentView('dashboard')} 
            />
          )}
          {currentView === 'deposit' && (
            <DepositCheck 
              onDeposit={handleDeposit}
              onBack={() => setCurrentView('dashboard')} 
            />
          )}
          {currentView === 'open-account' && <OpenAccount onBack={() => setCurrentView('dashboard')} />}
          {currentView === 'cards' && <Cards onBack={() => setCurrentView('dashboard')} />}
          {currentView === 'settings' && <AccountSettings onBack={() => setCurrentView('dashboard')} />}
        </main>
      </div>
    </div>
  );
}
