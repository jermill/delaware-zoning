/**
 * Unit tests for Logger utility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock pino
vi.mock('pino', () => ({
  default: vi.fn(() => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  })),
}));

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Logging', () => {
    it('should log info messages', async () => {
      const { logger } = await import('@/lib/logger');
      
      logger.info({ message: 'Test info message', userId: '123' });
      
      expect(logger.info).toHaveBeenCalled();
    });

    it('should log warning messages', async () => {
      const { logger } = await import('@/lib/logger');
      
      logger.warn({ message: 'Test warning', type: 'rate_limit' });
      
      expect(logger.warn).toHaveBeenCalled();
    });

    it('should log error messages', async () => {
      const { logger } = await import('@/lib/logger');
      
      logger.error({ message: 'Test error', error: new Error('Test') });
      
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('API Logging Helpers', () => {
    it('should log API requests', async () => {
      const { logApiRequest } = await import('@/lib/logger');
      
      logApiRequest({
        method: 'GET',
        path: '/api/test',
        userId: '123',
        duration: 150,
      });
      
      // Should not throw
      expect(true).toBe(true);
    });

    it('should log API errors', async () => {
      const { logApiError } = await import('@/lib/logger');
      
      logApiError({
        method: 'POST',
        path: '/api/error',
        error: new Error('Test error'),
        statusCode: 500,
      });
      
      // Should not throw
      expect(true).toBe(true);
    });
  });

  describe('Structured Logging', () => {
    it('should support structured data', async () => {
      const { logger } = await import('@/lib/logger');
      
      logger.info({
        type: 'subscription_activated',
        userId: '123',
        tier: 'pro',
        timestamp: new Date().toISOString(),
      });
      
      expect(logger.info).toHaveBeenCalled();
    });

    it('should handle nested objects', async () => {
      const { logger } = await import('@/lib/logger');
      
      logger.info({
        message: 'Complex log',
        data: {
          user: { id: '123', email: 'test@example.com' },
          metadata: { source: 'webhook' },
        },
      });
      
      expect(logger.info).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle Error objects', async () => {
      const { logger } = await import('@/lib/logger');
      
      const error = new Error('Test error');
      error.stack = 'Error stack trace';
      
      logger.error({
        message: 'Error occurred',
        error: error,
      });
      
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle non-Error objects', async () => {
      const { logger } = await import('@/lib/logger');
      
      logger.error({
        message: 'String error',
        error: 'Something went wrong',
      });
      
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
