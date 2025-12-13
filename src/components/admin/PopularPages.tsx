import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FiExternalLink, FiEye, FiUsers, FiClock } from 'react-icons/fi';

interface PopularPage {
  page_path: string;
  page_title: string;
  visit_count: number;
  unique_users: number;
  unique_sessions: number;
  avg_duration_seconds: number;
}

export default function PopularPages() {
  const [pages, setPages] = useState<PopularPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPages = async () => {
      try {
        // Get auth token
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.error('No active session');
          setLoading(false);
          return;
        }

        // Call secure API route with auth token
        const response = await fetch('/api/admin/popular-pages', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch popular pages');
        }

        const result = await response.json();
        
        if (result.success) {
          setPages(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching popular pages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPages();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages (Last 30 Days)</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-delaware-blue"></div>
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages (Last 30 Days)</h3>
        <p className="text-gray-500 text-center py-8">No page visit data available yet.</p>
      </div>
    );
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages (Last 30 Days)</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <FiEye className="w-3 h-3" />
                  Views
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <FiUsers className="w-3 h-3" />
                  Visitors
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <FiClock className="w-3 h-3" />
                  Avg. Time
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pages.map((page, index) => (
              <tr 
                key={page.page_path} 
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {page.page_title || 'Untitled'}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">
                      {page.page_path}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {page.visit_count.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {page.unique_sessions.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDuration(page.avg_duration_seconds)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                  <a
                    href={page.page_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-delaware-blue hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    Visit
                    <FiExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


