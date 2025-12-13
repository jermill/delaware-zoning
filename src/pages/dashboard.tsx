import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MobileTabBar from '@/components/dashboard/MobileTabBar';
import OverviewTab from '@/components/dashboard/OverviewTab';
import SavedPropertiesTab from '@/components/dashboard/SavedPropertiesTab';
import SearchHistoryTab from '@/components/dashboard/SearchHistoryTab';
import AccountTab from '@/components/dashboard/AccountTab';
import BillingTab from '@/components/dashboard/BillingTab';
import HelpTab from '@/components/dashboard/HelpTab';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';
import { getDashboardData, getCountyBreakdown } from '@/data/mockDashboardData';

function DashboardContent() {
  const router = useRouter();
  const { user, profile, subscription } = useAuth();
  const { savedProperties, searchHistory, usage, loading } = useDashboard();
  
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

  // Map subscription tier to UserTier for UI components
  const currentUserTier: 'looker' | 'pro' | 'whale' = subscription?.tier === 'free' ? 'looker' : 
                                                       subscription?.tier === 'pro' ? 'pro' : 
                                                       subscription?.tier === 'business' ? 'whale' : 'looker';

  // Show loading state
  if (loading || !subscription || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-delaware-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Transform search history to match expected format
  const transformedSearchHistory = searchHistory.map(s => ({
    id: s.id,
    address: s.search_query,
    zoneCode: 'N/A',
    zoneName: 'N/A',
    county: 'New Castle' as const,
    searchedAt: s.searched_at,
    success: s.results_count > 0,
  }));

  // Transform usage data for chart (last 30 days)
  const usageChartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Count searches for this day
    const daySearches = searchHistory.filter(search => {
      const searchDate = new Date(search.searched_at);
      return searchDate.toDateString() === date.toDateString();
    }).length;
    
    return { date: dateStr, searches: daySearches };
  });

  // Get county breakdown from saved properties
  // Transform database properties to match the expected format
  const transformedProperties = savedProperties.map(p => ({
    id: p.id,
    address: p.address,
    zoneCode: p.zoning_district || 'Unknown',
    zoneName: p.zoning_district || 'Unknown',
    county: p.county as 'New Castle' | 'Kent' | 'Sussex',
    city: p.city,
    dateSaved: p.created_at,
    starred: false,
    notes: p.notes || undefined,
    tags: p.tags || undefined,
  }));
  const countyBreakdown = getCountyBreakdown(transformedProperties);

  // Transform subscription data to match SubscriptionInfo interface
  const tierName: 'The Looker' | 'The Pro' | 'The Whale' = 
    subscription.tier === 'free' ? 'The Looker' : 
    subscription.tier === 'pro' ? 'The Pro' : 'The Whale';

  // Mock invoices for billing tab (TODO: fetch from Stripe)
  const mockInvoices = [
    { 
      id: '1', 
      date: '2024-12-01', 
      amount: subscription.tier === 'pro' ? 29.99 : subscription.tier === 'business' ? 99.99 : 0, 
      status: 'paid' as const,
      description: `${tierName} - Monthly Subscription`,
    },
  ];

  // Transform usage data to match UsageStats interface
  const usageData = {
    searchesThisMonth: usage?.searches_used || 0,
    searchLimit: subscription.search_limit,
    savedProperties: savedProperties.length,
    pdfExportsThisMonth: usage?.exports_used || 0,
  };

  // Get price for subscription
  const price = subscription.tier === 'free' ? 0 : 
                subscription.tier === 'pro' ? 29.99 : 99.99;
  
  const subscriptionData = {
    tier: currentUserTier,
    tierName,
    price,
    billingCycle: (subscription.tier === 'free' ? 'free' : 'monthly') as 'monthly' | 'yearly' | 'free',
    nextBillingDate: subscription.billing_cycle_end || undefined,
    status: subscription.status as 'active' | 'trial' | 'cancelled',
  };

  // Transform user data to match UserProfile interface
  const userData = {
    id: profile.id,
    name: profile.full_name || 'User',
    email: profile.email,
    company: profile.company_name || '',
    phone: profile.phone || '',
    avatar: profile.avatar_url || undefined,
    userType: 'developer' as const,
    tier: currentUserTier,
    createdAt: profile.created_at,
  };

  // Render tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <OverviewTab
            userTier={currentUserTier}
            usage={usageData}
            subscription={subscriptionData}
            recentSearches={transformedSearchHistory.slice(0, 5)}
            userName={userData.name}
            onTabChange={setCurrentTab}
            usageChartData={usageChartData}
            countyBreakdown={countyBreakdown}
          />
        );
      case 'saved':
        return (
          <SavedPropertiesTab
            userTier={currentUserTier}
            properties={transformedProperties}
          />
        );
      case 'history':
        return (
          <SearchHistoryTab
            userTier={currentUserTier}
            searches={transformedSearchHistory}
          />
        );
      case 'account':
        return <AccountTab user={userData} />;
      case 'billing':
        return (
          <BillingTab
            userTier={currentUserTier}
            subscription={subscriptionData}
            invoices={mockInvoices}
          />
        );
      case 'help':
        return <HelpTab />;
      default:
        return <OverviewTab
          userTier={currentUserTier}
          usage={usageData}
          subscription={subscriptionData}
          recentSearches={transformedSearchHistory.slice(0, 5)}
          userName={userData.name}
          onTabChange={setCurrentTab}
          usageChartData={usageChartData}
          countyBreakdown={countyBreakdown}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header with Sidebar Toggle */}
      <div className="bg-white border-b border-gray-200 px-2 sm:px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex items-center justify-center w-9 h-9 text-gray-600 hover:text-delaware-blue hover:bg-gray-100 rounded-lg transition-all duration-200 flex-shrink-0"
              aria-label="Toggle sidebar"
              title={sidebarCollapsed ? "Open sidebar" : "Close sidebar"}
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                {sidebarCollapsed ? (
                  // Hamburger menu icon when collapsed
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                ) : (
                  // Sidebar with arrow icon when open
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                )}
              </svg>
            </button>
            <h1 className="text-sm sm:text-base font-semibold text-gray-900">
              Delaware Zoning Dashboard
            </h1>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            {userData.name}
          </div>
        </div>
      </div>

      {/* Dashboard Layout */}
      <div className="flex h-[calc(100vh-61px)]">
        {/* Sidebar - Hidden on mobile and when collapsed */}
        {!sidebarCollapsed && (
          <aside className="hidden md:block w-56 flex-shrink-0 overflow-y-auto border-r border-gray-200">
            <DashboardSidebar
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              userName={userData.name}
              userTier={currentUserTier}
              onToggleCollapse={() => setSidebarCollapsed(true)}
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

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

