import { NextApiRequest, NextApiResponse } from 'next';
import { createSupabaseAdmin } from '@/lib/supabase';
import { optionalAuth } from '@/middleware/auth';
import { rateLimit } from '@/middleware/rateLimit';
import { logger, logApiError, logApiRequest, logSearchPerformed } from '@/lib/logger';

/**
 * API Route: Search Zoning by Address or Coordinates
 * GET /api/zoning/search?lat=X&lon=Y&address=...
 * 
 * Query params:
 * - address: string (e.g., "123 Market St, Wilmington, DE")
 * - lat: number (latitude) - REQUIRED
 * - lon: number (longitude) - REQUIRED
 * 
 * Returns comprehensive zoning information for the location
 * Optional authentication - tracks usage if authenticated
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Apply rate limiting (20 requests per minute per IP)
  const rateLimitPassed = await rateLimit(req, res, 'search');
  if (!rateLimitPassed) {
    return; // Response already sent by rateLimit
  }

  // Optional authentication
  const user = await optionalAuth(req);
  logApiRequest('GET', '/api/zoning/search', user?.id);

  try {
    const { address, lat, lon } = req.query;

    // Validate input
    if (!lat || !lon) {
      return res.status(400).json({
        error: 'Missing required parameters: lat and lon are required',
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid coordinates: lat and lon must be valid numbers',
      });
    }

    const supabaseAdmin = createSupabaseAdmin();
    
    // Check usage limits if user is authenticated
    if (user) {
      const { data: canSearch, error: usageError } = await supabaseAdmin.rpc(
        'increment_search_count',
        {
          p_user_id: user.id,
        }
      );

      if (usageError) {
        logger.error({
          type: 'usage_check_failed',
          userId: user.id,
          error: usageError.message,
        });
      } else if (!canSearch) {
        // Get subscription info for error message
        const { data: subscription } = await supabaseAdmin
          .from('subscriptions')
          .select('tier, search_limit')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        logger.warn({
          type: 'search_limit_reached',
          userId: user.id,
          tier: subscription?.tier,
          limit: subscription?.search_limit,
        });

        return res.status(429).json({
          error: 'Search limit reached',
          message: `You have reached your monthly search limit of ${subscription?.search_limit || 0} searches. Upgrade your plan for more searches.`,
          upgradeUrl: '/pricing',
          tier: subscription?.tier,
          limit: subscription?.search_limit,
        });
      }
    }

    // Find zoning district at this location using PostGIS function
    const { data: zoningData, error: zoningError } = await supabaseAdmin
      .rpc('find_zoning_at_point', {
        lat: latitude,
        lon: longitude,
      });

    if (zoningError) {
      logApiError('GET', '/api/zoning/search', zoningError as Error, user?.id);
      return res.status(500).json({
        error: 'Failed to find zoning information',
        details: zoningError.message,
      });
    }

    if (!zoningData || zoningData.length === 0) {
      return res.status(404).json({
        error: 'No zoning information found for this location',
        message: 'This location may be outside Delaware or in an unmapped area',
      });
    }

    const zone = zoningData[0];

    // Get subscription tier to determine data access level
    let userTier = 'looker';
    if (user) {
      const { data: subscription } = await supabaseAdmin
        .from('subscriptions')
        .select('tier')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      userTier = subscription?.tier || 'looker';
    }

    // Get full zoning district details
    const { data: zoneDetails, error: detailsError } = await supabaseAdmin
      .from('zoning_districts')
      .select('*')
      .eq('id', zone.id)
      .single();

    if (detailsError) {
      logger.error({
        type: 'zone_details_fetch_error',
        zoneId: zone.id,
        error: detailsError.message,
      });
    }

    // Get permitted uses for this zone
    const { data: permittedUses, error: usesError } = await supabaseAdmin
      .from('permitted_uses')
      .select('*')
      .eq('zoning_id', zone.id)
      .order('status', { ascending: true })
      .order('use_category', { ascending: true });

    if (usesError) {
      logger.error({
        type: 'permitted_uses_fetch_error',
        zoneId: zone.id,
        error: usesError.message,
      });
    }

    // Get dimensional standards (Pro+ only)
    let dimensionalStandards = null;
    if (userTier === 'pro' || userTier === 'business') {
      const { data, error: standardsError } = await supabaseAdmin
        .from('dimensional_standards')
        .select('*')
        .eq('zoning_id', zone.id)
        .single();

      if (standardsError && standardsError.code !== 'PGRST116') {
        logger.error({
          type: 'dimensional_standards_fetch_error',
          zoneId: zone.id,
          error: standardsError.message,
        });
      }
      dimensionalStandards = data;
    }

    // Get required permits (Whale/Business only)
    let requiredPermits: any[] = [];
    if (userTier === 'business') {
      const { data, error: permitsError } = await supabaseAdmin
        .from('permits_required')
        .select('*')
        .eq('zoning_id', zone.id)
        .order('required', { ascending: false });

      if (permitsError) {
        logger.error({
          type: 'required_permits_fetch_error',
          zoneId: zone.id,
          error: permitsError.message,
        });
      }
      requiredPermits = data || [];
    }

    // Check for flood zone (Pro+ only)
    let floodZone = null;
    if (userTier === 'pro' || userTier === 'business') {
      try {
        const { data: floodData } = await supabaseAdmin
          .rpc('find_flood_zone_at_point', {
            lat: latitude,
            lon: longitude,
          });
        
        if (floodData && floodData.length > 0) {
          floodZone = floodData[0];
        }
      } catch (error) {
        // Flood zone data may not be available yet
        logger.info({ type: 'flood_zone_not_available' });
      }
    }

    // Track search in history if user is authenticated
    if (user && address) {
      await supabaseAdmin.from('search_history').insert({
        user_id: user.id,
        search_query: address as string,
        search_type: 'address',
        results_count: 1,
        result_property_id: zone.id,
      });

      logSearchPerformed(user.id, userTier, address as string);
    }

    // Construct response
    const response = {
      success: true,
      data: {
        address: address || null,
        coordinates: {
          latitude,
          longitude,
        },
        zoning: {
          id: zone.id,
          districtCode: zone.district_code,
          name: zone.name,
          description: zone.description,
          county: zone.county,
          municipality: zone.municipality,
          state: zone.state,
          isMock: zoneDetails?.is_mock || false,
          dataSource: zoneDetails?.data_source || null,
          lastVerified: zoneDetails?.last_verified || null,
        },
        permittedUses: permittedUses?.map(use => ({
          category: use.use_category,
          type: use.use_type,
          status: use.status,
          conditions: use.conditions,
          notes: use.notes,
        })) || [],
        dimensionalStandards: dimensionalStandards ? {
          frontSetback: dimensionalStandards.front_setback_ft,
          sideSetback: dimensionalStandards.side_setback_ft,
          rearSetback: dimensionalStandards.rear_setback_ft,
          maxHeight: dimensionalStandards.max_height_ft,
          minLotArea: dimensionalStandards.min_lot_area_sqft,
          minLotWidth: dimensionalStandards.min_lot_width_ft,
          far: dimensionalStandards.far,
          parkingRatio: dimensionalStandards.parking_ratio,
          parkingNotes: dimensionalStandards.parking_notes,
        } : null,
        requiredPermits: requiredPermits?.map(permit => ({
          type: permit.permit_type,
          required: permit.required,
          conditional: permit.conditional,
          description: permit.description,
          link: permit.county_link,
        })) || [],
        floodZone: floodZone ? {
          femaZone: floodZone.fema_zone,
          floodRisk: floodZone.flood_risk,
          description: floodZone.zone_description,
        } : null,
      },
      userTier,
      authenticated: !!user,
      timestamp: new Date().toISOString(),
    };

    logger.info({
      type: 'search_successful',
      userId: user?.id,
      tier: userTier,
      county: zone.county,
      zoneCode: zone.district_code,
    });

    return res.status(200).json(response);
  } catch (error: any) {
    logApiError('GET', '/api/zoning/search', error, user?.id);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
