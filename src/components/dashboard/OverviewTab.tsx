import { FiSearch, FiBookmark, FiUser, FiCheckCircle, FiArrowRight, FiDownload } from 'react-icons/fi';
import { UserTier, SearchHistoryEntry, UsageStats, SubscriptionInfo } from '@/data/mockDashboardData';
import { motion } from 'framer-motion';
import StatCard from './StatCard';
import UpgradeBanner from './UpgradeBanner';
import ProgressBar from './ProgressBar';
import UsageChart from './UsageChart';
import CountyBreakdownChart from './CountyBreakdownChart';
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

      {/* Usage Stats - Modern glassmorphic design */}
      <motion.div variants={item} className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 border border-gray-200/50 relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 pointer-events-none" />
        
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {userTier === 'whale' ? 'Usage This Month' : 'Usage Limits'}
          </h3>
          {userTier === 'whale' ? (
            // Whale tier: Modern stat display
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-gradient-to-br from-delaware-blue/5 to-blue-600/5 rounded-2xl p-5 border border-delaware-blue/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Searches Performed</p>
                    <p className="text-4xl font-bold text-delaware-blue">{usage.searchesThisMonth}</p>
                    <p className="text-sm text-delaware-gold mt-2 font-semibold">✨ Unlimited Access</p>
                  </div>
                  <div className="p-4 bg-delaware-blue/10 rounded-xl">
                    <FiSearch className="w-7 h-7 text-delaware-blue" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-delaware-gold/5 to-yellow-600/5 rounded-2xl p-5 border border-delaware-gold/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">PDF Exports</p>
                    <p className="text-4xl font-bold text-delaware-gold">{usage.pdfExportsThisMonth}</p>
                    <p className="text-sm text-delaware-gold mt-2 font-semibold">✨ Unlimited Access</p>
                  </div>
                  <div className="p-4 bg-delaware-gold/10 rounded-xl">
                    <FiDownload className="w-7 h-7 text-delaware-gold" />
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
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-900">You're running low on searches</p>
                    <p className="text-xs text-amber-700 mt-0.5">Upgrade to get unlimited searches</p>
                  </div>
                  <Link href="/dashboard?tab=billing" className="flex-shrink-0 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6"
          variants={container}
        >
          {usageChartData.length > 0 && (
            <motion.div variants={item}>
              <UsageChart data={usageChartData} />
            </motion.div>
          )}
          {countyBreakdown.length > 0 && (
            <motion.div variants={item}>
              <CountyBreakdownChart data={countyBreakdown} />
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Quick Actions - Modern card design */}
      <motion.div variants={item} className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 border border-gray-200/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              <p className="text-sm text-gray-600 mt-1">Common tasks and shortcuts</p>
            </div>
            <button
              onClick={handleExportSummary}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-delaware-blue bg-blue-50 rounded-xl hover:bg-blue-100 transition-all shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
            >
              <FiDownload className="w-4 h-4" />
              Export Summary
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => alert('Search feature will be available once backend integration is complete. For now, use the main search on the homepage.')}
              className="group flex items-center justify-between p-5 bg-gradient-to-br from-delaware-blue/5 to-blue-600/5 border-2 border-delaware-blue/20 rounded-xl hover:border-delaware-blue hover:from-delaware-blue/10 hover:to-blue-600/10 transition-all text-left hover:shadow-md"
            >
              <div>
                <p className="font-bold text-gray-900 group-hover:text-delaware-blue text-lg mb-1">
                  New Search
                </p>
                <p className="text-sm text-gray-600">Look up zoning info</p>
              </div>
              <div className="p-3 bg-delaware-blue/10 rounded-xl group-hover:bg-delaware-blue group-hover:text-white transition-colors">
                <FiSearch className="w-5 h-5" />
              </div>
            </button>

            <button
              onClick={() => onTabChange && onTabChange('saved')}
              className="group flex items-center justify-between p-5 bg-gradient-to-br from-delaware-gold/5 to-yellow-600/5 border-2 border-delaware-gold/20 rounded-xl hover:border-delaware-gold hover:from-delaware-gold/10 hover:to-yellow-600/10 transition-all text-left hover:shadow-md"
            >
              <div>
                <p className="font-bold text-gray-900 group-hover:text-delaware-gold text-lg mb-1">
                  View Properties
                </p>
                <p className="text-sm text-gray-600">See your saved list</p>
              </div>
              <div className="p-3 bg-delaware-gold/10 rounded-xl group-hover:bg-delaware-gold group-hover:text-white transition-colors">
                <FiBookmark className="w-5 h-5" />
              </div>
            </button>

            {userTier !== 'whale' && (
              <Link
                href="/dashboard?tab=billing"
                className="group flex items-center justify-between p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:from-purple-100 hover:to-purple-200/50 transition-all hover:shadow-md"
              >
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-purple-700 text-lg mb-1">
                    Upgrade Plan
                  </p>
                  <p className="text-sm text-gray-600">Get more features</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Recent Activity - Modern design with better empty state */}
      <motion.div variants={item} className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200/50 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-200/50">
          <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
          <p className="text-sm text-gray-600 mt-1">Your latest property searches</p>
        </div>
        <div className="divide-y divide-gray-200/50">
          {recentSearches.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mb-4">
                <FiSearch className="w-10 h-10 text-delaware-blue" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No searches yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start searching for properties to see your activity here
              </p>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-delaware-blue text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                <FiSearch className="w-4 h-4" />
                Start Searching
              </Link>
            </div>
          ) : (
            <>
              {recentSearches.slice(0, 5).map((search, index) => (
                <motion.div
                  key={search.id}
                  className="p-5 sm:p-6 hover:bg-blue-50/50 transition-colors"
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
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-delaware-blue text-white shadow-sm">
                          {search.zoneCode}
                        </span>
                        <span className="text-sm text-gray-700 font-medium">{search.zoneName}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{search.county} County</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm text-gray-500 mb-2">{formatDate(search.searchedAt)}</p>
                      <button className="text-sm font-semibold text-delaware-blue hover:text-blue-700 transition-colors">
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
          <div className="p-5 border-t border-gray-200/50 text-center bg-gray-50/50">
            <button 
              onClick={() => onTabChange && onTabChange('history')}
              className="text-delaware-blue hover:text-blue-700 font-semibold text-sm inline-flex items-center gap-2 transition-colors"
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

