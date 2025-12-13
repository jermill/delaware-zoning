import { NextApiRequest, NextApiResponse } from 'next';
import { createSupabaseAdmin } from '@/lib/supabase';
import { logger, logApiError, logApiRequest } from '@/lib/logger';

/**
 * API Route: Get Admin Statistics
 * GET /api/admin/stats
 * 
 * Returns admin dashboard statistics and recent users
 * Requires authentication and admin role
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseAdmin = createSupabaseAdmin();

    // Validate token and get user
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    logApiRequest('GET', '/api/admin/stats', user.id);

    // Check if user is admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      logger.warn({
        type: 'unauthorized_admin_access',
        userId: user.id,
        path: '/api/admin/stats',
      });
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Fetch admin statistics
    const { data: statsData, error: statsError } = await supabaseAdmin
      .from('admin_statistics')
      .select('*')
      .single();

    if (statsError) {
      logApiError('GET', '/api/admin/stats', statsError as Error, user.id);
      return res.status(500).json({
        error: 'Failed to fetch admin statistics',
        details: statsError.message,
      });
    }

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

    if (usersError) {
      logApiError('GET', '/api/admin/stats', usersError as Error, user.id);
      return res.status(500).json({
        error: 'Failed to fetch recent users',
        details: usersError.message,
      });
    }

    // Transform the users data
    const transformedUsers = usersData?.map((user: any) => ({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      created_at: user.created_at,
      tier: user.subscriptions?.[0]?.tier || 'free',
      searches_used: user.usage_tracking?.[0]?.searches_used || 0,
      saves_used: user.usage_tracking?.[0]?.saves_used || 0,
    })) || [];

    logger.info({
      type: 'admin_stats_accessed',
      userId: user.id,
    });

    return res.status(200).json({
      success: true,
      data: {
        stats: {
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
        },
        recentUsers: transformedUsers,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logApiError('GET', '/api/admin/stats', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

