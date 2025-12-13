import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiBell, FiLock, FiMonitor, FiCamera, FiMapPin, FiAward, FiGlobe } from 'react-icons/fi';
import { UserProfile } from '@/data/mockDashboardData';
import ModernToggle from '@/components/shared/ModernToggle';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface AccountTabProps {
  user: UserProfile;
}

type TabView = 'profile' | 'preferences' | 'security';

export default function AccountTab({ user }: AccountTabProps) {
  const { updateProfile, refreshUserData } = useAuth();
  const [activeTab, setActiveTab] = useState<TabView>('profile');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [defaultCounty, setDefaultCounty] = useState('New Castle');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSaveChanges = () => {
    alert('Profile updates will be available once backend integration is complete.');
  };

  const handleChangePassword = () => {
    alert('Password change will be available once backend integration is complete.');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') {
      alert('Please type DELETE to confirm account deletion');
      return;
    }

    // In production, this would call the delete account API
    alert('Account deletion will be available once backend integration is complete. This would permanently delete your account and all associated data.');
    setShowDeleteConfirm(false);
    setDeleteConfirmText('');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      // Update user profile with new avatar URL
      const { error: updateError } = await updateProfile({ avatar_url: publicUrl });

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setAvatarUrl(publicUrl);
      
      // Refresh user data
      await refreshUserData();
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Auto-close modal after 2 seconds
      setTimeout(() => setShowSuccessModal(false), 2000);
      
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const tabs = [
    { id: 'profile' as TabView, label: 'Profile', icon: FiUser },
    { id: 'preferences' as TabView, label: 'Preferences', icon: FiBell },
    { id: 'security' as TabView, label: 'Security', icon: FiLock },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#152F50] text-[#152F50]'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-gray-200">
                <div className="relative group">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={user.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#D8B368] flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <label 
                    htmlFor="avatar-upload"
                    className={`absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <FiCamera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    )}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <label 
                    htmlFor="avatar-upload"
                    className={`text-sm text-[#82B8DE] hover:text-[#152F50] font-medium mt-1 inline-block ${uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    {uploading ? 'Uploading...' : 'Change photo'}
                  </label>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FiUser className="w-4 h-4" />
                      Full Name
                    </div>
                  </label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FiMail className="w-4 h-4" />
                      Email Address
                    </div>
                  </label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FiPhone className="w-4 h-4" />
                      Phone Number
                    </div>
                  </label>
                  <input
                    type="tel"
                    defaultValue={user.phone}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FiBriefcase className="w-4 h-4" />
                      Company/Brokerage
                    </div>
                  </label>
                  <input
                    type="text"
                    defaultValue={user.company}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="w-4 h-4" />
                      Business Address
                    </div>
                  </label>
                  <input
                    type="text"
                    defaultValue={user.businessAddress || ''}
                    placeholder="123 Market St, Wilmington, DE 19801"
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                {user.userType === 'realtor' || user.userType === 'architect' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <FiAward className="w-4 h-4" />
                        License Number
                      </div>
                    </label>
                    <input
                      type="text"
                      defaultValue={user.licenseNumber || ''}
                      placeholder={user.userType === 'realtor' ? 'RS-2024-XXXXX' : 'AIA-DE-XXXXX'}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                ) : null}

                <div className={user.userType === 'realtor' || user.userType === 'architect' ? '' : 'md:col-span-2'}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FiGlobe className="w-4 h-4" />
                      Website
                    </div>
                  </label>
                  <input
                    type="url"
                    defaultValue={user.website || ''}
                    placeholder="https://yourcompany.com"
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Type
                  </label>
                  <select
                    defaultValue={user.userType}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  >
                    <option value="realtor">Realtor</option>
                    <option value="developer">Developer/Investor</option>
                    <option value="architect">Architect</option>
                    <option value="investor">Property Investor</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSaveChanges}
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-gray-900">Search Notifications</p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        Get notified when new zoning information is available
                      </p>
                    </div>
                    <ModernToggle 
                      enabled={emailNotifications}
                      onChange={setEmailNotifications}
                      label="Search Notifications"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-gray-900">Weekly Digest</p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        Receive a weekly summary of your searches and saved properties
                      </p>
                    </div>
                    <ModernToggle 
                      enabled={weeklyDigest}
                      onChange={setWeeklyDigest}
                      label="Weekly Digest"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-gray-900">Marketing Emails</p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        Receive updates about new features and promotions
                      </p>
                    </div>
                    <ModernToggle 
                      enabled={marketingEmails}
                      onChange={setMarketingEmails}
                      label="Marketing Emails"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Settings</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default County
                  </label>
                  <select
                    value={defaultCounty}
                    onChange={(e) => setDefaultCounty(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82B8DE] focus:border-[#82B8DE] bg-white"
                  >
                    <option value="New Castle">New Castle County</option>
                    <option value="Kent" disabled>Kent County (Coming Soon!)</option>
                    <option value="Sussex">Sussex County</option>
                  </select>
                  <p className="text-sm text-gray-600 mt-2">
                    This county will be pre-selected when you search
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSaveChanges}
                  className="btn-primary"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Password</h3>
                <button
                  onClick={handleChangePassword}
                  className="btn-secondary"
                >
                  Change Password
                </button>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FiMonitor className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Current Session</p>
                        <p className="text-sm text-gray-600">Chrome on Mac • Wilmington, DE</p>
                        <p className="text-xs text-gray-500 mt-1">Last active: Just now</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      Active
                    </span>
                  </div>

                  <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FiMonitor className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">iPhone</p>
                        <p className="text-sm text-gray-600">Safari on iOS • Dover, DE</p>
                        <p className="text-xs text-gray-500 mt-1">Last active: 2 hours ago</p>
                      </div>
                    </div>
                    <button className="text-sm text-error hover:underline">
                      Revoke
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Actions</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Need help with your account? Contact our support team.
                </p>
                <a
                  href="mailto:support@delawarezoning.com"
                  className="text-[#82B8DE] hover:text-[#152F50] hover:underline font-medium"
                >
                  support@delawarezoning.com
                </a>
              </div>

              {/* Delete Account Section */}
              <div className="pt-6 border-t border-red-200">
                <h3 className="text-lg font-semibold text-red-600 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Danger Zone
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Delete Account:</strong> This action cannot be undone. This will permanently delete your account, all saved properties, search history, and cancel any active subscriptions.
                  </p>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-fade-in">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Delete Account?
                </h3>
                <p className="text-sm text-gray-600">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">What will be deleted:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    All saved properties and search history
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Your profile and account settings
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Active subscription (if any)
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    All personal data and preferences
                  </li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Type <span className="text-red-600 font-mono">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText('');
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal - Centered */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-auto animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Avatar Updated!</h3>
              <p className="text-gray-600 text-sm">
                Your profile picture has been successfully saved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> Profile updates will be available once backend integration is complete. 
          All changes are currently simulated for demonstration purposes.
        </p>
      </div>
    </div>
  );
}

