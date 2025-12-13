import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

/**
 * API Route: Get Test Addresses
 * 
 * Returns all test addresses from the database
 * Useful for development and testing
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { city, zone } = req.query;

    let query = supabase
      .from('test_addresses')
      .select('*')
      .order('city', { ascending: true })
      .order('address', { ascending: true });

    // Filter by city if provided
    if (city) {
      query = query.eq('city', city);
    }

    // Filter by zone if provided
    if (zone) {
      query = query.eq('expected_zone_code', zone);
    }

    const { data: addresses, error } = await query;

    if (error) {
      console.error('Error fetching test addresses:', error);
      return res.status(500).json({
        error: 'Failed to fetch test addresses',
        details: error.message,
      });
    }

    // Group by county
    const groupedByCounty = addresses?.reduce((acc: any, addr) => {
      const county = addr.city.includes('Wilmington') || addr.city.includes('Newark') 
        ? 'New Castle'
        : addr.city.includes('Dover')
        ? 'Kent'
        : 'Sussex';
      
      if (!acc[county]) {
        acc[county] = [];
      }
      acc[county].push(addr);
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      data: {
        addresses: addresses || [],
        count: addresses?.length || 0,
        groupedByCounty: groupedByCounty || {},
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Test addresses error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

