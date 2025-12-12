import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminStats from '@/components/admin/AdminStats';
import AdminTierBreakdown from '@/components/admin/AdminTierBreakdown';
import AdminUserList from '@/components/admin/AdminUserList';
import AdminAccountCard from '@/components/admin/AdminAccountCard';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import Link from 'next/link';
import { useAdmin } from '@/hooks/useAdmin';

// Import dashboard components
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MobileTabBar from '@/components/dashboard/MobileTabBar';
import OverviewTab from '@/components/dashboard/OverviewTab';
import SavedPropertiesTab from '@/components/dashboard/SavedPropertiesTab';
import SearchHistoryTab from '@/components/dashboard/SearchHistoryTab';
import AccountTab from '@/components/dashboard/AccountTab';
import BillingTab from '@/components/dashboard/BillingTab';
import HelpTab from '@/components/dashboard/HelpTab';
import { getUserDashboardById } from '@/data/mockAdminData';

function AdminContent() {
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('overview');
  const { stats, recentUsers, loading, error } = useAdmin();

  const viewedUserData = viewingUserId ? getUserDashboardById(viewingUserId) : null;

  const handleViewUser = (userId: string) => {
    setViewingUserId(userId);
    setCurrentTab('overview'); // Reset to overview when switching users
  };

  const handleBackToAdmin = () => {
    setViewingUserId(null);
    setCurrentTab('overview');
  };

  // Render user's dashboard tab content
  const renderUserDashboardTab = () => {
    if (!viewedUserData) return null;

    const { user, dashboardData } = viewedUserData;

    switch (currentTab) {
      case 'overview':
        return (
          <OverviewTab
            userTier={user.tier}
            usage={dashboardData.usage}
            subscription={dashboardData.subscription}
            recentSearches={dashboardData.searchHistory.slice(0, 5)}
            userName={user.name}
            onTabChange={setCurrentTab}
          />
        );
      case 'saved':
        return (
          <SavedPropertiesTab
            userTier={user.tier}
            properties={dashboardData.savedProperties}
          />
        );
      case 'history':
        return (
          <SearchHistoryTab
            userTier={user.tier}
            searches={dashboardData.searchHistory}
          />
        );
      case 'account':
        return <AccountTab user={dashboardData.user} />;
      case 'billing':
        return (
          <BillingTab
            userTier={user.tier}
            subscription={dashboardData.subscription}
            invoices={dashboardData.invoices}
          />
        );
      case 'help':
        return <HelpTab />;
      default:
        return null;
    }
  };

  // If viewing a user's dashboard
  if (viewingUserId && viewedUserData) {
    const { user, dashboardData } = viewedUserData;

    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Admin Notice Bar */}
          <div className="bg-delaware-blue text-white px-4 py-3 border-b border-blue-900">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToAdmin}
                  className="flex items-center gap-2 px-3 py-1.5 bg-delaware-gold text-white rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Back to Admin
                </button>
                <div className="border-l border-blue-400 pl-3">
                  <p className="text-sm font-medium">
                    Viewing: <span className="font-bold">{user.name}</span> ({user.email})
                  </p>
                </div>
              </div>
              <Link href="/" className="text-sm hover:underline flex items-center gap-1">
                <FiHome className="w-4 h-4" />
                Home
              </Link>
            </div>
          </div>

          {/* User's Dashboard */}
          <div className="flex h-[calc(100vh-140px)]">
            {/* Sidebar */}
            <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0 overflow-y-auto border-r border-gray-200">
              <DashboardSidebar
                currentTab={currentTab}
                onTabChange={setCurrentTab}
                userName={user.name}
                userTier={user.tier}
              />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20 md:pb-8">
                {renderUserDashboardTab()}
              </div>
            </main>
          </div>

          {/* Mobile Tab Bar */}
          <MobileTabBar currentTab={currentTab} onTabChange={setCurrentTab} />
        </div>
      </Layout>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-delaware-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-gray-900 font-semibold mb-2">Access Denied</p>
            <p className="text-gray-600">{error}</p>
            <Link href="/" className="mt-4 inline-block text-delaware-blue hover:underline">
              Return Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Admin Dashboard View
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-delaware-blue to-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-blue-100">View all users and their dashboards</p>
              </div>
              <Link
                href="/"
                className="px-4 py-2 bg-delaware-gold hover:bg-opacity-90 rounded-lg transition-colors flex items-center gap-2 font-semibold"
              >
                <FiHome className="w-4 h-4" />
                Home
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Stats */}
          <AdminStats stats={stats} />

          {/* Account Balance and Tier Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminAccountCard />
            <AdminTierBreakdown stats={stats} />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/dashboard"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-delaware-blue hover:bg-blue-50 transition-all"
              >
                <p className="font-semibold text-gray-900 mb-1">View Your Dashboard</p>
                <p className="text-sm text-gray-600">See the standard user dashboard</p>
              </Link>
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-delaware-blue hover:bg-blue-50 transition-all text-left">
                <p className="font-semibold text-gray-900 mb-1">Export User Data</p>
                <p className="text-sm text-gray-600">Download CSV of all users</p>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-delaware-blue hover:bg-blue-50 transition-all text-left">
                <p className="font-semibold text-gray-900 mb-1">Revenue Report</p>
                <p className="text-sm text-gray-600">View detailed revenue analytics</p>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-delaware-blue hover:bg-blue-50 transition-all text-left">
                <p className="font-semibold text-gray-900 mb-1">User Activity</p>
                <p className="text-sm text-gray-600">See recent user searches</p>
              </button>
            </div>
          </div>

          {/* User List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">All Users</h2>
            <AdminUserList onViewUser={handleViewUser} users={recentUsers} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function Admin() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminContent />
    </ProtectedRoute>
  );
}

