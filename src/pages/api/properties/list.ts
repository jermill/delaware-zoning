import { NextApiResponse } from 'next';
import { createSupabaseAdmin } from '@/lib/supabase';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';
import { withRateLimit } from '@/middleware/rateLimit';
import { logger, logApiError, logApiRequest } from '@/lib/logger';

/**
 * API Route: Get User's Saved Properties
 * GET /api/properties/list
 * 
 * Returns all saved properties for the authenticated user
 * Requires authentication and rate limiting
 */
async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.user.id;
  logApiRequest('GET', '/api/properties/list', userId);

  try {
    const supabaseAdmin = createSupabaseAdmin();
    
    // Fetch user's saved properties
    const { data: savedProperties, error: propertiesError } = await supabaseAdmin
      .from('saved_properties')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (propertiesError) {
      logApiError('GET', '/api/properties/list', propertiesError as Error, userId);
      return res.status(500).json({
        error: 'Failed to fetch saved properties',
        details: propertiesError.message,
      });
    }

    // Get user's subscription to check tier
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('tier, status, search_limit, save_limit')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    logger.info({
      type: 'properties_listed',
      userId,
      count: savedProperties?.length || 0,
      tier: subscription?.tier || 'unknown',
    });

    return res.status(200).json({
      success: true,
      data: {
        properties: savedProperties || [],
        count: savedProperties?.length || 0,
        subscription: subscription || null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logApiError('GET', '/api/properties/list', error, userId);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

// Export with authentication and rate limiting
export default withRateLimit('properties', (req) => (req as AuthenticatedRequest).user?.id)(
  withAuth(handler)
);

