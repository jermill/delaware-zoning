import { useState } from 'react';
import { FiSearch, FiEye, FiFilter } from 'react-icons/fi';
import { AdminUser, allUsers } from '@/data/mockAdminData';
import TierBadge from '@/components/dashboard/TierBadge';

interface AdminUserListProps {
  onViewUser: (userId: string) => void;
}

export default function AdminUserList({ onViewUser }: AdminUserListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Calculate special user tags
  const newestUserId = allUsers.reduce((newest, user) => {
    return new Date(user.createdAt) > new Date(newest.createdAt) ? user : newest;
  }).id;

  const mostActiveUserId = allUsers.reduce((mostActive, user) => {
    return user.searchesTotal > mostActive.searchesTotal ? user : mostActive;
  }).id;

  const oldestUserId = allUsers.reduce((oldest, user) => {
    return new Date(user.createdAt) < new Date(oldest.createdAt) ? user : oldest;
  }).id;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const filteredUsers = allUsers
    .filter((user) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.company.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((user) => {
      // Tier filter
      if (filterTier !== 'all') {
        return user.tier === filterTier;
      }
      return true;
    })
    .filter((user) => {
      // Status filter
      if (filterStatus !== 'all') {
        return user.status === filterStatus;
      }
      return true;
    });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-delaware-blue focus:border-delaware-blue bg-white text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Tier Filter */}
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-delaware-blue focus:border-delaware-blue bg-white text-gray-900"
          >
            <option value="all">All Tiers</option>
            <option value="looker">The Looker</option>
            <option value="pro">The Pro</option>
            <option value="whale">The Whale</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-delaware-blue focus:border-delaware-blue bg-white text-gray-900"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* User List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Searches
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MRR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        {user.id === newestUserId && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                            New
                          </span>
                        )}
                        {user.id === mostActiveUserId && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-delaware-gold text-white">
                            Most Active
                          </span>
                        )}
                        {user.id === oldestUserId && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-delaware-blue text-white">
                            Oldest
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">{user.company}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <TierBadge tier={user.tier} size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : user.status === 'inactive'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.searchesTotal}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {user.mrr > 0 ? `$${user.mrr}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDateTime(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onViewUser(user.id)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-delaware-blue bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FiEye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 text-center">
        Showing {filteredUsers.length} of {allUsers.length} users
      </div>
    </div>
  );
}
