import { useState } from 'react';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Search, Download, Filter } from 'lucide-react';
import { Account, Transaction } from './banking-dashboard';

interface AccountDetailsProps {
  account: Account;
  onBack: () => void;
  transactions: Transaction[];
}

export function AccountDetails({ account, onBack, transactions }: AccountDetailsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.amount.toString().includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{account.name}</h1>
          <p className="text-gray-600">{account.accountNumber} • {account.type}</p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="rounded-xl bg-[#3d2759] p-8 text-white shadow-lg">
        <p className="mb-2 text-purple-200">Current Balance</p>
        <h2 className="text-4xl font-bold">${Math.abs(account.balance).toFixed(2)}</h2>
        <div className="mt-6 flex gap-8">
          <div>
            <p className="text-sm text-purple-200">Available Balance</p>
            <p className="text-lg font-semibold">${Math.abs(account.balance).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-purple-200">Interest YTD</p>
            <p className="text-lg font-semibold">$12.45</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50">
          <div className="rounded-full bg-blue-100 p-3 text-blue-600">
            <ArrowUpRight className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium">Transfer</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50">
          <div className="rounded-full bg-green-100 p-3 text-green-600">
            <Download className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium">Statements</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50">
          <div className="rounded-full bg-purple-100 p-3 text-purple-600">
            <Filter className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>

      {/* Transactions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-[#3d2759] focus:outline-none focus:ring-1 focus:ring-[#3d2759]"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-4">
                <div className={`rounded-full p-2 ${transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  {transaction.type === 'credit' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.date} • {transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                  {transaction.type === 'credit' ? '+' : ''}{transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
