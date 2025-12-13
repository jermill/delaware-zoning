import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Test 1: Check zoning districts count
    const { data: zones, error: zonesError, count: zonesCount } = await supabase
      .from('zoning_districts')
      .select('*', { count: 'exact', head: true });

    if (zonesError) throw zonesError;

    // Test 2: Check permitted uses count
    const { data: uses, error: usesError, count: usesCount } = await supabase
      .from('permitted_uses')
      .select('*', { count: 'exact', head: true });

    if (usesError) throw usesError;

    // Test 3: Check test addresses count
    const { data: addresses, error: addressesError, count: addressesCount } = await supabase
      .from('test_addresses')
      .select('*', { count: 'exact', head: true });

    if (addressesError) throw addressesError;

    // Test 4: Fetch one sample zoning district
    const { data: sampleZone, error: sampleError } = await supabase
      .from('zoning_districts')
      .select('*')
      .limit(1)
      .single();

    if (sampleError) throw sampleError;

    res.status(200).json({
      success: true,
      message: 'Supabase connection successful!',
      data: {
        zoningDistricts: zonesCount,
        permittedUses: usesCount,
        testAddresses: addressesCount,
        sampleZone: sampleZone,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Supabase connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to Supabase',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}


