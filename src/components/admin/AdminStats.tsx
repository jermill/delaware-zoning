import { FiUsers, FiDollarSign, FiSearch, FiTrendingUp, FiEye, FiActivity } from 'react-icons/fi';
import StatCard from '@/components/dashboard/StatCard';

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    usersLast30Days: number;
    usersLast7Days: number;
    freeUsers: number;
    proUsers: number;
    businessUsers: number;
    totalSearches: number;
    searchesLast30Days: number;
    totalSavedProperties: number;
    monthlyRecurringRevenue: number;
    totalPageVisits: number;
    pageVisitsLast24h: number;
    pageVisitsLast7Days: number;
    pageVisitsLast30Days: number;
    uniqueVisitors24h: number;
    activeUsers30Days: number;
  } | null;
}

export default function AdminStats({ stats }: AdminStatsProps) {
  if (!stats) {
    return <div>Loading stats...</div>;
  }

  const paidUsers = stats.proUsers + stats.businessUsers;
  const conversionRate = stats.totalUsers > 0 
    ? Math.round((paidUsers / stats.totalUsers) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle={`${stats.usersLast7Days} this week`}
          icon={<FiUsers className="w-full h-full" />}
          color="blue"
        />

        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRecurringRevenue.toLocaleString()}`}
          subtitle="MRR"
          icon={<FiDollarSign className="w-full h-full" />}
          color="gold"
        />

        <StatCard
          title="Total Searches"
          value={stats.totalSearches.toLocaleString()}
          subtitle={`${stats.searchesLast30Days} this month`}
          icon={<FiSearch className="w-full h-full" />}
          color="gray"
        />

        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          subtitle="free to paid"
          icon={<FiTrendingUp className="w-full h-full" />}
          color="green"
        />
      </div>

      {/* Page Visit Stats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Visit Analytics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            title="Total Page Visits"
            value={stats.totalPageVisits.toLocaleString()}
            subtitle={`${stats.pageVisitsLast30Days.toLocaleString()} this month`}
            icon={<FiEye className="w-full h-full" />}
            color="purple"
          />

          <StatCard
            title="Today's Visitors"
            value={stats.uniqueVisitors24h.toLocaleString()}
            subtitle={`${stats.pageVisitsLast24h.toLocaleString()} page views`}
            icon={<FiActivity className="w-full h-full" />}
            color="blue"
          />

          <StatCard
            title="Active Users (30d)"
            value={stats.activeUsers30Days.toLocaleString()}
            subtitle={`${stats.pageVisitsLast7Days.toLocaleString()} visits this week`}
            icon={<FiUsers className="w-full h-full" />}
            color="green"
          />
        </div>
      </div>
    </div>
  );
}

