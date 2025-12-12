import { cleanEnv, str, url } from 'envalid';

/**
 * Client-side environment variables
 * Only NEXT_PUBLIC_* variables are available in the browser
 */
export const clientEnv = cleanEnv(
  typeof window !== 'undefined' ? (window as any).ENV : process.env,
  {
    NEXT_PUBLIC_SUPABASE_URL: url({
      desc: 'Supabase project URL',
    }),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: str({
      desc: 'Supabase anonymous key',
    }),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: str({
      desc: 'Stripe publishable key',
    }),
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: str({
      desc: 'Google Maps API key',
    }),
    NEXT_PUBLIC_HCAPTCHA_SITE_KEY: str({
      desc: 'hCaptcha site key (public)',
    }),
    NEXT_PUBLIC_BASE_URL: url({
      default: 'http://localhost:3000',
      desc: 'Base URL for the application',
    }),
    NEXT_PUBLIC_SENTRY_DSN: str({
      default: '',
      desc: 'Sentry DSN for error tracking',
    }),
    NEXT_PUBLIC_GA_TRACKING_ID: str({
      default: '',
      desc: 'Google Analytics 4 tracking ID',
    }),
    // Stripe Price IDs (not sensitive - visible in checkout URLs)
    STRIPE_PRICE_LOOKER: str({
      default: '',
      desc: 'Stripe Price ID for Looker tier',
    }),
    STRIPE_PRICE_PRO: str({
      default: '',
      desc: 'Stripe Price ID for Pro tier',
    }),
    STRIPE_PRICE_WHALE: str({
      default: '',
      desc: 'Stripe Price ID for Whale tier',
    }),
  }
);
