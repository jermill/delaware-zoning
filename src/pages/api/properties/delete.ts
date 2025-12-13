import { NextApiResponse } from 'next';
import { createSupabaseAdmin } from '@/lib/supabase';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';
import { withRateLimit } from '@/middleware/rateLimit';
import { logger, logApiError, logApiRequest } from '@/lib/logger';

/**
 * API Route: Delete Saved Property
 * DELETE /api/properties/delete?id=<uuid>
 * 
 * Removes a property from user's saved list
 * Requires authentication and rate limiting
 */
async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.user.id;
  logApiRequest('DELETE', '/api/properties/delete', userId);

  try {
    // Get property ID from query params
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid property ID',
      });
    }

    const supabaseAdmin = createSupabaseAdmin();
    
    // Verify property belongs to user and delete
    const { error: deleteError, count } = await supabaseAdmin
      .from('saved_properties')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('user_id', userId);

    if (deleteError) {
      logApiError('DELETE', '/api/properties/delete', deleteError as Error, userId);
      return res.status(500).json({
        error: 'Failed to delete property',
        details: deleteError.message,
      });
    }

    if (count === 0) {
      return res.status(404).json({
        error: 'Property not found or already deleted',
      });
    }

    logger.info({
      type: 'property_deleted',
      userId,
      propertyId: id,
    });

    return res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logApiError('DELETE', '/api/properties/delete', error, userId);
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

