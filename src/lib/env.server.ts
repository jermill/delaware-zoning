import { cleanEnv, str, url } from 'envalid';

/**
 * Server-side environment variables
 * These should NEVER be imported in client-side code
 * Only use in API routes, getServerSideProps, or other server-only code
 */
export const serverEnv = cleanEnv(process.env, {
  // Public variables (also available on client)
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

  // Server-only secrets
  SUPABASE_SERVICE_ROLE_KEY: str({
    desc: 'Supabase service role key (server-side only)',
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
  HCAPTCHA_SECRET_KEY: str({
    desc: 'hCaptcha secret key (server-side only)',
  }),

  // Optional
  NODE_ENV: str({
    choices: ['development', 'test', 'production'],
    default: 'development',
  }),
  NEXT_PUBLIC_SENTRY_DSN: str({
    default: '',
    desc: 'Sentry DSN for error tracking',
  }),
  NEXT_PUBLIC_GA_TRACKING_ID: str({
    default: '',
    desc: 'Google Analytics 4 tracking ID',
  }),
  UPSTASH_REDIS_REST_URL: str({
    default: '',
    desc: 'Upstash Redis URL for rate limiting',
  }),
  UPSTASH_REDIS_REST_TOKEN: str({
    default: '',
    desc: 'Upstash Redis token',
  }),
});

