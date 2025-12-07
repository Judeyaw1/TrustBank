import { useState, useEffect } from 'react';
import { Check, Shield, CreditCard, Wallet, TrendingUp, ChevronRight, Clock, User, DollarSign, Briefcase, MapPin, Phone, Calendar, Flag, ArrowLeft } from 'lucide-react';

interface OpenAccountProps {
  onBack?: () => void;
}

export function OpenAccount({ onBack }: OpenAccountProps) {
  const [view, setView] = useState<'selection' | 'form' | 'status'>('selection');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    citizenship: 'US',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    employmentStatus: 'employed',
    annualIncome: '',
    initialDeposit: '',
    ssn: '',
  });
  const [applicationStatus, setApplicationStatus] = useState<'pending' | 'approved' | null>(null);

  useEffect(() => {
    // Check for existing application status on mount
    const storedApp = localStorage.getItem('trust_bank_application');
    if (storedApp) {
      const { timestamp } = JSON.parse(storedApp);
      // Check if 10 minutes (600,000 ms) have passed
      if (Date.now() - timestamp > 10 * 60 * 1000) {
        setApplicationStatus('approved');
      } else {
        setApplicationStatus('pending');
      }
    }
  }, []);

  const accountTypes = [
    {
      id: 'checking',
      title: 'Checking Account',
      description: 'Daily spending with no monthly fees',
      icon: Wallet,
      features: ['No monthly maintenance fees', 'Free mobile banking app', 'Debit card included'],
      color: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'savings',
      title: 'Savings Account',
      description: 'Grow your money with competitive rates',
      icon: TrendingUp,
      features: ['Competitive interest rates', 'Automatic savings plan', 'No minimum balance'],
      color: 'bg-green-100 text-green-700',
    },
    {
      id: 'credit',
      title: 'Credit Card',
      description: 'Earn rewards on every purchase',
      icon: CreditCard,
      features: ['Cash back on purchases', 'No annual fee', 'Fraud protection'],
      color: 'bg-purple-100 text-purple-700',
    },
  ];

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    setView('form');
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call and save to local storage
    setTimeout(() => {
      const applicationData = {
        type: selectedType,
        ...formData,
        timestamp: Date.now(),
        status: 'pending'
      };
      
      localStorage.setItem('trust_bank_application', JSON.stringify(applicationData));
      
      setIsProcessing(false);
      setApplicationStatus('pending');
      setView('status');
    }, 2000);
  };

  const handleRefreshStatus = () => {
    const storedApp = localStorage.getItem('trust_bank_application');
    if (storedApp) {
      const { timestamp } = JSON.parse(storedApp);
      if (Date.now() - timestamp > 10 * 60 * 1000) {
        setApplicationStatus('approved');
      } else {
        alert('Application is still pending. Please check back later.');
      }
    }
  };

  const handleReset = () => {
    localStorage.removeItem('trust_bank_application');
    setApplicationStatus(null);
    setSelectedType(null);
    setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        citizenship: 'US',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        employmentStatus: 'employed',
        annualIncome: '',
        initialDeposit: '',
        ssn: '',
    });
    setView('selection');
  }

  // Render Status View
  if (view === 'status' || (view === 'selection' && applicationStatus)) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            {applicationStatus === 'approved' ? (
                 <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-8 w-8 text-green-600" />
                 </div>
            ) : (
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                    <Clock className="h-8 w-8 text-yellow-600" />
                </div>
            )}
         
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            {applicationStatus === 'approved' ? 'Application Approved!' : 'Application Pending'}
          </h1>
          <p className="text-gray-600 mb-8">
            {applicationStatus === 'approved' 
                ? 'Congratulations! Your account has been verified and opened.' 
                : 'Your application has been received and is currently under review.'}
          </p>

          <div className="rounded-lg bg-gray-50 p-6 text-left mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Application Details</h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Account Type</span>
                    <span className="font-medium capitalize">{selectedType || 'Checking Account'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Reference ID</span>
                    <span className="font-medium">APP-{Math.floor(Math.random() * 1000000)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-medium capitalize ${applicationStatus === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {applicationStatus}
                    </span>
                </div>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
              {applicationStatus === 'pending' && (
                  <button
                    onClick={handleRefreshStatus}
                    className="rounded-full border border-[#3d2759] px-6 py-2 text-[#3d2759] hover:bg-gray-50"
                  >
                    Check Status
                  </button>
              )}
              {applicationStatus === 'approved' && onBack && (
                  <button
                    onClick={onBack}
                    className="rounded-full bg-[#3d2759] px-6 py-2 text-white hover:bg-[#4d3569]"
                  >
                    Go to Dashboard
                  </button>
              )}
               <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Start New Application
              </button>
          </div>
          
           {applicationStatus === 'pending' && (
              <p className="mt-6 text-xs text-gray-400">
                  (Test Mode: Verification approves automatically after 10 minutes)
              </p>
           )}
        </div>
      </div>
    );
  }

  // Render Form View
  if (view === 'form' && selectedType) {
    const type = accountTypes.find((t) => t.id === selectedType);
    if (!type) return null;

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <button
          onClick={() => setView('selection')}
          className="text-sm text-[#3d2759] hover:underline"
        >
          &larr; Back to Account Types
        </button>

        <div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Apply for {type.title}</h1>
          <p className="text-gray-600">Please provide your details for verification</p>
        </div>

        <form onSubmit={handleSubmitApplication} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${type.color}`}>
                  <type.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{type.title}</h3>
                  <p className="text-xs text-gray-600">{type.description}</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Details */}
                <div className="md:col-span-2">
                    <h4 className="mb-4 text-sm font-semibold text-gray-900 uppercase tracking-wider">Personal Information</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Date of Birth</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="date"
                                    value={formData.dob}
                                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    placeholder="(555) 123-4567"
                                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">SSN (Last 4 Digits)</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    maxLength={4}
                                    value={formData.ssn}
                                    onChange={(e) => setFormData({...formData, ssn: e.target.value})}
                                    placeholder="1234"
                                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Citizenship</label>
                            <div className="relative">
                                <Flag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <select
                                    value={formData.citizenship}
                                    onChange={(e) => setFormData({...formData, citizenship: e.target.value})}
                                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                                >
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Details */}
                <div className="md:col-span-2">
                    <h4 className="mb-4 text-sm font-semibold text-gray-900 uppercase tracking-wider">Residential Address</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-700">Street Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.streetAddress}
                                    onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
                                    placeholder="123 Main St"
                                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">State</label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">ZIP Code</label>
                                <input
                                    type="text"
                                    value={formData.zipCode}
                                    onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Details */}
                <div className="md:col-span-2">
                    <h4 className="mb-4 text-sm font-semibold text-gray-900 uppercase tracking-wider">Financial Information</h4>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Employment Status</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <select
                                    value={formData.employmentStatus}
                                    onChange={(e) => setFormData({...formData, employmentStatus: e.target.value})}
                                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                                >
                                    <option value="employed">Employed</option>
                                    <option value="self-employed">Self-Employed</option>
                                    <option value="student">Student</option>
                                    <option value="retired">Retired</option>
                                    <option value="unemployed">Unemployed</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Annual Income</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="number"
                                    value={formData.annualIncome}
                                    onChange={(e) => setFormData({...formData, annualIncome: e.target.value})}
                                    placeholder="e.g. 50000"
                                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Initial Deposit</label>
                            <div className="relative">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                                <input
                                    type="number"
                                    value={formData.initialDeposit}
                                    onChange={(e) => setFormData({...formData, initialDeposit: e.target.value})}
                                    placeholder="0.00"
                                    className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800 flex gap-3">
                <Shield className="h-5 w-5 flex-shrink-0" />
                <p>
                    By submitting this application, you authorize Trust Bank to verify your identity and credit history.
                    False information may result in application denial.
                </p>
            </div>

            <button
                type="submit"
                disabled={isProcessing}
                className="w-full rounded-full bg-[#3d2759] py-3 text-white transition-colors hover:bg-[#4d3569] disabled:opacity-50"
            >
                {isProcessing ? 'Submitting Application...' : 'Submit Application'}
            </button>
        </form>
      </div>
    );
  }

  // Render Selection View
  return (
    <div className="mx-auto max-w-4xl space-y-6">
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
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Open a New Account</h1>
          <p className="text-gray-600">Select an account type to get started</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {accountTypes.map((type) => (
          <div
            key={type.id}
            className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${type.color}`}>
              <type.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">{type.title}</h3>
            <p className="mb-6 flex-1 text-sm text-gray-600">{type.description}</p>
            <ul className="mb-6 space-y-2">
              {type.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-xs text-gray-500">
                  <Check className="h-3 w-3 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSelectType(type.id)}
              className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg border border-[#3d2759] py-2 text-sm font-medium text-[#3d2759] transition-colors hover:bg-[#3d2759] hover:text-white"
            >
              Select
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-blue-50 p-6">
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 text-blue-700" />
          <div>
            <h3 className="mb-2 font-semibold text-blue-900">Secure & Protected</h3>
            <p className="text-sm text-blue-800">
              Your security is our top priority. All applications are encrypted and processed securely.
              Accounts are FDIC insured up to applicable limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
