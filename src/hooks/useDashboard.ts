import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface SavedProperty {
  id: string;
  property_id: string;
  parcel_id: string;
  address: string;
  city: string;
  county: string;
  zip_code: string | null;
  zoning_district: string | null;
  permitted_uses: any;
  dimensional_standards: any;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

interface SearchHistoryItem {
  id: string;
  search_query: string;
  search_type: string;
  results_count: number;
  searched_at: string;
}

interface UsageData {
  searches_used: number;
  saves_used: number;
  exports_used: number;
  period_start: string;
  period_end: string;
}

interface DashboardData {
  savedProperties: SavedProperty[];
  searchHistory: SearchHistoryItem[];
  usage: UsageData | null;
  loading: boolean;
  error: string | null;
}

export function useDashboard(): DashboardData {
  const { user, subscription } = useAuth();
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch saved properties
        const { data: properties, error: propertiesError } = await supabase
          .from('saved_properties')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (propertiesError) throw propertiesError;

        // Fetch search history (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: history, error: historyError } = await supabase
          .from('search_history')
          .select('*')
          .eq('user_id', user.id)
          .gte('searched_at', thirtyDaysAgo.toISOString())
          .order('searched_at', { ascending: false })
          .limit(50);

        if (historyError) throw historyError;

        // Fetch current month's usage
        const { data: usageData, error: usageError } = await supabase
          .rpc('get_current_usage', { p_user_id: user.id });

        if (usageError) throw usageError;

        setSavedProperties(properties || []);
        setSearchHistory(history || []);
        setUsage(usageData || null);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Set up real-time subscriptions for saved properties
    const propertiesSubscription = supabase
      .channel('saved_properties_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'saved_properties',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Properties changed:', payload);
          // Refetch properties when there's a change
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      propertiesSubscription.unsubscribe();
    };
  }, [user]);

  return {
    savedProperties,
    searchHistory,
    usage,
    loading,
    error,
  };
}


