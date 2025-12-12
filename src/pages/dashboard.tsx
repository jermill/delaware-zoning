import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MobileTabBar from '@/components/dashboard/MobileTabBar';
import OverviewTab from '@/components/dashboard/OverviewTab';
import SavedPropertiesTab from '@/components/dashboard/SavedPropertiesTab';
import SearchHistoryTab from '@/components/dashboard/SearchHistoryTab';
import AccountTab from '@/components/dashboard/AccountTab';
import BillingTab from '@/components/dashboard/BillingTab';
import HelpTab from '@/components/dashboard/HelpTab';
import { UserTier, getDashboardData } from '@/data/mockDashboardData';

export default function Dashboard() {
  const router = useRouter();
  
  // State for current tab
  const [currentTab, setCurrentTab] = useState('overview');
  
  // Handle URL query parameter for tab navigation
  useEffect(() => {
    if (router.query.tab) {
      const tab = router.query.tab as string;
      const validTabs = ['overview', 'saved', 'history', 'account', 'billing', 'help'];
      if (validTabs.includes(tab)) {
        setCurrentTab(tab);
      }
    }
  }, [router.query.tab]);
  
  // State for user tier (for testing - default to 'pro' for demo)
  // In production, this would come from authentication/session
  const [currentUserTier, setCurrentUserTier] = useState<UserTier>('pro');

  // Get mock data based on current tier
  const dashboardData = getDashboardData(currentUserTier);

  // Render tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <OverviewTab
            userTier={currentUserTier}
            usage={dashboardData.usage}
            subscription={dashboardData.subscription}
            recentSearches={dashboardData.searchHistory.slice(0, 5)}
            userName={dashboardData.user.name}
            onTabChange={setCurrentTab}
            usageChartData={dashboardData.usageChartData}
            countyBreakdown={dashboardData.countyBreakdown}
          />
        );
      case 'saved':
        return (
          <SavedPropertiesTab
            userTier={currentUserTier}
            properties={dashboardData.savedProperties}
          />
        );
      case 'history':
        return (
          <SearchHistoryTab
            userTier={currentUserTier}
            searches={dashboardData.searchHistory}
          />
        );
      case 'account':
        return <AccountTab user={dashboardData.user} />;
      case 'billing':
        return (
          <BillingTab
            userTier={currentUserTier}
            subscription={dashboardData.subscription}
            invoices={dashboardData.invoices}
          />
        );
      case 'help':
        return <HelpTab />;
      default:
        return <OverviewTab
          userTier={currentUserTier}
          usage={dashboardData.usage}
          subscription={dashboardData.subscription}
          recentSearches={dashboardData.searchHistory.slice(0, 5)}
        />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Tier Switcher (for testing only - remove in production) */}
        <div className="bg-yellow-100 border-b-2 border-yellow-300 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-sm font-medium text-gray-800">
              <strong>Testing Mode:</strong> Switch between user tiers to see different features
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentUserTier('looker')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentUserTier === 'looker'
                    ? 'bg-delaware-tan text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                The Looker
              </button>
              <button
                onClick={() => setCurrentUserTier('pro')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentUserTier === 'pro'
                    ? 'bg-delaware-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                The Pro
              </button>
              <button
                onClick={() => setCurrentUserTier('whale')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentUserTier === 'whale'
                    ? 'bg-delaware-gold text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                The Whale
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="flex h-[calc(100vh-140px)]">
          {/* Sidebar - Hidden on mobile */}
          <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0 overflow-y-auto border-r border-gray-200">
            <DashboardSidebar
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              userName={dashboardData.user.name}
              userTier={currentUserTier}
            />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20 md:pb-8">
              {renderTabContent()}
            </div>
          </main>
        </div>

        {/* Mobile Tab Bar */}
        <MobileTabBar currentTab={currentTab} onTabChange={setCurrentTab} />
      </div>
    </Layout>
  );
}
