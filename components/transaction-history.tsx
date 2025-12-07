import { useState } from 'react';
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, ArrowLeft } from 'lucide-react';
import { Transaction } from './banking-dashboard';

interface TransactionHistoryProps {
  onBack?: () => void;
  transactions: Transaction[];
}

export function TransactionHistory({ onBack, transactions }: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAccount, setFilterAccount] = useState('all');

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterAccount === 'all' ||
      transaction.account.toLowerCase() === filterAccount.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {onBack && (
          <button 
            onClick={onBack}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
        )}
        <div>
          <h1 className="mb-2">Transaction History</h1>
          <p className="text-gray-600">View and manage all your transactions</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <select
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              className="appearance-none rounded-lg border border-gray-300 py-2 pl-10 pr-8 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
            >
              <option value="all">All Accounts</option>
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="credit card">Credit Card</option>
            </select>
          </div>

          <button className="flex items-center gap-2 rounded-lg border-2 border-[#3d2759] px-4 py-2 text-[#3d2759] hover:bg-[#3d2759] hover:text-white">
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Date</th>
              <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Category</th>
              <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Account</th>
              <th className="px-6 py-3 text-right text-xs uppercase text-gray-600">Amount</th>
              <th className="px-6 py-3 text-right text-xs uppercase text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{transaction.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-full p-2 ${transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}
                    >
                      {transaction.amount > 0 ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <span className="text-sm text-gray-900">{transaction.description}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{transaction.category}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{transaction.account}</td>
                <td
                  className={`px-6 py-4 text-right text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs text-green-800">
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
