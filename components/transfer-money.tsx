import { useState } from 'react';
import { ArrowRight, Calendar, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Account } from './banking-dashboard';
import { LoadingOverlay } from './loading-overlay';

interface TransferMoneyProps {
  onBack?: () => void;
  accounts: Account[];
  onTransfer: (fromId: string | number, toId: string | number, amount: number, memo: string) => void;
}

export function TransferMoney({ onBack, accounts, onTransfer }: TransferMoneyProps) {
  const [fromAccount, setFromAccount] = useState(accounts[0]?.id.toString() || '');
  const [toAccount, setToAccount] = useState(accounts[1]?.id.toString() || '');
  const [amount, setAmount] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [memo, setMemo] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      onTransfer(fromAccount, toAccount, parseFloat(amount), memo);
      setIsProcessing(false);
      setShowSuccess(true);
      setAmount('');
      setMemo('');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        if (onBack) onBack();
      }, 3000);
    }, 2000);
  };

  const fromAccountData = accounts.find((acc) => acc.id.toString() === fromAccount.toString());
  const toAccountData = accounts.find((acc) => acc.id.toString() === toAccount.toString());

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {isProcessing && <LoadingOverlay />}
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
          <h1 className="mb-2">Transfer Money</h1>
          <p className="text-gray-600">Transfer funds between your accounts</p>
        </div>
      </div>

      {showSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700 animate-in fade-in slide-in-from-top-2">
          <Check className="h-5 w-5" />
          <p>Transfer completed successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
        {/* From Account */}
        <div>
          <label className="mb-2 block text-gray-700">From Account</label>
          <select
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} {account.accountNumber} - ${account.balance.toFixed(2)}
              </option>
            ))}
          </select>
          {fromAccountData && (
            <p className="mt-2 text-sm text-gray-600">
              Available balance: ${fromAccountData.balance.toFixed(2)}
            </p>
          )}
        </div>

        {/* Arrow Indicator */}
        <div className="flex justify-center">
          <div className="rounded-full bg-[#3d2759] p-3">
            <ArrowRight className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* To Account */}
        <div>
          <label className="mb-2 block text-gray-700">To Account</label>
          <select
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
          >
            {accounts
              .filter((acc) => acc.id.toString() !== fromAccount.toString())
              .map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} {account.accountNumber}
                </option>
              ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="mb-2 block text-gray-700">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full rounded-lg border border-gray-300 py-3 pl-8 pr-4 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
            />
          </div>
        </div>

        {/* Transfer Date */}
        <div>
          <label className="mb-2 block text-gray-700">Transfer Date</label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
            />
          </div>
        </div>

        {/* Recurring Transfer */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-[#3d2759] focus:ring-2 focus:ring-[#3d2759]/20"
            />
            <span className="text-gray-700">Make this a recurring transfer</span>
          </label>
        </div>

        {/* Memo */}
        <div>
          <label className="mb-2 block text-gray-700">Memo (Optional)</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Add a note for this transfer"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
          />
        </div>

        {/* Summary */}
        {amount && (
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="mb-2 text-sm text-gray-600">Transfer Summary</p>
            <div className="space-y-1">
              <p className="flex justify-between">
                <span>From:</span>
                <span>{fromAccountData?.name}</span>
              </p>
              <p className="flex justify-between">
                <span>To:</span>
                <span>{toAccountData?.name}</span>
              </p>
              <p className="flex justify-between">
                <span>Amount:</span>
                <span>${parseFloat(amount).toFixed(2)}</span>
              </p>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="flex-1 rounded-full border-2 border-gray-300 py-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#3d2759] py-3 text-white hover:bg-[#4d3569] disabled:opacity-50"
          >
            Transfer Funds
          </button>
        </div>
      </form>
    </div>
  );
}
