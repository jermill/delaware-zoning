import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const visitData = req.body;
    
    // Get user ID from auth header if present
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        userId = user.id;
      }
    }

    // Get IP address
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                      req.socket.remoteAddress || 
                      null;

    // Extract browser and OS from user agent
    const userAgent = visitData.user_agent || req.headers['user-agent'] || '';
    const browser = extractBrowser(userAgent);
    const os = extractOS(userAgent);

    // Insert page visit
    const { error } = await supabase
      .from('page_visits')
      .insert([{
        user_id: userId,
        page_path: visitData.page_path,
        page_title: visitData.page_title,
        referrer: visitData.referrer,
        session_id: visitData.session_id,
        user_agent: userAgent,
        ip_address: ipAddress,
        device_type: visitData.device_type,
        browser,
        os,
        visited_at: visitData.visited_at,
      }]);

    if (error) {
      console.error('Error tracking page visit:', error);
      // Don't throw error, just log it - we don't want tracking to break the app
      return res.status(200).json({ success: false });
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error tracking page visit:', error);
    // Return success anyway to not break the app
    return res.status(200).json({ success: false });
  }
}

// Helper function to extract browser name from user agent
function extractBrowser(userAgent: string): string {
  if (/Firefox/i.test(userAgent)) return 'Firefox';
  if (/Chrome/i.test(userAgent) && !/Edge|Edg/i.test(userAgent)) return 'Chrome';
  if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) return 'Safari';
  if (/Edge|Edg/i.test(userAgent)) return 'Edge';
  if (/Opera|OPR/i.test(userAgent)) return 'Opera';
  return 'Other';
}

// Helper function to extract OS from user agent
function extractOS(userAgent: string): string {
  if (/Windows/i.test(userAgent)) return 'Windows';
  if (/Mac OS|MacOS/i.test(userAgent)) return 'macOS';
  if (/Linux/i.test(userAgent)) return 'Linux';
  if (/Android/i.test(userAgent)) return 'Android';
  if (/iOS|iPhone|iPad/i.test(userAgent)) return 'iOS';
  return 'Other';
}
