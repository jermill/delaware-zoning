import { NextApiRequest, NextApiResponse } from 'next';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { logger } from '@/lib/logger';

// Initialize Redis client for rate limiting
let redis: Redis | null = null;
let ratelimiters: Record<string, Ratelimit> = {};

// Only initialize if Upstash credentials are provided
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // Define rate limiters for different endpoints
  ratelimiters = {
    // Search endpoint: 20 requests per minute per IP
    search: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 m'),
      analytics: true,
      prefix: '@ratelimit/search',
    }),

    // Property operations: 30 requests per minute per user
    properties: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 m'),
      analytics: true,
      prefix: '@ratelimit/properties',
    }),

    // Checkout: 5 requests per minute per user
    checkout: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      analytics: true,
      prefix: '@ratelimit/checkout',
    }),

    // Auth (signup/login): 10 requests per hour per IP
    auth: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 h'),
      analytics: true,
      prefix: '@ratelimit/auth',
    }),

    // General API: 100 requests per minute per IP
    general: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      analytics: true,
      prefix: '@ratelimit/general',
    }),
  };
}

/**
 * Get client IP address from request
 */
function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded
    ? (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',')[0]
    : req.socket.remoteAddress || 'unknown';
  return ip;
}

/**
 * Rate limiting middleware
 */
export async function rateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  limitType: keyof typeof ratelimiters = 'general',
  identifier?: string
): Promise<boolean> {
  // If rate limiting not configured, allow request
  if (!redis || !ratelimiters[limitType]) {
    logger.warn({
      type: 'rate_limit_disabled',
      message: 'Rate limiting not configured - using in-memory fallback',
    });
    return true;
  }

  // Use provided identifier or fall back to IP address
  const id = identifier || getClientIp(req);

  try {
    const { success, limit, reset, remaining } = await ratelimiters[
      limitType
    ].limit(id);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', limit.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    res.setHeader('X-RateLimit-Reset', reset.toString());

    if (!success) {
      logger.warn({
        type: 'rate_limit_exceeded',
        limitType,
        identifier: id,
        path: req.url,
      });

      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      });

      return false;
    }

    return true;
  } catch (error: any) {
    // Log error but don't block request if rate limiting fails
    logger.error({
      type: 'rate_limit_error',
      error: error.message,
      path: req.url,
    });
    return true;
  }
}

/**
 * Higher-order function to wrap API routes with rate limiting
 */
export function withRateLimit(
  limitType: keyof typeof ratelimiters = 'general',
  getIdentifier?: (req: NextApiRequest) => string
) {
  return (
    handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void
  ) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const identifier = getIdentifier ? getIdentifier(req) : undefined;
      const allowed = await rateLimit(req, res, limitType, identifier);

      if (!allowed) {
        return; // Response already sent by rateLimit
      }

      return handler(req, res);
    };
  };
}


