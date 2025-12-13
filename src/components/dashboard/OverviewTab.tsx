import { FiSearch, FiBookmark, FiUser, FiCheckCircle, FiArrowRight, FiDownload } from 'react-icons/fi';
import { UserTier, SearchHistoryEntry, UsageStats, SubscriptionInfo } from '@/data/mockDashboardData';
import { motion } from 'framer-motion';
import StatCard from './StatCard';
import UpgradeBanner from './UpgradeBanner';
import ProgressBar from './ProgressBar';
import UsageChart from './UsageChart';
import CountyBreakdownChart from './CountyBreakdownChart';
import PopularZonesCard from './PopularZonesCard';
import DashboardSearchBar from './DashboardSearchBar';
import { exportDashboardSummary } from '@/utils/exportHelpers';
import Link from 'next/link';

interface OverviewTabProps {
  userTier: UserTier;
  usage: UsageStats;
  subscription: SubscriptionInfo;
  recentSearches: SearchHistoryEntry[];
  userName?: string;
  onTabChange?: (tab: string) => void;
  usageChartData?: Array<{ date: string; searches: number }>;
  countyBreakdown?: Array<{ name: string; value: number }>;
  onOpenSearch?: () => void;
}

export default function OverviewTab({
  userTier,
  usage,
  subscription,
  recentSearches,
  userName = 'User',
  onTabChange,
  usageChartData = [],
  countyBreakdown = [],
  onOpenSearch,
}: OverviewTabProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  const getSearchesDisplay = () => {
    if (usage.searchLimit === null) {
      return usage.searchesThisMonth.toString();
    }
    return `${usage.searchesThisMonth} / ${usage.searchLimit}`;
  };

  const getSearchesSubtitle = () => {
    if (usage.searchLimit === null) {
      return 'unlimited';
    }
    const remaining = usage.searchLimit - usage.searchesThisMonth;
    return `${remaining} remaining`;
  };

  const handleExportSummary = () => {
    exportDashboardSummary({
      userName,
      tier: subscription.tierName,
      searchesThisMonth: usage.searchesThisMonth,
      savedProperties: usage.savedProperties,
      totalSearches: recentSearches.length * 4, // Rough estimate for demo
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Search Bar */}
      <motion.div variants={item}>
        <DashboardSearchBar onSearch={onOpenSearch} />
      </motion.div>

      {/* Upgrade Banner for non-whale users */}
      {userTier !== 'whale' && (
        <motion.div variants={item}>
          <UpgradeBanner currentTier={userTier} />
        </motion.div>
      )}

      {/* Hero Stats Grid with varying sizes */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        variants={container}
      >
        <motion.div variants={item}>
          <StatCard
            title="Searches This Month"
            value={getSearchesDisplay()}
            subtitle={getSearchesSubtitle()}
            icon={<FiSearch className="w-full h-full" />}
            color="blue"
          />
        </motion.div>

        <motion.div variants={item}>
          <StatCard
            title="Saved Properties"
            value={usage.savedProperties}
            subtitle={userTier === 'looker' ? 'upgrade for unlimited' : 'unlimited'}
            icon={<FiBookmark className="w-full h-full" />}
            color="gold"
          />
        </motion.div>

        <motion.div variants={item}>
          <StatCard
            title="Current Plan"
            value={subscription.tierName}
            subtitle={subscription.price > 0 ? `$${subscription.price}/mo` : 'free forever'}
            icon={<FiUser className="w-full h-full" />}
            color="purple"
          />
        </motion.div>

        <motion.div variants={item}>
          <StatCard
            title="Account Status"
            value={subscription.status === 'active' ? 'Active' : subscription.status}
            subtitle={subscription.nextBillingDate ? `Next: ${new Date(subscription.nextBillingDate).toLocaleDateString()}` : 'No billing'}
            icon={<FiCheckCircle className="w-full h-full" />}
            color="green"
          />
        </motion.div>
      </motion.div>

      {/* Usage Stats */}
      <motion.div variants={item} className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-[#A8BDBE]">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {userTier === 'whale' ? 'Usage This Month' : 'Usage Limits'}
          </h3>
          {userTier === 'whale' ? (
            // Whale tier: Modern stat display
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl p-5 border-2 border-[#82B8DE]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Searches Performed</p>
                    <p className="text-4xl font-bold text-[#152F50]">{usage.searchesThisMonth}</p>
                    <p className="text-sm text-[#D8B368] mt-2 font-semibold">✨ Unlimited Access</p>
                  </div>
                  <div className="p-4 bg-[#82B8DE] rounded-xl">
                    <FiSearch className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border-2 border-[#D8B368]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">PDF Exports</p>
                    <p className="text-4xl font-bold text-[#152F50]">{usage.pdfExportsThisMonth}</p>
                    <p className="text-sm text-[#D8B368] mt-2 font-semibold">✨ Unlimited Access</p>
                  </div>
                  <div className="p-4 bg-[#D8B368] rounded-xl">
                    <FiDownload className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Other tiers: Progress bars with inline upgrade prompts
            <div className="space-y-5">
              <ProgressBar
                current={usage.searchesThisMonth}
                max={usage.searchLimit}
                label="Searches This Month"
                showPercentage={true}
              />
              {usage.searchLimit && usage.searchesThisMonth >= usage.searchLimit * 0.8 && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 border-2 border-[#D8B368] rounded-xl">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#D8B368] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">You're running low on searches</p>
                    <p className="text-xs text-gray-700 mt-0.5">Upgrade to get unlimited searches</p>
                  </div>
                  <Link href="/dashboard?tab=billing" className="flex-shrink-0 px-4 py-2 bg-[#D8B368] text-white rounded-lg text-sm font-medium hover:bg-[#152F50] transition-colors">
                    Upgrade
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Charts Row - Modern glassmorphic design */}
      {(usageChartData.length > 0 || countyBreakdown.length > 0) && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          variants={container}
        >
          {usageChartData.length > 0 && (
            <motion.div variants={item} className="w-full">
              <UsageChart data={usageChartData} />
            </motion.div>
          )}
          {countyBreakdown.length > 0 && (
            <motion.div variants={item} className="w-full">
              <CountyBreakdownChart data={countyBreakdown} />
            </motion.div>
          )}
          <motion.div variants={item} className="w-full">
            <PopularZonesCard />
          </motion.div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div variants={item} className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-[#A8BDBE]">
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              <p className="text-sm text-gray-600 mt-1">Common tasks and shortcuts</p>
            </div>
            <button
              onClick={handleExportSummary}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#82B8DE] rounded-xl hover:bg-[#152F50] transition-all shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
            >
              <FiDownload className="w-4 h-4" />
              Export Summary
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={onOpenSearch}
              className="group flex items-center justify-between p-5 bg-blue-50 border-2 border-[#82B8DE] rounded-xl hover:border-[#152F50] transition-all text-left hover:shadow-md"
            >
              <div>
                <p className="font-bold text-gray-900 group-hover:text-[#152F50] text-lg mb-1">
                  New Search
                </p>
                <p className="text-sm text-gray-600">Look up zoning info</p>
              </div>
              <div className="p-3 bg-[#82B8DE] rounded-xl group-hover:bg-[#152F50] text-white transition-colors">
                <FiSearch className="w-5 h-5" />
              </div>
            </button>

            <button
              onClick={() => onTabChange && onTabChange('saved')}
              className="group flex items-center justify-between p-5 bg-yellow-50 border-2 border-[#D8B368] rounded-xl hover:border-[#152F50] transition-all text-left hover:shadow-md"
            >
              <div>
                <p className="font-bold text-gray-900 group-hover:text-[#152F50] text-lg mb-1">
                  View Properties
                </p>
                <p className="text-sm text-gray-600">See your saved list</p>
              </div>
              <div className="p-3 bg-[#D8B368] rounded-xl group-hover:bg-[#152F50] text-white transition-colors">
                <FiBookmark className="w-5 h-5" />
              </div>
            </button>

            {userTier !== 'whale' && (
              <Link
                href="/dashboard?tab=billing"
                className="group flex items-center justify-between p-5 bg-gray-50 border-2 border-[#A8BDBE] rounded-xl hover:border-[#152F50] transition-all hover:shadow-md"
              >
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-[#152F50] text-lg mb-1">
                    Upgrade Plan
                  </p>
                  <p className="text-sm text-gray-600">Get more features</p>
                </div>
                <div className="p-3 bg-[#A8BDBE] rounded-xl group-hover:bg-[#152F50] text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item} className="bg-white rounded-2xl shadow-md border border-[#A8BDBE] overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-[#A8BDBE]">
          <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
          <p className="text-sm text-gray-600 mt-1">Your latest property searches</p>
        </div>
        <div className="divide-y divide-[#A8BDBE]">
          {recentSearches.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#82B8DE] rounded-2xl mb-4">
                <FiSearch className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No searches yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start searching for properties to see your activity here
              </p>
              <button
                onClick={onOpenSearch}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#152F50] text-white rounded-xl font-semibold hover:bg-[#82B8DE] transition-all shadow-md hover:shadow-lg"
              >
                <FiSearch className="w-4 h-4" />
                Start Searching
              </button>
            </div>
          ) : (
            <>
              {recentSearches.slice(0, 5).map((search, index) => (
                <motion.div
                  key={search.id}
                  className="p-5 sm:p-6 hover:bg-blue-50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate text-lg mb-2">
                        {search.address}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-[#152F50] text-white shadow-sm">
                          {search.zoneCode}
                        </span>
                        <span className="text-sm text-gray-700 font-medium">{search.zoneName}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{search.county} County</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm text-gray-500 mb-2">{formatDate(search.searchedAt)}</p>
                      <button className="text-sm font-semibold text-[#82B8DE] hover:text-[#152F50] transition-colors">
                        View Details →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
        {recentSearches.length > 5 && (
          <div className="p-5 border-t border-[#A8BDBE] text-center bg-gray-50">
            <button 
              onClick={() => onTabChange && onTabChange('history')}
              className="text-[#82B8DE] hover:text-[#152F50] font-semibold text-sm inline-flex items-center gap-2 transition-colors"
            >
              View All Activity
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

