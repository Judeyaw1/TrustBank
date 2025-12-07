import { useState } from 'react';
import { ArrowRight, Check, CreditCard, Shield, Landmark } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
  userName: string;
}

export function Onboarding({ onComplete, userName }: OnboardingProps) {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        {step === 1 && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
              <Landmark className="h-10 w-10 text-purple-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Welcome to Trust Bank, {userName}!</h2>
            <p className="mb-8 text-gray-600">
              We're excited to have you on board. Let's get your account set up in just a few steps.
            </p>
            <button
              onClick={nextStep}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3d2759] py-3 font-medium text-white transition-colors hover:bg-[#2d1b42]"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <Shield className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Secure Your Account</h2>
            <p className="mb-8 text-gray-600">
              We use industry-standard encryption to keep your data safe. Please enable two-factor authentication for added security.
            </p>
            <div className="space-y-3">
              <button
                onClick={nextStep}
                className="w-full rounded-full bg-[#3d2759] py-3 font-medium text-white transition-colors hover:bg-[#2d1b42]"
              >
                Enable 2FA (Recommended)
              </button>
              <button
                onClick={nextStep}
                className="w-full rounded-full border border-gray-300 py-3 font-medium text-gray-600 hover:bg-gray-50"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CreditCard className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Your Accounts are Ready</h2>
            <p className="mb-8 text-gray-600">
              You can now view your balances, make transfers, and deposit checks from your dashboard.
            </p>
            <button
              onClick={onComplete}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3d2759] py-3 font-medium text-white transition-colors hover:bg-[#2d1b42]"
            >
              Go to Dashboard <Check className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === step ? 'bg-[#3d2759]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

