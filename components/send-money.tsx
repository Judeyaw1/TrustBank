import { useState } from 'react';
import { Send, Users, History, AlertCircle, Check, DollarSign, ArrowLeft, ArrowDownCircle } from 'lucide-react';
import { LoadingOverlay } from './loading-overlay';
import { Account } from './banking-dashboard';

interface SendMoneyProps {
  onBack?: () => void;
  onSend: (fromAccountId: string | number, amount: number, recipient: string, memo: string) => void;
  onRequest?: (toAccountId: string | number, amount: number, sender: string, memo: string) => void;
  accounts: Account[];
  transactions?: Transaction[]; // Add transactions prop
}

export function SendMoney({ onBack, onSend, onRequest, accounts, transactions = [] }: SendMoneyProps) {
  const [activeTab, setActiveTab] = useState<'send' | 'request'>('send');
  // ...
  
  // Filter for Zelle/Transfer transactions
  const recentActivity = transactions
    .filter(t => t.category === 'Transfer' || t.description.includes('Sent to') || t.description.includes('Request'))
    .slice(0, 5); // Show top 5
  const [fromAccount, setFromAccount] = useState(accounts[0]?.id.toString() || '');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [showAddRecipient, setShowAddRecipient] = useState(false);
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [newRecipientPhone, setNewRecipientPhone] = useState('');
  const [newRecipientInitial, setNewRecipientInitial] = useState('');

  const [recentRecipients, setRecentRecipients] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', phone: '555-0101', initial: 'AS', color: 'bg-blue-100 text-blue-700' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-0102', initial: 'BJ', color: 'bg-green-100 text-green-700' },
    { id: 3, name: 'Carol Williams', email: 'carol@example.com', phone: '555-0103', initial: 'CW', color: 'bg-purple-100 text-purple-700' },
  ]);

  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipientName) return;
    
    const initial = newRecipientInitial || newRecipientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-purple-100 text-purple-700', 'bg-yellow-100 text-yellow-700', 'bg-pink-100 text-pink-700'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newRecipient = {
      id: Date.now(),
      name: newRecipientName,
      email: newRecipientEmail,
      phone: newRecipientPhone,
      initial: initial,
      color: randomColor
    };

    setRecentRecipients([newRecipient, ...recentRecipients]);
    // Prefer email or phone if available, otherwise fall back to name
    setRecipient(newRecipientEmail || newRecipientPhone || newRecipientName);
    
    setShowAddRecipient(false);
    setNewRecipientName('');
    setNewRecipientEmail('');
    setNewRecipientPhone('');
    setNewRecipientInitial('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      if (activeTab === 'send') {
        onSend(fromAccount, parseFloat(amount), recipient, note);
        setSuccessMessage('Money sent successfully!');
      } else {
        // Handle request logic here (can be added to banking-dashboard later)
        console.log('Requesting money from', recipient);
        setSuccessMessage('Request sent successfully!');
      }
      
      setIsProcessing(false);
      setShowSuccess(true);
      setRecipient('');
      setAmount('');
      setNote('');
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const selectedAccountData = accounts.find((acc) => acc.id.toString() === fromAccount.toString());

  return (
    <div className="mx-auto max-w-4xl space-y-6">
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
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Send & Request with Zelle®</h1>
          <p className="text-gray-600">Send money or split the bill with friends and family</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {showSuccess && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">
              <Check className="h-5 w-5" />
              <p>{successMessage}</p>
            </div>
          )}

          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('send')}
                className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
                  activeTab === 'send'
                    ? 'bg-white text-[#3d2759] border-b-2 border-[#3d2759]'
                    : 'bg-gray-50 text-gray-500 hover:text-gray-700'
                }`}
              >
                Send Money
              </button>
              <button
                onClick={() => setActiveTab('request')}
                className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
                  activeTab === 'request'
                    ? 'bg-white text-[#3d2759] border-b-2 border-[#3d2759]'
                    : 'bg-gray-50 text-gray-500 hover:text-gray-700'
                }`}
              >
                Request Money
              </button>
            </div>

            <div className="p-6">
              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                {activeTab === 'send' ? 'Send Payment' : 'Request Payment'}
              </h2>
              
              {/* Recent Recipients */}
              <div className="mb-8">
                <label className="mb-3 block text-sm font-medium text-gray-700">Recent People</label>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  <button 
                    onClick={() => setShowAddRecipient(true)}
                    className="flex flex-col items-center gap-2 min-w-[80px]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-gray-300 hover:border-[#3d2759] hover:bg-gray-50">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-600">New</span>
                  </button>
                  {recentRecipients.map((person) => (
                    <button
                      key={person.id}
                      onClick={() => setRecipient(person.email || person.phone || person.name)}
                      className="flex flex-col items-center gap-2 min-w-[80px]"
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${person.color} font-medium`}>
                        {person.initial}
                      </div>
                      <span className="text-xs text-gray-600 truncate w-full text-center">{person.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {showAddRecipient && (
                <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-4 text-sm font-semibold text-gray-900">Add New Recipient</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={newRecipientName}
                        onChange={(e) => setNewRecipientName(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#3d2759] focus:outline-none focus:ring-1 focus:ring-[#3d2759]"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        value={newRecipientEmail}
                        onChange={(e) => setNewRecipientEmail(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#3d2759] focus:outline-none focus:ring-1 focus:ring-[#3d2759]"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">Mobile Number</label>
                      <input
                        type="tel"
                        value={newRecipientPhone}
                        onChange={(e) => setNewRecipientPhone(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#3d2759] focus:outline-none focus:ring-1 focus:ring-[#3d2759]"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowAddRecipient(false)}
                        className="rounded-md px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddRecipient}
                        className="rounded-md bg-[#3d2759] px-3 py-2 text-xs font-medium text-white hover:bg-[#4d3569]"
                      >
                        Add Recipient
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* From Account (only for Sending) */}
                {activeTab === 'send' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">From Account</label>
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
                    {selectedAccountData && (
                      <p className="mt-2 text-sm text-gray-600">
                        Available balance: ${selectedAccountData.balance.toFixed(2)}
                      </p>
                    )}
                  </div>
                )}

                {/* Deposit To (only for Requesting) */}
                {activeTab === 'request' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Deposit To</label>
                    <select
                      value={fromAccount}
                      onChange={(e) => setFromAccount(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                    >
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name} {account.accountNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {activeTab === 'send' ? 'Recipient (Email or Mobile)' : 'Request From (Email or Mobile)'}
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter email or mobile number"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Memo (Optional)</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What is this for?"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                  />
                </div>

                {activeTab === 'send' && (
                  <div className="rounded-lg bg-blue-50 p-4 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-700 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                      Protect yourself from scams. Only send money to people you know and trust.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3d2759] py-3 text-white transition-colors hover:bg-[#4d3569] disabled:opacity-50"
                >
                  {activeTab === 'send' ? <Send className="h-4 w-4" /> : <ArrowDownCircle className="h-4 w-4" />}
                  <span>{activeTab === 'send' ? 'Send Money' : 'Request Money'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <History className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <DollarSign className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[120px]">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500 py-4">No recent activity</p>
              )}
              {recentActivity.length > 0 && (
                <button className="w-full text-center text-sm text-[#3d2759] hover:underline pt-2">
                  View All Activity
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
