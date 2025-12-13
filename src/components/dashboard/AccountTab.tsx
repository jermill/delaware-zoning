import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiBell, FiLock, FiMonitor, FiCamera, FiMapPin, FiAward, FiGlobe } from 'react-icons/fi';
import { UserProfile } from '@/data/mockDashboardData';

interface AccountTabProps {
  user: UserProfile;
}

type TabView = 'profile' | 'preferences' | 'security';

export default function AccountTab({ user }: AccountTabProps) {
  const [activeTab, setActiveTab] = useState<TabView>('profile');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [defaultCounty, setDefaultCounty] = useState('New Castle');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);

  const handleSaveChanges = () => {
    alert('Profile updates will be available once backend integration is complete.');
  };

  const handleChangePassword = () => {
    alert('Password change will be available once backend integration is complete.');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    // For now, create a local preview URL
    // In production, this would upload to Supabase Storage
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
      alert('Avatar updated! In production, this would be saved to your profile.');
    };
    reader.readAsDataURL(file);
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
                    className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <FiCamera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <label 
                    htmlFor="avatar-upload"
                    className="text-sm text-[#82B8DE] hover:text-[#152F50] cursor-pointer font-medium mt-1 inline-block"
                  >
                    Change photo
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
                    <button
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#82B8DE] focus:ring-offset-2 ${
                        emailNotifications ? 'bg-[#82B8DE]' : 'bg-gray-300'
                      }`}
                      role="switch"
                      aria-checked={emailNotifications}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                          emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-gray-900">Weekly Digest</p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        Receive a weekly summary of your searches and saved properties
                      </p>
                    </div>
                    <button
                      onClick={() => setWeeklyDigest(!weeklyDigest)}
                      className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#82B8DE] focus:ring-offset-2 ${
                        weeklyDigest ? 'bg-[#82B8DE]' : 'bg-gray-300'
                      }`}
                      role="switch"
                      aria-checked={weeklyDigest}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                          weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-gray-900">Marketing Emails</p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        Receive updates about new features and promotions
                      </p>
                    </div>
                    <button
                      onClick={() => setMarketingEmails(!marketingEmails)}
                      className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#82B8DE] focus:ring-offset-2 ${
                        marketingEmails ? 'bg-[#82B8DE]' : 'bg-gray-300'
                      }`}
                      role="switch"
                      aria-checked={marketingEmails}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                          marketingEmails ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
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
                    <option value="Kent">Kent County</option>
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
            </div>
          )}
        </div>
      </div>

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

