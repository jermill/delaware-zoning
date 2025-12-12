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
      className="space-y-6"
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

      {/* Stats Grid with animations */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
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
            color="gray"
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

      {/* Usage Stats - Different display for Whale tier */}
      <motion.div variants={item} className="bg-blue-50 rounded-2xl shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-delaware-blue mb-3 sm:mb-4">
          {userTier === 'whale' ? 'Usage This Month' : 'Usage Limits'}
        </h3>
        {userTier === 'whale' ? (
          // Whale tier: Show actual counts without limits
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border-2 border-delaware-gold/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Searches Performed</p>
                  <p className="text-3xl font-bold text-delaware-blue">{usage.searchesThisMonth}</p>
                  <p className="text-xs text-delaware-gold mt-1 font-medium">Unlimited Access</p>
                </div>
                <div className="p-3 bg-delaware-blue/10 rounded-lg">
                  <FiSearch className="w-6 h-6 text-delaware-blue" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-delaware-gold/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">PDF Exports</p>
                  <p className="text-3xl font-bold text-delaware-blue">{usage.pdfExportsThisMonth}</p>
                  <p className="text-xs text-delaware-gold mt-1 font-medium">Unlimited Access</p>
                </div>
                <div className="p-3 bg-delaware-gold/10 rounded-lg">
                  <FiDownload className="w-6 h-6 text-delaware-gold" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Other tiers: Show progress bars with limits
          <div className="space-y-4">
            <ProgressBar
              current={usage.searchesThisMonth}
              max={usage.searchLimit}
              label="Searches This Month"
              showPercentage={true}
            />
          </div>
        )}
      </motion.div>

      {/* Charts Row */}
      {(usageChartData.length > 0 || countyBreakdown.length > 0) && (
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6"
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

      {/* Quick Actions */}
      <motion.div variants={item} className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Quick Actions</h2>
          <button
            onClick={handleExportSummary}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-delaware-blue bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors w-full sm:w-auto justify-center"
          >
            <FiDownload className="w-4 h-4" />
            Export Summary
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          <button
            onClick={() => alert('Search feature will be available once backend integration is complete. For now, use the main search on the homepage.')}
            className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-delaware-blue hover:bg-blue-50 transition-all group text-left"
          >
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-delaware-blue">
                New Search
              </p>
              <p className="text-sm text-gray-600">Look up zoning</p>
            </div>
            <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-delaware-blue" />
          </button>

          <button
            onClick={() => onTabChange && onTabChange('saved')}
            className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-delaware-blue hover:bg-blue-50 transition-all group text-left"
          >
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-delaware-blue">
                View Properties
              </p>
              <p className="text-sm text-gray-600">See your saved list</p>
            </div>
            <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-delaware-blue" />
          </button>

          {userTier !== 'whale' && (
            <Link
              href="/dashboard?tab=billing"
              className="flex items-center justify-between p-4 border-2 border-delaware-gold bg-gradient-to-r from-delaware-gold/10 to-yellow-600/10 rounded-lg hover:border-delaware-gold hover:from-delaware-gold/20 hover:to-yellow-600/20 transition-all group"
            >
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-delaware-gold">
                  Upgrade Plan
                </p>
                <p className="text-sm text-gray-600">Get more features</p>
              </div>
              <FiArrowRight className="w-5 h-5 text-delaware-gold" />
            </Link>
          )}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item} className="bg-white rounded-2xl shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentSearches.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No recent searches yet</p>
              <Link href="/" className="text-delaware-blue hover:underline mt-2 inline-block">
                Start searching properties
              </Link>
            </div>
          ) : (
            <>
              {recentSearches.slice(0, 5).map((search) => (
                <div
                  key={search.id}
                  className="p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {search.address}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-delaware-blue text-white">
                          {search.zoneCode}
                        </span>
                        <span className="text-sm text-gray-600">{search.zoneName}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{search.county} County</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-gray-500">{formatDate(search.searchedAt)}</p>
                      <button className="text-sm text-delaware-blue hover:underline mt-1">
                        View Again
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        {recentSearches.length > 5 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <button className="text-delaware-blue hover:underline font-medium">
              View All Activity
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

