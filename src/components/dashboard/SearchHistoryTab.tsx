import { useState } from 'react';
import { FiClock, FiRefreshCw, FiBookmark, FiBarChart2, FiFileText } from 'react-icons/fi';
import { UserTier, SearchHistoryEntry } from '@/data/mockDashboardData';
import { exportSearchHistoryToCSV } from '@/utils/exportHelpers';

interface SearchHistoryTabProps {
  userTier: UserTier;
  searches: SearchHistoryEntry[];
}

type DateRange = '7days' | '30days' | 'all';

export default function SearchHistoryTab({ userTier, searches }: SearchHistoryTabProps) {
  const [dateRange, setDateRange] = useState<DateRange>('30days');
  const [searchQuery, setSearchQuery] = useState('');

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
  };

  const getDateRangeFilter = () => {
    const now = new Date();
    const filterDate = new Date();

    switch (dateRange) {
      case '7days':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        filterDate.setDate(now.getDate() - 30);
        break;
      case 'all':
        return () => true;
    }

    return (search: SearchHistoryEntry) =>
      new Date(search.searchedAt) >= filterDate;
  };

  // Apply tier limits
  const getTierLimitedSearches = () => {
    let limited = searches;
    
    if (userTier === 'looker') {
      limited = searches.slice(0, 10);
    } else if (userTier === 'pro') {
      limited = searches.slice(0, 50);
    }
    
    return limited;
  };

  // Filter searches
  const filteredSearches = getTierLimitedSearches()
    .filter(getDateRangeFilter())
    .filter((search) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          search.address.toLowerCase().includes(query) ||
          search.zoneCode.toLowerCase().includes(query) ||
          search.zoneName.toLowerCase().includes(query)
        );
      }
      return true;
    });

  // Calculate stats
  const thisMonthSearches = searches.filter((search) => {
    const searchDate = new Date(search.searchedAt);
    const now = new Date();
    return (
      searchDate.getMonth() === now.getMonth() &&
      searchDate.getFullYear() === now.getFullYear()
    );
  });

  const countiesCounts = searches.reduce((acc, search) => {
    acc[search.county] = (acc[search.county] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostSearchedCounty = Object.entries(countiesCounts).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0] || 'N/A';

  const handleViewAgain = (search: SearchHistoryEntry) => {
    alert(`Would navigate to search results for: ${search.address} (backend not connected yet)`);
  };

  const handleSaveProperty = (search: SearchHistoryEntry) => {
    alert(`Would save property: ${search.address} (backend not connected yet)`);
  };

  const handleExportHistory = () => {
    if (filteredSearches.length === 0) {
      alert('No search history to export');
      return;
    }
    exportSearchHistoryToCSV(filteredSearches);
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiClock className="w-6 h-6 text-delaware-blue" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{thisMonthSearches.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiBarChart2 className="w-6 h-6 text-delaware-gold" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Searches</p>
              <p className="text-2xl font-bold text-gray-900">{searches.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <FiBarChart2 className="w-6 h-6 text-delaware-gray" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Most Searched</p>
              <p className="text-lg font-bold text-gray-900">{mostSearchedCounty}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Limit Notice */}
      {userTier !== 'whale' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            {userTier === 'looker' ? (
              <>
                <strong>Free users</strong> can view the last 10 searches.{' '}
                <a href="/dashboard?tab=billing" className="text-delaware-blue hover:underline font-medium">
                  Upgrade to The Pro
                </a>{' '}
                to see up to 50 searches.
              </>
            ) : (
              <>
                <strong>Pro users</strong> can view the last 50 searches.{' '}
                <a href="/dashboard?tab=billing" className="text-delaware-blue hover:underline font-medium">
                  Upgrade to The Whale
                </a>{' '}
                for unlimited search history.
              </>
            )}
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-delaware-blue focus:border-delaware-blue bg-white text-gray-900 placeholder:text-gray-400"
          />

          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-delaware-blue focus:border-delaware-blue bg-white text-gray-900"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Search History List */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Search History
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredSearches.length} {filteredSearches.length === 1 ? 'result' : 'results'})
            </span>
          </h2>
          {filteredSearches.length > 0 && (
            <button
              onClick={handleExportHistory}
              className="inline-flex items-center gap-2 px-3 py-2 bg-delaware-gold text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
            >
              <FiFileText className="w-4 h-4" />
              Export CSV
            </button>
          )}
        </div>

        {filteredSearches.length === 0 ? (
          <div className="p-12 text-center">
            <FiClock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searches.length === 0 ? 'No Search History' : 'No Results Found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searches.length === 0
                ? 'Your search history will appear here after you start searching for properties.'
                : 'Try adjusting your search or date range filter.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredSearches.map((search) => {
              const { date, time } = formatDateTime(search.searchedAt);

              return (
                <div
                  key={search.id}
                  className="p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Search Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate mb-1">
                        {search.address}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-delaware-blue text-white">
                          {search.zoneCode}
                        </span>
                        <span className="text-sm text-gray-600">{search.zoneName}</span>
                        <span className="text-xs text-gray-500">• {search.county} County</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <FiClock className="w-3 h-3" />
                        <span>
                          {date} at {time}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewAgain(search)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-delaware-blue bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FiRefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline">View Again</span>
                      </button>
                      <button
                        onClick={() => handleSaveProperty(search)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <FiBookmark className="w-4 h-4" />
                        <span className="hidden sm:inline">Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
