import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
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

    // Get property ID from query
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Missing property ID' });
    }

    // Delete the property (RLS ensures user can only delete their own)
    const { error } = await supabase
      .from('saved_properties')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error deleting property:', error);
    return res.status(500).json({ error: error.message || 'Failed to delete property' });
  }
}
