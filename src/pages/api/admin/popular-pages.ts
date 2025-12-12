import { NextApiRequest, NextApiResponse } from 'next';
import { createSupabaseAdmin } from '@/lib/supabase';
import { logger, logApiError, logApiRequest } from '@/lib/logger';

/**
 * API Route: Get Popular Pages
 * GET /api/admin/popular-pages
 * 
 * Returns popular pages statistics
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

    logApiRequest('GET', '/api/admin/popular-pages', user.id);

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
        path: '/api/admin/popular-pages',
      });
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Fetch popular pages
    const { data, error } = await supabaseAdmin
      .from('popular_pages')
      .select('*');

    if (error) {
      logApiError('GET', '/api/admin/popular-pages', error as Error, user.id);
      return res.status(500).json({
        error: 'Failed to fetch popular pages',
        details: error.message,
      });
    }

    logger.info({
      type: 'admin_popular_pages_accessed',
      userId: user.id,
    });

    return res.status(200).json({
      success: true,
      data: data || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logApiError('GET', '/api/admin/popular-pages', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
