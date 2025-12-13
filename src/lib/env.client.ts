/**
 * Client-side environment variables
 * Only NEXT_PUBLIC_* variables are available in the browser
 * 
 * Uses graceful fallbacks to prevent app crashes during development
 */

export const clientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  NEXT_PUBLIC_HCAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '',
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID || '',
};

// Log warning in development if critical env vars are missing
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const missing: string[] = [];
  if (!clientEnv.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (!clientEnv.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) missing.push('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
  
  if (missing.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missing.join(', ')}\nSome features may not work correctly.`);
  }
}


