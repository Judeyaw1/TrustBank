import { useState } from 'react';
import { Eye, EyeOff, QrCode, Loader2 } from 'lucide-react';
import { useStackApp } from '../lib/stack';

interface TrustBankLoginPageProps {
  onLogin?: () => void;
}

export function TrustBankLoginPage({ onLogin }: TrustBankLoginPageProps) {
  const app = useStackApp();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [saveUserId, setSaveUserId] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotUserId, setIsForgotUserId] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Registration form states
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    accountNumber: '',
    ssn: '',
    newUserId: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot User ID form state
  const [forgotUserIdData, setForgotUserIdData] = useState({
    email: '',
    lastName: '',
    ssnLast4: '',
  });

  // Reset Password form state
  const [resetPasswordData, setResetPasswordData] = useState({
    userId: '',
    email: '',
    lastName: '',
    ssnLast4: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Login attempted with:', { userId, password, saveUserId });
    
    try {
      // Simulate network latency for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Attempt sign in with Stack Auth
      // Assuming userId is email for Stack Auth default
      await app.signInWithCredential({ email: userId, password });
      if (onLogin) onLogin();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.newPassword !== registerData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Registration attempted with:', registerData);
    
    try {
      // Attempt registration
      const signUpResult = await app.signUpWithCredential({ 
        email: registerData.email, 
        password: registerData.newPassword,
        metadata: {
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          phone: registerData.phone,
          accountNumber: registerData.accountNumber,
          ssn: registerData.ssn,
          userId: registerData.newUserId,
          displayName: `${registerData.firstName} ${registerData.lastName}`,
          onboardingCompleted: false
        }
      });
      
      if (signUpResult.status === 'error') {
        throw new Error(signUpResult.error.message);
      }

      alert('Registration successful! Please sign in with your credentials.');
      setIsRegistering(false);
    } catch (error) {
      console.error("Registration failed:", error);
      if (error instanceof Error && error.message.includes("already exists")) {
        alert("Registration failed. An account with this email already exists.");
      } else {
        alert("Registration failed. Please try again.");
      }
    }
  };

  const handleForgotUserIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Forgot User ID attempted with:', forgotUserIdData);
    alert('If the information matches our records, you will receive an email with instructions to change your User ID.');
    setIsForgotUserId(false);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reset Password attempted with:', resetPasswordData);
    alert('If the information matches our records, you will receive an email with instructions to reset your password.');
    setIsResetPassword(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Promotional Content */}
      <div className="hidden w-1/2 bg-[#3d2759] p-12 text-white lg:flex lg:flex-col">
        <div className="flex flex-1 flex-col">
          {/* Icon */}
          <div className="mb-8">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="18"
                y="12"
                width="44"
                height="56"
                rx="4"
                stroke="white"
                strokeWidth="2.5"
                fill="none"
              />
              <rect
                x="22"
                y="8"
                width="36"
                height="8"
                rx="2"
                stroke="white"
                strokeWidth="2.5"
                fill="none"
              />
              <path
                d="M28 52 L38 62 L52 48"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="26"
                y1="28"
                x2="54"
                y2="28"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="26"
                y1="36"
                x2="46"
                y2="36"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Header */}
          <div className="mb-8">
            <p className="mb-4 tracking-wide text-purple-200">
              TRUST BANK ONE MONEY MARKET ACCOUNT
            </p>
            <h1 className="mb-6 text-4xl">
              Savings for &apos;just in case.&apos;
            </h1>
            <p className="text-purple-100">
              Earn interest with a new Trust Bank One Money Market Account.
              <sup>1</sup>
            </p>
          </div>

          {/* Features */}
          <div className="mb-12 space-y-6">
            <div>
              <h3 className="mb-2">Easy access</h3>
              <p className="text-purple-100">
                Use your debit card or checks to spend directly from your account.
                <sup>2</sup>
              </p>
            </div>

            <div>
              <h3 className="mb-2">Optional overdraft protection</h3>
              <p className="text-purple-100">
                Link your Trust Bank One Money Market Account to cover accidental overdrafts in a
                Trust Bank One checking account.<sup>2</sup>
              </p>
            </div>

            <div>
              <h3 className="mb-2">
                Savings balance builds toward Trust Bank One Checking perks
                <sup>3</sup>
              </h3>
              <p className="text-purple-100">
                Combined balances in your Trust Bank One Money Market Account can help unlock extra
                Trust Bank One Checking benefits.
              </p>
            </div>

            <div>
              <h3 className="mb-2">FDIC insured</h3>
              <p className="text-purple-100">Your money is protected up to the legal limit.</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-auto flex gap-4">
            <button className="rounded-full bg-purple-200 px-8 py-3 text-purple-900 transition-colors hover:bg-purple-300">
              Open online
            </button>
            <button className="rounded-full border-2 border-white px-8 py-3 transition-colors hover:bg-white/10">
              Learn more
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Login/Registration Form */}
      <div className="flex w-full flex-1 items-center justify-center bg-white p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center gap-2">
            <span className="tracking-wider text-[#3d2759]">TRUST BANK</span>
            <div className="flex h-8 w-8 items-center justify-center border-2 border-[#3d2759] text-[#3d2759]">
              <span className="font-serif">TB</span>
            </div>
          </div>

          {/* FDIC Notice */}
          <div className="mb-8 flex flex-col items-center justify-center gap-2 text-center">
            <div className="text-xs text-gray-600">
              <p>FDIC-Insured - Backed by the full faith and credit of the U.S. Government</p>
            </div>
            <div className="flex-shrink-0">
              <div className="rounded border-2 border-blue-900 px-2 py-1">
                <span className="tracking-wider text-blue-900">FDIC</span>
              </div>
            </div>
          </div>

          {!isRegistering && !isForgotUserId && !isResetPassword ? (
            /* Login Form */
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Address */}
                <div>
                  <label htmlFor="userId" className="mb-2 block text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="userId"
                    type="email"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                  <div className="mt-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={saveUserId}
                        onChange={(e) => setSaveUserId(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-600/20"
                      />
                      <span className="text-sm text-gray-700">Save email</span>
                    </label>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="mb-2 block text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 pr-12 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#8577a6] py-3 text-white transition-colors hover:bg-[#6f5f94] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>

                {/* Divider */}
                <div className="text-center text-gray-500">or</div>

                {/* QR Code Button */}
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#8577a6] py-3 text-[#8577a6] transition-colors hover:bg-purple-50"
                >
                  <QrCode className="h-5 w-5" />
                  <span>Sign in with QR code</span>
                </button>

                {/* Links */}
                <div className="space-y-2 text-center">
                  <div className="space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsForgotUserId(true)}
                      className="text-sm text-[#8577a6] hover:underline"
                    >
                      Forgot user ID
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsResetPassword(true)}
                      className="text-sm text-[#8577a6] hover:underline"
                    >
                      Reset password
                    </button>
                  </div>
                </div>
              </form>

              {/* Register */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an online user ID?{' '}
                  <button
                    onClick={() => setIsRegistering(true)}
                    className="text-[#8577a6] hover:underline"
                  >
                    Register now
                  </button>
                </p>
              </div>
            </>
          ) : isForgotUserId ? (
            /* Forgot User ID Form */
            <>
              <div className="mb-6">
                <h2 className="mb-2">Forgot User ID</h2>
                <p className="text-sm text-gray-600">
                  Enter your information to retrieve your User ID
                </p>
              </div>

              <form onSubmit={handleForgotUserIdSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="forgotEmail" className="mb-2 block text-sm text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="forgotEmail"
                    type="email"
                    required
                    value={forgotUserIdData.email}
                    onChange={(e) =>
                      setForgotUserIdData({ ...forgotUserIdData, email: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="forgotLastName" className="mb-2 block text-sm text-gray-700">
                    Last Name
                  </label>
                  <input
                    id="forgotLastName"
                    type="text"
                    required
                    value={forgotUserIdData.lastName}
                    onChange={(e) =>
                      setForgotUserIdData({ ...forgotUserIdData, lastName: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>

                {/* SSN Last 4 */}
                <div>
                  <label htmlFor="forgotSSN" className="mb-2 block text-sm text-gray-700">
                    Last 4 Digits of SSN
                  </label>
                  <input
                    id="forgotSSN"
                    type="text"
                    required
                    maxLength={4}
                    value={forgotUserIdData.ssnLast4}
                    onChange={(e) =>
                      setForgotUserIdData({ ...forgotUserIdData, ssnLast4: e.target.value })
                    }
                    placeholder="1234"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#8577a6] py-3 text-white transition-colors hover:bg-[#6f5f94]"
                >
                  Retrieve User ID
                </button>

                {/* Back to Login */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsForgotUserId(false)}
                    className="text-sm text-[#8577a6] hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            </>
          ) : isResetPassword ? (
            /* Reset Password Form */
            <>
              <div className="mb-6">
                <h2 className="mb-2">Reset Password</h2>
                <p className="text-sm text-gray-600">
                  Enter your information to reset your password
                </p>
              </div>

              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                {/* User ID */}
                <div>
                  <label htmlFor="resetUserId" className="mb-2 block text-sm text-gray-700">
                    User ID
                  </label>
                  <input
                    id="resetUserId"
                    type="text"
                    required
                    value={resetPasswordData.userId}
                    onChange={(e) =>
                      setResetPasswordData({ ...resetPasswordData, userId: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="resetEmail" className="mb-2 block text-sm text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="resetEmail"
                    type="email"
                    required
                    value={resetPasswordData.email}
                    onChange={(e) =>
                      setResetPasswordData({ ...resetPasswordData, email: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="resetLastName" className="mb-2 block text-sm text-gray-700">
                    Last Name
                  </label>
                  <input
                    id="resetLastName"
                    type="text"
                    required
                    value={resetPasswordData.lastName}
                    onChange={(e) =>
                      setResetPasswordData({ ...resetPasswordData, lastName: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>

                {/* SSN Last 4 */}
                <div>
                  <label htmlFor="resetSSN" className="mb-2 block text-sm text-gray-700">
                    Last 4 Digits of SSN
                  </label>
                  <input
                    id="resetSSN"
                    type="text"
                    required
                    maxLength={4}
                    value={resetPasswordData.ssnLast4}
                    onChange={(e) =>
                      setResetPasswordData({ ...resetPasswordData, ssnLast4: e.target.value })
                    }
                    placeholder="1234"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#8577a6] py-3 text-white transition-colors hover:bg-[#6f5f94]"
                >
                  Reset Password
                </button>

                {/* Back to Login */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsResetPassword(false)}
                    className="text-sm text-[#8577a6] hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Registration Form */
            <>
              <div className="mb-6">
                <h2 className="mb-2">Create Your Account</h2>
                <p className="text-sm text-gray-600">
                  Register for online banking access
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="mb-2 block text-sm text-gray-700">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={registerData.firstName}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, firstName: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="mb-2 block text-sm text-gray-700">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={registerData.lastName}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, lastName: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label htmlFor="accountNumber" className="mb-2 block text-sm text-gray-700">
                    Account Number
                  </label>
                  <input
                    id="accountNumber"
                    type="text"
                    required
                    value={registerData.accountNumber}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, accountNumber: e.target.value })
                    }
                    placeholder="Enter your Trust Bank account number"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>

                {/* SSN (Last 4 digits) */}
                <div>
                  <label htmlFor="ssn" className="mb-2 block text-sm text-gray-700">
                    Last 4 Digits of SSN
                  </label>
                  <input
                    id="ssn"
                    type="text"
                    required
                    maxLength={4}
                    value={registerData.ssn}
                    onChange={(e) => setRegisterData({ ...registerData, ssn: e.target.value })}
                    placeholder="1234"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>

                {/* Create User ID */}
                <div>
                  <label htmlFor="newUserId" className="mb-2 block text-sm text-gray-700">
                    Create User ID
                  </label>
                  <input
                    id="newUserId"
                    type="text"
                    required
                    value={registerData.newUserId}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, newUserId: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>

                {/* Create Password */}
                <div>
                  <label htmlFor="newPassword" className="mb-2 block text-sm text-gray-700">
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showRegisterPassword ? 'text' : 'password'}
                      required
                      value={registerData.newPassword}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, newPassword: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 8 characters with uppercase, lowercase, and numbers
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, confirmPassword: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="rounded-md bg-gray-50 p-3">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-600/20"
                    />
                    <span className="text-xs text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-[#8577a6] hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-[#8577a6] hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#8577a6] py-3 text-white transition-colors hover:bg-[#6f5f94]"
                >
                  Complete Registration
                </button>

                {/* Back to Login */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="text-sm text-[#8577a6] hover:underline"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}