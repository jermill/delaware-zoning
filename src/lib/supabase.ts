import { createClient } from '@supabase/supabase-js';
import { clientEnv } from './env.client';

// Client-side Supabase client (safe for browser)
export const supabase = createClient(
  clientEnv.NEXT_PUBLIC_SUPABASE_URL,
  clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

