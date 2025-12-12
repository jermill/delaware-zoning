import { FiUsers, FiDollarSign, FiSearch, FiTrendingUp } from 'react-icons/fi';
import { adminStats } from '@/data/mockAdminData';
import StatCard from '@/components/dashboard/StatCard';

export default function AdminStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatCard
        title="Total Users"
        value={adminStats.totalUsers}
        subtitle={`${adminStats.activeUsers} active`}
        icon={<FiUsers className="w-full h-full" />}
        color="blue"
      />

      <StatCard
        title="Monthly Revenue"
        value={`$${adminStats.totalMRR.toLocaleString()}`}
        subtitle="MRR"
        icon={<FiDollarSign className="w-full h-full" />}
        color="gold"
      />

      <StatCard
        title="Total Searches"
        value={adminStats.totalSearches.toLocaleString()}
        subtitle="all time"
        icon={<FiSearch className="w-full h-full" />}
        color="gray"
      />

      <StatCard
        title="Conversion Rate"
        value={`${Math.round(((adminStats.proUsers + adminStats.whaleUsers) / adminStats.totalUsers) * 100)}%`}
        subtitle="free to paid"
        icon={<FiTrendingUp className="w-full h-full" />}
        color="green"
      />
    </div>
  );
}
