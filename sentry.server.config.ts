import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Environment
    environment: process.env.NODE_ENV || 'development',
    
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Filter out sensitive data
    beforeSend(event, hint) {
      // Remove sensitive information from request data
      if (event.request) {
        delete event.request.cookies;
        
        if (event.request.headers) {
          delete event.request.headers['authorization'];
          delete event.request.headers['cookie'];
        }
      }
      
      // Remove sensitive query parameters
      if (event.request?.query_string && typeof event.request.query_string === 'string') {
        const sensitiveParams = ['token', 'api_key', 'password'];
        sensitiveParams.forEach(param => {
          if (event.request?.query_string && typeof event.request.query_string === 'string' && event.request.query_string.includes(param)) {
            event.request.query_string = event.request.query_string.replace(
              new RegExp(`${param}=[^&]*`, 'gi'),
              `${param}=[REDACTED]`
            );
          }
        });
      }
      
      // Don't send events in development unless explicitly enabled
      if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_ENABLED) {
        return null;
      }
      
      return event;
    },
  });
}


