import { useState } from 'react';
import { Camera, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { LoadingOverlay } from './loading-overlay';

interface DepositCheckProps {
  onBack?: () => void;
  onDeposit: (accountId: string | number, amount: number) => void;
}

export function DepositCheck({ onBack, onDeposit }: DepositCheckProps) {
  const [amount, setAmount] = useState('');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('Checking'); // Simple selection for now

  const handleImageUpload = (side: 'front' | 'back', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === 'front') {
          setFrontImage(reader.result as string);
        } else {
          setBackImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onDeposit(selectedAccount, parseFloat(amount));
      setIsSubmitting(false);
      setShowSuccess(true);
      setAmount('');
      setFrontImage(null);
      setBackImage(null);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {isSubmitting && <LoadingOverlay />}
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
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Deposit Check</h1>
          <p className="text-gray-600">Mobile check deposit made easy and secure</p>
        </div>
      </div>

      {showSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">
          <Check className="h-5 w-5" />
          <p>Check deposit submitted successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Select Account</label>
          <select 
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            <option value="Checking">Trust Bank One Checking</option>
            <option value="Savings">Trust Bank One Money Market</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Check Amount</label>
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

        <div className="grid gap-6 md:grid-cols-2">
          {/* Front of Check */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Front of Check</label>
            <div className="relative flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('front', e)}
                className="absolute inset-0 opacity-0 cursor-pointer"
                required
              />
              {frontImage ? (
                <img
                  src={frontImage}
                  alt="Front of check"
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <Camera className="mb-2 h-8 w-8" />
                  <span className="text-sm">Upload Front</span>
                </div>
              )}
            </div>
          </div>

          {/* Back of Check */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Back of Check</label>
            <div className="relative flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('back', e)}
                className="absolute inset-0 opacity-0 cursor-pointer"
                required
              />
              {backImage ? (
                <img
                  src={backImage}
                  alt="Back of check"
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <Camera className="mb-2 h-8 w-8" />
                  <span className="text-sm">Upload Back</span>
                </div>
              )}
            </div>
            <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              <AlertCircle className="h-3 w-3" />
              Ensure "For Mobile Deposit Only" is written
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <h4 className="mb-2 text-sm font-medium text-blue-900">Deposit Limits</h4>
          <div className="flex justify-between text-sm text-blue-800">
            <span>Daily Limit:</span>
            <span>$5,000.00</span>
          </div>
          <div className="flex justify-between text-sm text-blue-800">
            <span>Remaining Today:</span>
            <span>$5,000.00</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#3d2759] py-3 text-white transition-colors hover:bg-[#4d3569] disabled:opacity-50"
        >
          Submit Deposit
        </button>
      </form>
    </div>
  );
}
