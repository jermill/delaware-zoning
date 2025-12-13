import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Environment
    environment: process.env.NODE_ENV || 'development',
    
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Edge functions have limitations, keep config minimal
    beforeSend(event) {
      // Don't send events in development
      if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_ENABLED) {
        return null;
      }
      return event;
    },
  });
}


