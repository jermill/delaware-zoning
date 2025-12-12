import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiBell, FiLock, FiMonitor, FiCamera } from 'react-icons/fi';
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

  const handleSaveChanges = () => {
    alert('Profile updates will be available once backend integration is complete.');
  };

  const handleChangePassword = () => {
    alert('Password change will be available once backend integration is complete.');
  };

  const handleUploadAvatar = () => {
    alert('Avatar upload will be available once backend integration is complete.');
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
                      ? 'border-delaware-blue text-delaware-blue'
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
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-delaware-gold flex items-center justify-center text-white text-3xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <button
                    onClick={handleUploadAvatar}
                    className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    title="Upload avatar"
                  >
                    <FiCamera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <button
                    onClick={handleUploadAvatar}
                    className="text-sm text-delaware-blue hover:underline mt-1"
                  >
                    Change photo
                  </button>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Search Notifications</p>
                      <p className="text-sm text-gray-600">
                        Get notified when new zoning information is available
                      </p>
                    </div>
                    <button
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        emailNotifications ? 'bg-delaware-blue' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Weekly Digest</p>
                      <p className="text-sm text-gray-600">
                        Receive a weekly summary of your searches and saved properties
                      </p>
                    </div>
                    <button
                      onClick={() => setWeeklyDigest(!weeklyDigest)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        weeklyDigest ? 'bg-delaware-blue' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Marketing Emails</p>
                      <p className="text-sm text-gray-600">
                        Receive updates about new features and promotions
                      </p>
                    </div>
                    <button
                      onClick={() => setMarketingEmails(!marketingEmails)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        marketingEmails ? 'bg-delaware-blue' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
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
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-delaware-blue focus:border-delaware-blue bg-white"
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
                  className="text-delaware-blue hover:underline font-medium"
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
