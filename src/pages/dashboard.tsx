import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  
  // State for sidebar visibility
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
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
    <div className="min-h-screen bg-gray-50">
      {/* Tier Switcher (for testing only - remove in production) */}
      <div className="bg-yellow-100 border-b-2 border-yellow-300 px-2 sm:px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex items-center justify-center w-8 h-8 text-gray-700 hover:bg-yellow-200 rounded transition-colors flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {sidebarCollapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
            </button>
            <p className="text-xs sm:text-sm font-medium text-gray-800">
              <strong className="hidden sm:inline">Testing Mode:</strong>
              <span className="sm:hidden">Test:</span> Switch tiers
            </p>
          </div>
          <div className="flex gap-1 sm:gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setCurrentUserTier('looker')}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                currentUserTier === 'looker'
                  ? 'bg-delaware-tan text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Looker
            </button>
            <button
              onClick={() => setCurrentUserTier('pro')}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                currentUserTier === 'pro'
                  ? 'bg-delaware-blue text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Pro
            </button>
            <button
              onClick={() => setCurrentUserTier('whale')}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                currentUserTier === 'whale'
                  ? 'bg-delaware-gold text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Whale
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Layout */}
      <div className="flex h-[calc(100vh-80px)] sm:h-[calc(100vh-60px)]">
        {/* Sidebar - Hidden on mobile and when collapsed */}
        {!sidebarCollapsed && (
          <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0 overflow-y-auto border-r border-gray-200">
            <DashboardSidebar
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              userName={dashboardData.user.name}
              userTier={currentUserTier}
            />
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 pb-24 md:pb-8">
            {renderTabContent()}
          </div>
        </main>
      </div>

      {/* Mobile Tab Bar */}
      <MobileTabBar currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}
