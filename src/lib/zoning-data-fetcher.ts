import { createSupabaseAdmin } from './supabase';

interface ZoningData {
  id: string;
  districtCode: string;
  name: string;
  description?: string;
  county: string;
  municipality?: string;
  permittedUses?: Array<{
    use_category: string;
    use_name: string;
    status: 'permitted' | 'conditional' | 'prohibited';
  }>;
  dimensionalStandards?: {
    min_lot_size?: number;
    front_setback?: number;
    side_setback?: number;
    rear_setback?: number;
    max_height?: number;
    max_lot_coverage?: number;
    parking_ratio?: number;
    parking_notes?: string;
  } | null;
  requiredPermits?: Array<{
    permit_type: string;
    required: boolean;
    description?: string;
    review_timeline?: string;
  }>;
  floodZone?: {
    fema_zone: string;
    flood_risk: string;
    zone_description?: string;
  } | null;
}

/**
 * Fetch comprehensive zoning data for a location
 * This is used for generating PDF reports (no user tier restrictions)
 */
export async function fetchZoningData(lat: number, lon: number): Promise<ZoningData> {
  const supabaseAdmin = createSupabaseAdmin();

  // Find zoning district at this location
  const { data: zoningPoint, error: zoningError } = await supabaseAdmin
    .rpc('find_zoning_at_point', {
      lat,
      lon,
    });

  if (zoningError) {
    throw new Error(`Failed to find zoning district: ${zoningError.message}`);
  }

  if (!zoningPoint || zoningPoint.length === 0) {
    throw new Error('No zoning information found for this location');
  }

  const zone = zoningPoint[0];

  // Get full zoning district details
  const { data: zoneDetails, error: detailsError } = await supabaseAdmin
    .from('zoning_districts')
    .select('*')
    .eq('id', zone.id)
    .single();

  if (detailsError) {
    throw new Error(`Failed to fetch zone details: ${detailsError.message}`);
  }

  // Get permitted uses
  const { data: permittedUses, error: usesError } = await supabaseAdmin
    .from('permitted_uses')
    .select('*')
    .eq('zoning_id', zone.id)
    .order('status', { ascending: true })
    .order('use_category', { ascending: true });

  if (usesError) {
    console.error('Error fetching permitted uses:', usesError);
  }

  // Get dimensional standards
  const { data: dimensionalStandards, error: standardsError } = await supabaseAdmin
    .from('dimensional_standards')
    .select('*')
    .eq('zoning_id', zone.id)
    .single();

  if (standardsError && standardsError.code !== 'PGRST116') {
    console.error('Error fetching dimensional standards:', standardsError);
  }

  // Get required permits
  const { data: requiredPermits, error: permitsError } = await supabaseAdmin
    .from('permits_required')
    .select('*')
    .eq('zoning_id', zone.id)
    .order('required', { ascending: false });

  if (permitsError) {
    console.error('Error fetching required permits:', permitsError);
  }

  // Get flood zone information
  let floodZone = null;
  try {
    const { data: floodData } = await supabaseAdmin
      .rpc('find_flood_zone_at_point', {
        lat,
        lon,
      });
    
    if (floodData && floodData.length > 0) {
      floodZone = floodData[0];
    }
  } catch (error) {
    console.warn('Flood zone data not available:', error);
  }

  // Construct comprehensive zoning data
  return {
    id: zone.id,
    districtCode: zoneDetails.district_code || zone.district_code,
    name: zoneDetails.name || zone.name,
    description: zoneDetails.description,
    county: zoneDetails.county || zone.county,
    municipality: zoneDetails.municipality,
    permittedUses: permittedUses || [],
    dimensionalStandards: dimensionalStandards || null,
    requiredPermits: requiredPermits || [],
    floodZone: floodZone || null,
  };
}

/**
 * Retry wrapper for flaky operations
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      console.warn(`Attempt ${attempt}/${maxAttempts} failed:`, error.message);
      
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  
  throw lastError!;
}
