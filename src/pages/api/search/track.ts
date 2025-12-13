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

    // Check search limit using the database function
    const { data: canSearch, error: limitError } = await supabase
      .rpc('increment_search_count', { p_user_id: user.id });

    if (limitError) throw limitError;

    if (!canSearch) {
      // Get subscription to show limit
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('search_limit')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      return res.status(403).json({ 
        error: 'Search limit reached',
        message: `You have reached your monthly limit of ${subscription?.search_limit || 0} searches. Upgrade your plan to search more.`
      });
    }

    // Track the search
    const searchData = req.body;
    const { data, error } = await supabase
      .from('search_history')
      .insert([{
        user_id: user.id,
        search_query: searchData.query,
        search_type: searchData.type || 'address',
        results_count: searchData.results_count || 0,
        result_property_id: searchData.result_property_id || null,
        ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        user_agent: req.headers['user-agent'],
      }])
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ data, canSearch: true });
  } catch (error: any) {
    console.error('Error tracking search:', error);
    return res.status(500).json({ error: error.message || 'Failed to track search' });
  }
}


