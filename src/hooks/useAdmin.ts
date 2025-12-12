import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface AdminStats {
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
}

interface UserActivity {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  tier: string;
  searches_used: number;
  saves_used: number;
}

interface AdminData {
  stats: AdminStats | null;
  recentUsers: UserActivity[];
  loading: boolean;
  error: string | null;
}

export function useAdmin(): AdminData {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError('Unauthorized - Please log in');
      return;
    }

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get auth token
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError('No active session');
          setLoading(false);
          return;
        }

        // Call secure API route with auth token
        const response = await fetch('/api/admin/stats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch admin data');
        }

        const result = await response.json();
        
        if (result.success) {
          setStats(result.data.stats);
          setRecentUsers(result.data.recentUsers);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err: any) {
        console.error('Error fetching admin data:', err);
        setError(err.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();

    // Set up real-time subscription for stats (using client-safe supabase)
    const statsSubscription = supabase
      .channel('admin_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          console.log('Admin data changed, refreshing...');
          fetchAdminData();
        }
      )
      .subscribe();

    return () => {
      statsSubscription.unsubscribe();
    };
  }, [user]);

  return {
    stats,
    recentUsers,
    loading,
    error,
  };
}
