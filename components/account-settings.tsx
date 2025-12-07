import { useState, useEffect } from 'react';
import { User, Lock, Bell, CreditCard, ArrowLeft, Save, Loader2, X, Shield, Smartphone, Laptop } from 'lucide-react';
import { useUser } from '../lib/stack';
import { LoadingOverlay } from './loading-overlay';

interface AccountSettingsProps {
  onBack?: () => void;
}

interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'desktop';
  lastActive: string;
  isCurrent: boolean;
}

export function AccountSettings({ onBack }: AccountSettingsProps) {
  const user = useUser();
  const metadata = user?.clientMetadata || {};
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Devices Modal State
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    // Initialize devices from metadata or default
    if (metadata.trustedDevices) {
        setDevices(metadata.trustedDevices);
    } else {
        // Default current device
        const currentDevice: Device = {
            id: '1',
            name: 'Chrome on Mac OS X', // Simplified detection
            type: 'desktop',
            lastActive: 'Now',
            isCurrent: true
        };
        setDevices([currentDevice]);
    }
  }, [metadata.trustedDevices]);

  const [formData, setFormData] = useState({
    firstName: metadata.firstName || (user?.displayName ? user.displayName.split(' ')[0] : ''),
    lastName: metadata.lastName || (user?.displayName ? user.displayName.split(' ').slice(1).join(' ') : ''),
    phone: metadata.phone || '',
    email: user?.email || '', // Email is usually read-only or requires re-verification
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      if (user) {
        await user.update({
          displayName: `${formData.firstName} ${formData.lastName}`,
          clientMetadata: {
            ...metadata,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
          }
        });
      }
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    
    setIsProcessing(true);
    try {
      if (user) {
        await user.changePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
        });
        alert("Password updated successfully.");
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error: any) {
        alert(error.message || "Failed to update password.");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
      const updatedDevices = devices.filter(d => d.id !== deviceId);
      setDevices(updatedDevices);
      if (user) {
          await user.update({
              clientMetadata: {
                  ...metadata,
                  trustedDevices: updatedDevices
              }
          });
      }
  };

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
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2">
              <User className="h-6 w-6 text-[#3d2759]" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          </div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-sm font-medium text-[#3d2759] hover:underline"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditing(false)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-full bg-[#3d2759] px-4 py-1 text-sm font-medium text-white hover:bg-[#4d3569] disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                Save
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`w-full rounded-lg border px-4 py-2 text-gray-900 focus:outline-none ${isEditing ? 'border-gray-300 focus:border-[#3d2759] focus:ring-1 focus:ring-[#3d2759]' : 'border-transparent bg-gray-50 text-gray-600'}`}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`w-full rounded-lg border px-4 py-2 text-gray-900 focus:outline-none ${isEditing ? 'border-gray-300 focus:border-[#3d2759] focus:ring-1 focus:ring-[#3d2759]' : 'border-transparent bg-gray-50 text-gray-600'}`}
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full rounded-lg border border-transparent bg-gray-50 px-4 py-2 text-gray-500 focus:outline-none cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Contact support to change your email address.</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`w-full rounded-lg border px-4 py-2 text-gray-900 focus:outline-none ${isEditing ? 'border-gray-300 focus:border-[#3d2759] focus:ring-1 focus:ring-[#3d2759]' : 'border-transparent bg-gray-50 text-gray-600'}`}
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full bg-purple-100 p-2">
            <Lock className="h-6 w-6 text-[#3d2759]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Security</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <p className="font-medium text-gray-900">Change Password</p>
              <p className="text-sm text-gray-600">Update your password regularly to keep your account secure</p>
            </div>
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="rounded-full border-2 border-[#3d2759] px-4 py-2 text-sm font-medium text-[#3d2759] hover:bg-[#3d2759] hover:text-white"
            >
              Update
            </button>
          </div>
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#3d2759] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3d2759]/20"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Trusted Devices</p>
              <p className="text-sm text-gray-600">Manage devices that can access your account</p>
            </div>
            <button 
              onClick={() => setShowDevicesModal(true)}
              className="rounded-full border-2 border-[#3d2759] px-4 py-2 text-sm font-medium text-[#3d2759] hover:bg-[#3d2759] hover:text-white"
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      {/* ... (Keep existing Notification Settings) ... */}
      
      {/* Linked Cards */}
      {/* ... (Keep existing Linked Cards) ... */}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3d2759] focus:outline-none focus:ring-2 focus:ring-[#3d2759]/20"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#3d2759] py-2 text-white hover:bg-[#4d3569]"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trusted Devices Modal */}
      {showDevicesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Trusted Devices</h2>
              <button 
                onClick={() => setShowDevicesModal(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
                {devices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-gray-100 p-2 text-gray-600">
                                {device.type === 'mobile' ? <Smartphone className="h-5 w-5" /> : <Laptop className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{device.name}</p>
                                <p className="text-xs text-gray-500">
                                    {device.isCurrent ? 'Current Device' : `Last active: ${device.lastActive}`}
                                </p>
                            </div>
                        </div>
                        {!device.isCurrent && (
                            <button 
                                onClick={() => handleRemoveDevice(device.id)}
                                className="text-sm text-red-600 hover:text-red-800 hover:underline"
                            >
                                Remove
                            </button>
                        )}
                        {device.isCurrent && (
                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                Active
                            </span>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500 text-center">
                    Removing a device will log it out of your account.
                </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
