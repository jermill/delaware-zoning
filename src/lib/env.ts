import { cleanEnv, str, url } from 'envalid';

/**
 * Validated environment variables
 * This will throw an error at startup if required env vars are missing or invalid
 */
export const env = cleanEnv(process.env, {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: url({
    desc: 'Supabase project URL',
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: str({
    desc: 'Supabase anonymous key',
  }),
  SUPABASE_SERVICE_ROLE_KEY: str({
    desc: 'Supabase service role key (server-side only)',
  }),

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: str({
    desc: 'Stripe publishable key',
  }),
  STRIPE_SECRET_KEY: str({
    desc: 'Stripe secret key',
  }),
  STRIPE_WEBHOOK_SECRET: str({
    desc: 'Stripe webhook signing secret',
    default: '',
  }),
  STRIPE_PRICE_LOOKER: str({
    desc: 'Stripe Price ID for Looker tier',
  }),
  STRIPE_PRICE_PRO: str({
    desc: 'Stripe Price ID for Pro tier',
  }),
  STRIPE_PRICE_WHALE: str({
    desc: 'Stripe Price ID for Whale tier',
  }),

  // Google Places
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: str({
    desc: 'Google Maps API key',
  }),

  // hCaptcha
  NEXT_PUBLIC_HCAPTCHA_SITE_KEY: str({
    desc: 'hCaptcha site key (public)',
  }),
  HCAPTCHA_SECRET_KEY: str({
    desc: 'hCaptcha secret key (server-side only)',
  }),

  // Optional
  NEXT_PUBLIC_BASE_URL: url({
    default: 'http://localhost:3000',
    desc: 'Base URL for the application',
  }),
  NODE_ENV: str({
    choices: ['development', 'test', 'production'],
    default: 'development',
  }),

  // Monitoring (optional - will be added)
  NEXT_PUBLIC_SENTRY_DSN: str({
    default: '',
    desc: 'Sentry DSN for error tracking',
  }),
  NEXT_PUBLIC_GA_TRACKING_ID: str({
    default: '',
    desc: 'Google Analytics 4 tracking ID',
  }),

  // Rate Limiting (optional)
  UPSTASH_REDIS_REST_URL: str({
    default: '',
    desc: 'Upstash Redis URL for rate limiting',
  }),
  UPSTASH_REDIS_REST_TOKEN: str({
    default: '',
    desc: 'Upstash Redis token',
  }),
});
