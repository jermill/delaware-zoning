/**
 * Unit tests for Rate Limiting middleware
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextApiRequest, NextApiResponse } from 'next';

// Mock @upstash/ratelimit and @upstash/redis
vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(() => ({
    // Mock Redis methods if needed
  })),
}));

vi.mock('@upstash/ratelimit', () => {
  const mockLimit = vi.fn().mockResolvedValue({
    success: true,
    limit: 20,
    remaining: 19,
    reset: Date.now() + 60000,
  });

  const MockRatelimit = vi.fn().mockImplementation((config: any) => ({
    limit: mockLimit,
    config,
  }));

  // Add static methods
  (MockRatelimit as any).slidingWindow = vi.fn((requests: number, window: string) => ({
    type: 'slidingWindow',
    requests,
    window,
  }));

  return {
    Ratelimit: MockRatelimit,
  };
});

describe('Rate Limiting Middleware', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;
  let setHeaderMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Setup mock request
    mockReq = {
      headers: {},
      socket: {
        remoteAddress: '192.168.1.1',
      } as any,
      url: '/api/test',
    };

    // Setup mock response
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnThis();
    setHeaderMock = vi.fn();
    
    mockRes = {
      status: statusMock,
      json: jsonMock,
      setHeader: setHeaderMock,
    };
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('Client IP Detection', () => {
    it('should extract IP from x-forwarded-for header', async () => {
      mockReq.headers = {
        'x-forwarded-for': '203.0.113.1, 198.51.100.1',
      };

      // Import after mocks are set
      const { rateLimit } = await import('@/middleware/rateLimit');
      
      await rateLimit(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse,
        'general'
      );

      // Should use first IP from x-forwarded-for
      expect(setHeaderMock).toHaveBeenCalledWith('X-RateLimit-Limit', '20');
    });

    it('should fall back to socket.remoteAddress if no x-forwarded-for', async () => {
      mockReq.headers = {};
      mockReq.socket = { remoteAddress: '192.168.1.1' } as any;

      const { rateLimit } = await import('@/middleware/rateLimit');
      
      await rateLimit(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse,
        'general'
      );

      expect(setHeaderMock).toHaveBeenCalled();
    });

    it('should handle missing IP gracefully', async () => {
      mockReq.headers = {};
      mockReq.socket = {} as any;

      const { rateLimit } = await import('@/middleware/rateLimit');
      
      const result = await rateLimit(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse,
        'general'
      );

      // Should still allow the request
      expect(result).toBe(true);
    });
  });

  describe('Rate Limit Headers', () => {
    it('should set rate limit headers on successful request', async () => {
      const { rateLimit } = await import('@/middleware/rateLimit');
      
      await rateLimit(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse,
        'search'
      );

      expect(setHeaderMock).toHaveBeenCalledWith('X-RateLimit-Limit', '20');
      expect(setHeaderMock).toHaveBeenCalledWith('X-RateLimit-Remaining', '19');
      expect(setHeaderMock).toHaveBeenCalledWith(
        'X-RateLimit-Reset',
        expect.any(String)
      );
    });
  });

  describe('Rate Limit Exceeded', () => {
    it('should return 429 when rate limit exceeded', async () => {
      // Mock rate limit exceeded
      const { Ratelimit } = await import('@upstash/ratelimit');
      (Ratelimit as any).mockImplementationOnce((config: any) => ({
        limit: vi.fn().mockResolvedValue({
          success: false,
          limit: 20,
          remaining: 0,
          reset: Date.now() + 60000,
        }),
        config,
      }));

      // Re-import to get new mock
      vi.resetModules();
      const { rateLimit } = await import('@/middleware/rateLimit');

      const result = await rateLimit(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse,
        'search'
      );

      expect(result).toBe(false);
      expect(statusMock).toHaveBeenCalledWith(429);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Too Many Requests',
          message: expect.any(String),
          retryAfter: expect.any(Number),
        })
      );
    });
  });

  describe('Different Rate Limit Types', () => {
    it('should handle search endpoint limits', async () => {
      const { rateLimit } = await import('@/middleware/rateLimit');
      
      const result = await rateLimit(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse,
        'search'
      );

      expect(result).toBe(true);
    });

    it('should handle properties endpoint limits', async () => {
      const { rateLimit } = await import('@/middleware/rateLimit');
      
      const result = await rateLimit(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse,
        'properties'
      );

      expect(result).toBe(true);
    });

    it('should handle checkout endpoint limits', async () => {
      const { rateLimit } = await import('@/middleware/rateLimit');
      
      const result = await rateLimit(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse,
        'checkout'
      );

      expect(result).toBe(true);
    });

    it('should handle auth endpoint limits', async () => {
      const { rateLimit } = await import('@/middleware/rateLimit');
      
      const result = await rateLimit(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse,
        'auth'
      );

      expect(result).toBe(true);
    });
  });

  describe('Custom Identifier', () => {
    it('should use custom identifier instead of IP', async () => {
      const { rateLimit } = await import('@/middleware/rateLimit');
      
      await rateLimit(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse,
        'properties',
        'user-123'
      );

      // Should work with custom identifier
      expect(setHeaderMock).toHaveBeenCalled();
    });
  });

  describe('Graceful Degradation', () => {
    it('should allow requests when Redis is unavailable', async () => {
      // Mock Redis initialization failure
      process.env.UPSTASH_REDIS_REST_URL = undefined;
      process.env.UPSTASH_REDIS_REST_TOKEN = undefined;

      vi.resetModules();
      const { rateLimit } = await import('@/middleware/rateLimit');

      const result = await rateLimit(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse,
        'general'
      );

      // Should allow request and not throw
      expect(result).toBe(true);
      expect(statusMock).not.toHaveBeenCalledWith(429);
    });

    it('should allow requests on rate limiter error', async () => {
      // Mock rate limit error
      const { Ratelimit } = await import('@upstash/ratelimit');
      (Ratelimit as any).mockImplementationOnce((config: any) => ({
        limit: vi.fn().mockRejectedValue(new Error('Redis connection failed')),
        config,
      }));

      vi.resetModules();
      const { rateLimit } = await import('@/middleware/rateLimit');

      const result = await rateLimit(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse,
        'search'
      );

      // Should gracefully degrade and allow request
      expect(result).toBe(true);
    });
  });

  describe('withRateLimit Higher-Order Function', () => {
    it('should wrap API handler with rate limiting', async () => {
      const { withRateLimit } = await import('@/middleware/rateLimit');
      const mockHandler = vi.fn().mockResolvedValue(undefined);

      const wrappedHandler = withRateLimit('search')(mockHandler);

      await wrappedHandler(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse
      );

      expect(mockHandler).toHaveBeenCalled();
    });

    it('should not call handler when rate limit exceeded', async () => {
      // Mock rate limit exceeded
      const { Ratelimit } = await import('@upstash/ratelimit');
      (Ratelimit as any).mockImplementationOnce((config: any) => ({
        limit: vi.fn().mockResolvedValue({
          success: false,
          limit: 20,
          remaining: 0,
          reset: Date.now() + 60000,
        }),
        config,
      }));

      vi.resetModules();
      const { withRateLimit } = await import('@/middleware/rateLimit');
      const mockHandler = vi.fn();

      const wrappedHandler = withRateLimit('search')(mockHandler);

      await wrappedHandler(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse
      );

      expect(mockHandler).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(429);
    });

    it('should support custom identifier function', async () => {
      const { withRateLimit } = await import('@/middleware/rateLimit');
      const mockHandler = vi.fn();
      const getIdentifier = (req: NextApiRequest) => 'custom-id';

      const wrappedHandler = withRateLimit('search', getIdentifier)(mockHandler);

      await wrappedHandler(
        mockReq as NextApiRequest,
        mockRes as NextApiResponse
      );

      expect(mockHandler).toHaveBeenCalled();
    });
  });
});
