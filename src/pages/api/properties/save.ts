import { NextApiResponse } from 'next';
import { createSupabaseAdmin } from '@/lib/supabase';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';
import { withRateLimit } from '@/middleware/rateLimit';
import { logger, logApiError, logApiRequest } from '@/lib/logger';
import validator from 'validator';

/**
 * API Route: Save Property
 * POST /api/properties/save
 * 
 * Saves a property to user's saved properties list
 * Requires authentication and rate limiting
 */
async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.user.id;
  logApiRequest('POST', '/api/properties/save', userId);

  try {
    // Get request body
    const {
      property_id,
      parcel_id,
      address,
      city,
      county,
      zip_code,
      zoning_district,
      permitted_uses,
      dimensional_standards,
      notes,
      tags,
    } = req.body;

    // Validate required fields
    if (!property_id || !parcel_id || !address || !city || !county) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['property_id', 'parcel_id', 'address', 'city', 'county'],
      });
    }

    // Sanitize text inputs to prevent XSS
    const sanitizedAddress = validator.escape(validator.trim(address));
    const sanitizedCity = validator.escape(validator.trim(city));
    const sanitizedCounty = validator.escape(validator.trim(county));
    const sanitizedNotes = notes ? validator.escape(validator.trim(notes)) : null;
    const sanitizedZipCode = zip_code ? validator.trim(zip_code) : null;

    const supabaseAdmin = createSupabaseAdmin();
    
    // Check user's subscription tier and save limit
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('tier, save_limit')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (subError) {
      logApiError('POST', '/api/properties/save', subError as Error, userId);
      return res.status(500).json({ error: 'Failed to verify subscription' });
    }

    // If user has a save limit, check current count
    if (subscription.save_limit !== null) {
      const { count, error: countError } = await supabaseAdmin
        .from('saved_properties')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        logApiError('POST', '/api/properties/save', countError as Error, userId);
        return res.status(500).json({ error: 'Failed to check save limit' });
      }

      if (count !== null && count >= subscription.save_limit) {
        logger.warn({
          type: 'save_limit_reached',
          userId,
          tier: subscription.tier,
          limit: subscription.save_limit,
        });
        return res.status(403).json({
          error: 'Save limit reached',
          message: `You have reached your limit of ${subscription.save_limit} saved properties. Upgrade to save more.`,
          upgradeUrl: '/pricing',
          tier: subscription.tier,
          limit: subscription.save_limit,
          current: count,
        });
      }
    }

    // Save property (upsert to handle duplicates)
    const { data, error } = await supabaseAdmin
      .from('saved_properties')
      .upsert(
        {
          user_id: userId,
          property_id,
          parcel_id,
          address: sanitizedAddress,
          city: sanitizedCity,
          county: sanitizedCounty,
          zip_code: sanitizedZipCode,
          zoning_district,
          permitted_uses,
          dimensional_standards,
          notes: sanitizedNotes,
          tags,
        },
        {
          onConflict: 'user_id,property_id',
        }
      )
      .select()
      .single();

    if (error) {
      logApiError('POST', '/api/properties/save', error as Error, userId);
      return res.status(500).json({
        error: 'Failed to save property',
        details: error.message,
      });
    }

    logger.info({
      type: 'property_saved',
      userId,
      propertyId: property_id,
      tier: subscription.tier,
      county: sanitizedCounty,
    });

    return res.status(200).json({
      success: true,
      data,
      message: 'Property saved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logApiError('POST', '/api/properties/save', error, userId);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

// Export with authentication and rate limiting middleware
export default withRateLimit('properties', (req) => (req as AuthenticatedRequest).user?.id)(
  withAuth(handler)
);
