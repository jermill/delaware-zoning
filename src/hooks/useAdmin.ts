import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabase';
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
    // TODO: Add proper admin role check
    // For now, we'll check if email contains 'admin'
    if (!user || !user.email?.includes('admin')) {
      setLoading(false);
      setError('Unauthorized - Admin access required');
      return;
    }

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch admin statistics view
        const { data: statsData, error: statsError } = await supabaseAdmin
          .from('admin_statistics')
          .select('*')
          .single();

        if (statsError) throw statsError;

        setStats({
          totalUsers: statsData.total_users || 0,
          usersLast30Days: statsData.users_last_30_days || 0,
          usersLast7Days: statsData.users_last_7_days || 0,
          freeUsers: statsData.free_users || 0,
          proUsers: statsData.pro_users || 0,
          businessUsers: statsData.business_users || 0,
          totalSearches: statsData.total_searches || 0,
          searchesLast30Days: statsData.searches_last_30_days || 0,
          totalSavedProperties: statsData.total_saved_properties || 0,
          monthlyRecurringRevenue: statsData.monthly_recurring_revenue || 0,
          totalPageVisits: statsData.total_page_visits || 0,
          pageVisitsLast24h: statsData.page_visits_last_24h || 0,
          pageVisitsLast7Days: statsData.page_visits_last_7_days || 0,
          pageVisitsLast30Days: statsData.page_visits_last_30_days || 0,
          uniqueVisitors24h: statsData.unique_visitors_24h || 0,
          activeUsers30Days: statsData.active_users_30_days || 0,
        });

        // Fetch recent users with their activity
        const { data: usersData, error: usersError } = await supabaseAdmin
          .from('profiles')
          .select(`
            id,
            email,
            full_name,
            created_at,
            subscriptions (
              tier
            ),
            usage_tracking (
              searches_used,
              saves_used
            )
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (usersError) throw usersError;

        // Transform the data
        const transformedUsers = usersData?.map((user: any) => ({
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          created_at: user.created_at,
          tier: user.subscriptions?.[0]?.tier || 'free',
          searches_used: user.usage_tracking?.[0]?.searches_used || 0,
          saves_used: user.usage_tracking?.[0]?.saves_used || 0,
        })) || [];

        setRecentUsers(transformedUsers);
      } catch (err: any) {
        console.error('Error fetching admin data:', err);
        setError(err.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();

    // Set up real-time subscription for stats
    const statsSubscription = supabaseAdmin
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
