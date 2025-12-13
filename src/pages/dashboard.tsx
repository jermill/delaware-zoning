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
import FloatingActionButton from '@/components/dashboard/FloatingActionButton';
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
      amount: subscription.tier === 'free' ? 0 : subscription.tier === 'pro' ? 49 : 129, 
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

  // Get price for subscription - CORRECT PRICING
  const price = subscription.tier === 'free' ? 0 : 
                subscription.tier === 'pro' ? 49 : 129;
  
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
    <div className="min-h-screen bg-[#FFFCF6]">
      {/* Modern Dashboard Header */}
      <div className="bg-white border-b border-[#A8BDBE] px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex items-center justify-center w-10 h-10 text-gray-600 hover:text-delaware-blue hover:bg-blue-50 rounded-xl transition-all duration-200 flex-shrink-0"
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                )}
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                Delaware Zoning
              </h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
          
          {/* User Profile in Header */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900">{userData.name}</p>
              <p className="text-xs text-gray-500">{subscriptionData.tierName}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#152F50] flex items-center justify-center text-white font-bold text-base shadow-md">
              {userData.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Layout */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Modern Sidebar - Icon only when collapsed, full when expanded */}
        <aside className={`hidden md:block ${sidebarCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 overflow-y-auto transition-all duration-300 ease-in-out`}>
          <DashboardSidebar
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            userName={userData.name}
            userTier={currentUserTier}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(true)}
          />
        </aside>

        {/* Main Content Area with more padding */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 pb-24 md:pb-10">
            {renderTabContent()}
          </div>
        </main>
      </div>

      {/* Mobile Tab Bar */}
      <MobileTabBar currentTab={currentTab} onTabChange={setCurrentTab} />
      
      {/* Floating Action Button */}
      <FloatingActionButton href="/" />
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

