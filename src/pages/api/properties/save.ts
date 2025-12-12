import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get auth token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if user has reached save limit
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('save_limit')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (subscription && subscription.save_limit !== null) {
      const { count } = await supabase
        .from('saved_properties')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (count && count >= subscription.save_limit) {
        return res.status(403).json({ 
          error: 'Save limit reached',
          message: `You have reached your limit of ${subscription.save_limit} saved properties. Upgrade your plan to save more.`
        });
      }
    }

    // Save the property
    const propertyData = req.body;
    const { data, error } = await supabase
      .from('saved_properties')
      .insert([{
        user_id: user.id,
        property_id: propertyData.property_id,
        parcel_id: propertyData.parcel_id,
        address: propertyData.address,
        city: propertyData.city,
        county: propertyData.county,
        zip_code: propertyData.zip_code,
        zoning_district: propertyData.zoning_district,
        permitted_uses: propertyData.permitted_uses,
        dimensional_standards: propertyData.dimensional_standards,
        notes: propertyData.notes || null,
        tags: propertyData.tags || null,
      }])
      .select()
      .single();

    if (error) {
      // Check for duplicate
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Property already saved' });
      }
      throw error;
    }

    // Update usage tracking
    await supabase.rpc('get_current_usage', { p_user_id: user.id });

    return res.status(200).json({ data });
  } catch (error: any) {
    console.error('Error saving property:', error);
    return res.status(500).json({ error: error.message || 'Failed to save property' });
  }
}
