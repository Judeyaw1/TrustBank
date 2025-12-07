import { useState, useEffect } from 'react';
import { useUser } from '../lib/stack';
import { ArrowUpRight, ArrowDownLeft, CreditCard, Wallet, TrendingUp } from 'lucide-react';
import { View, Account, Transaction } from './banking-dashboard';
import { AccountDetails } from './account-details';

interface AccountsOverviewProps {
  onNavigate: (view: View) => void;
  accounts: Account[];
  transactions: Transaction[];
}

export function AccountsOverview({ onNavigate, accounts, transactions }: AccountsOverviewProps) {
  const user = useUser();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // Debugging user metadata
  useEffect(() => {
    console.log('User Metadata Debug:', user?.clientMetadata);
  }, [user]);

  // Use the first 5 transactions from the prop
  const recentTransactions = transactions.slice(0, 5);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  if (selectedAccount) {
    // Filter transactions for this specific account to ensure consistency
    const accountTransactions = transactions.filter(t => t.account === selectedAccount.name);
    return <AccountDetails account={selectedAccount} onBack={() => setSelectedAccount(null)} transactions={accountTransactions} />;
  }

  // Prioritize the custom 'userId' stored in metadata
  const welcomeName = user?.clientMetadata?.userId || user?.displayName || 'User';

  // Use displayName in settings if available, otherwise fall back to joined names
  const userDisplayName = user?.displayName || `${user?.clientMetadata?.firstName || ''} ${user?.clientMetadata?.lastName || ''}`.trim();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="mb-2">Welcome back, {welcomeName}</h1>
        <p className="text-gray-600">Here&apos;s your financial overview</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <button 
          onClick={() => onNavigate('send-money')}
          className="flex items-center gap-3 rounded-lg border-2 border-[#3d2759] bg-white p-4 text-[#3d2759] transition-colors hover:bg-[#3d2759] hover:text-white"
        >
          <ArrowUpRight className="h-5 w-5" />
          <span>Send Money</span>
        </button>
        <button 
          onClick={() => onNavigate('deposit')}
          className="flex items-center gap-3 rounded-lg border-2 border-[#3d2759] bg-white p-4 text-[#3d2759] transition-colors hover:bg-[#3d2759] hover:text-white"
        >
          <ArrowDownLeft className="h-5 w-5" />
          <span>Deposit Check</span>
        </button>
        <button 
          onClick={() => onNavigate('bills')}
          className="flex items-center gap-3 rounded-lg border-2 border-[#3d2759] bg-white p-4 text-[#3d2759] transition-colors hover:bg-[#3d2759] hover:text-white"
        >
          <CreditCard className="h-5 w-5" />
          <span>Pay Bills</span>
        </button>
        <button 
          onClick={() => onNavigate('open-account')}
          className="flex items-center gap-3 rounded-lg border-2 border-[#3d2759] bg-white p-4 text-[#3d2759] transition-colors hover:bg-[#3d2759] hover:text-white"
        >
          <Wallet className="h-5 w-5" />
          <span>Open Account</span>
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="rounded-lg bg-gradient-to-r from-[#3d2759] to-[#5d3f79] p-6 text-white">
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <span className="text-purple-200">Total Balance</span>
        </div>
        <h2 className="mb-4">${totalBalance.toFixed(2)}</h2>
        <div className="flex gap-4 text-sm">
          <div>
            <p className="text-purple-200">This month</p>
            <p>+$2,450.00</p>
          </div>
          <div>
            <p className="text-purple-200">Last month</p>
            <p>+$3,120.50</p>
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      <div>
        <h2 className="mb-4">Your Accounts</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {accounts.map((account) => (
            <div 
              key={account.id} 
              onClick={() => setSelectedAccount(account)}
              className="rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-[#3d2759] hover:shadow-md cursor-pointer"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">{account.type}</span>
                {account.type === 'checking' && <Wallet className="h-5 w-5 text-[#3d2759]" />}
                {account.type === 'savings' && (
                  <TrendingUp className="h-5 w-5 text-[#3d2759]" />
                )}
                {account.type === 'credit' && <CreditCard className="h-5 w-5 text-[#3d2759]" />}
              </div>
              <h3 className="mb-1">{account.name}</h3>
              <p className="mb-4 text-sm text-gray-600">{account.accountNumber}</p>
              <p
                className={`text-2xl ${account.balance < 0 ? 'text-red-600' : 'text-gray-900'}`}
              >
                ${Math.abs(account.balance).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2>Recent Transactions</h2>
          <button onClick={() => onNavigate('transactions')} className="text-[#3d2759] hover:underline">View all</button>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="divide-y divide-gray-200">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-full p-2 ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}
                  >
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p>{transaction.description}</p>
                    <p className="text-sm text-gray-600">{transaction.date}</p>
                  </div>
                </div>
                <p
                  className={`${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
