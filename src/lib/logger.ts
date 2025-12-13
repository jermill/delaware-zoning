import pino from 'pino';

/**
 * Structured logger using Pino
 * Replace all console.log/error/warn with this logger
 */
export const logger = typeof window !== 'undefined' 
  ? pino({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      browser: {
        asObject: true,
      },
    })
  : pino({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      formatters: {
        level: (label) => {
          return { level: label.toUpperCase() };
        },
      },
      timestamp: pino.stdTimeFunctions.isoTime,
      // Redact sensitive fields
      redact: {
        paths: [
          'password',
          'token',
          'authorization',
          'cookie',
          'apiKey',
          'secret',
          'stripe_customer_id',
          'email',
        ],
        remove: true,
      },
    });

// Helper functions for common log patterns
export const logApiRequest = (method: string, path: string, userId?: string) => {
  logger.info({
    type: 'api_request',
    method,
    path,
    userId,
  });
};

export const logApiError = (
  method: string,
  path: string,
  error: Error,
  userId?: string
) => {
  logger.error({
    type: 'api_error',
    method,
    path,
    error: error.message,
    stack: error.stack,
    userId,
  });
};

export const logStripeEvent = (eventType: string, customerId?: string) => {
  logger.info({
    type: 'stripe_webhook',
    eventType,
    customerId,
  });
};

export const logSearchPerformed = (userId: string, tier: string, address: string) => {
  logger.info({
    type: 'search_performed',
    userId,
    tier,
    address,
  });
};

