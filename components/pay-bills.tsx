import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft, X, Check } from 'lucide-react';
import { Account, Transaction } from './banking-dashboard';
import { LoadingOverlay } from './loading-overlay';

interface PayBillsProps {
  onBack?: () => void;
  accounts: Account[];
  transactions: Transaction[];
  onPayBill: (fromAccountId: string | number, amount: number, payeeName: string) => void;
}

export function PayBills({ onBack, accounts, transactions, onPayBill }: PayBillsProps) {
  const [payees, setPayees] = useState<Array<{id: number, name: string, accountNumber: string, amount: number}>>([]);

  // Load payees from localStorage on mount
  useEffect(() => {
    const savedPayees = localStorage.getItem('trust_bank_payees');
    if (savedPayees) {
      setPayees(JSON.parse(savedPayees));
    }
  }, []);

  // Save payees to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('trust_bank_payees', JSON.stringify(payees));
  }, [payees]);

  const handleDeletePayee = (id: number) => {
    setPayees(payees.filter(p => p.id !== id));
  };

  const [showAddPayee, setShowAddPayee] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [fromAccount, setFromAccount] = useState(accounts[0]?.id.toString() || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [newPayee, setNewPayee] = useState({
    name: '',
    accountNumber: '',
    amount: '',
  });

  const handleAddPayee = (e: React.FormEvent) => {
    e.preventDefault();
    const payee = {
      id: Date.now(),
      name: newPayee.name,
      accountNumber: newPayee.accountNumber,
      amount: parseFloat(newPayee.amount) || 0,
    };
    setPayees([...payees, payee]);
    setShowAddPayee(false);
    setNewPayee({ name: '', accountNumber: '', amount: '' });
  };

  const handlePayClick = (payee: any) => {
    setSelectedPayee(payee);
    setPaymentAmount(payee.amount > 0 ? payee.amount.toString() : '');
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPaymentModal(false);
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      onPayBill(fromAccount, parseFloat(paymentAmount), selectedPayee.name);
      setIsProcessing(false);
      setShowSuccess(true);
      setPaymentAmount('');
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  const selectedAccountData = accounts.find((acc) => acc.id.toString() === fromAccount.toString());

  // Filter transactions for bill payments
  const billTransactions = transactions
    .filter(t => t.category === 'Bills & Utilities')
    .slice(0, 5); // Show last 5

  return (
    <div className="space-y-6">
      {isProcessing && <LoadingOverlay />}
      
      {showSuccess && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700 shadow-lg animate-in fade-in slide-in-from-top-2">
          <Check className="h-5 w-5" />
          <p>Bill payment successful!</p>
        </div>
      )}

      <div className="flex items-center justify-between">
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
            <h1 className="mb-2">Pay Bills</h1>
            <p className="text-gray-600">Manage and pay your bills</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddPayee(true)}
          className="flex items-center gap-2 rounded-full bg-[#3d2759] px-6 py-3 text-white hover:bg-[#4d3569]"
        >
          <Plus className="h-5 w-5" />
          <span>Add Payee</span>
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPayee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Pay {selectedPayee.name}</h2>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">From Account</label>
                <select
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} {account.accountNumber}
                    </option>
                  ))}
                </select>
                {selectedAccountData && (
                  <p className="mt-1 text-xs text-gray-600">
                    Available: ${selectedAccountData.balance.toFixed(2)}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Payment Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#3d2759] py-2 text-white hover:bg-[#4d3569]"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Payee Modal */}
      {showAddPayee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Payee</h2>
              <button 
                onClick={() => setShowAddPayee(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleAddPayee} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Payee Name</label>
                <input
                  type="text"
                  placeholder="e.g. Water Company"
                  value={newPayee.name}
                  onChange={(e) => setNewPayee({ ...newPayee, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                  required
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Account Number</label>
                <input
                  type="text"
                  placeholder="Enter account number"
                  value={newPayee.accountNumber}
                  onChange={(e) => setNewPayee({ ...newPayee, accountNumber: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Default Amount (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newPayee.amount}
                    onChange={(e) => setNewPayee({ ...newPayee, amount: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPayee(false)}
                  className="flex-1 rounded-lg border border-gray-300 py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#3d2759] py-2 text-white hover:bg-[#4d3569]"
                >
                  Add Payee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Saved Payees */}
      <div>
        <h2 className="mb-4">Saved Payees</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {payees.map((payee) => (
            <div
              key={payee.id}
              className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900">{payee.name}</h3>
                  <p className="text-sm text-gray-600">Account: {payee.accountNumber}</p>
                </div>
                <button 
                  onClick={() => handleDeletePayee(payee.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div className="mb-4">
                <p className="mb-1 text-sm text-gray-600">Last payment</p>
                <p className="text-2xl font-bold text-gray-900">${payee.amount.toFixed(2)}</p>
              </div>
              <button 
                onClick={() => handlePayClick(payee)}
                className="w-full rounded-full bg-[#3d2759] py-2 text-white hover:bg-[#4d3569] transition-colors"
              >
                Pay Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bill Payments */}
      <div>
        <h2 className="mb-4">Recent Bill Payments</h2>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Date</th>
                <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Description</th>
                <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Account</th>
                <th className="px-6 py-3 text-right text-xs uppercase text-gray-600">Amount</th>
                <th className="px-6 py-3 text-right text-xs uppercase text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {billTransactions.length > 0 ? (
                billTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{transaction.account}</td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">${Math.abs(transaction.amount).toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs text-green-800">
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No recent bill payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
