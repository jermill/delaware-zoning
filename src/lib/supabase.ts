import { createClient } from '@supabase/supabase-js';
import { clientEnv } from './env.client';

// Client-side Supabase client (safe for browser)
// Use fallback values to prevent runtime errors during development
const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

/**
 * Server-side Supabase client with service role (admin access)
 * 
 * ⚠️ WARNING: This should ONLY be imported in server-side code:
 * - API routes (/pages/api/*)
 * - getServerSideProps
 * - getStaticProps
 * 
 * NEVER import this in client components or hooks!
 */
export const createSupabaseAdmin = () => {
  // Lazy import to ensure this only runs on server
  const { serverEnv } = require('./env.server');
  
  return createClient(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
};

