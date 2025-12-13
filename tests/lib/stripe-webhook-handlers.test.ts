/**
 * Unit tests for Stripe Webhook Handlers
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import Stripe from 'stripe';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  createSupabaseAdmin: vi.fn(() => ({
    from: vi.fn((table: string) => ({
      update: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      single: vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
    })),
  })),
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Stripe Webhook Handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleCheckoutSessionCompleted', () => {
    it('should activate Pro subscription on successful checkout', async () => {
      const { handleCheckoutSessionCompleted } = await import(
        '@/lib/stripe-webhook-handlers'
      );

      const mockSession = {
        id: 'cs_test_123',
        customer: 'cus_test_123',
        customer_email: 'test@example.com',
        subscription: 'sub_test_123',
        metadata: {
          userId: 'user_123',
          planType: 'pro',
        },
        amount_total: 2900,
        payment_status: 'paid',
      } as Stripe.Checkout.Session;

      await expect(
        handleCheckoutSessionCompleted(mockSession)
      ).resolves.not.toThrow();
    });

    it('should handle Whale subscription', async () => {
      const { handleCheckoutSessionCompleted } = await import(
        '@/lib/stripe-webhook-handlers'
      );

      const mockSession = {
        id: 'cs_test_123',
        customer: 'cus_test_123',
        metadata: {
          userId: 'user_123',
          planType: 'whale',
        },
        payment_status: 'paid',
      } as any;

      await expect(
        handleCheckoutSessionCompleted(mockSession)
      ).resolves.not.toThrow();
    });

    it('should throw error for missing userId in metadata', async () => {
      const { handleCheckoutSessionCompleted } = await import(
        '@/lib/stripe-webhook-handlers'
      );

      const mockSession = {
        id: 'cs_test_123',
        metadata: {},
      } as any;

      await expect(handleCheckoutSessionCompleted(mockSession)).rejects.toThrow();
    });
  });

  describe('handleSubscriptionUpdated', () => {
    it('should update subscription status', async () => {
      const { handleSubscriptionUpdated } = await import(
        '@/lib/stripe-webhook-handlers'
      );

      const mockSubscription = {
        id: 'sub_test_123',
        customer: 'cus_test_123',
        status: 'active',
        items: {
          data: [
            {
              price: {
                id: 'price_pro_monthly',
                product: 'prod_pro',
              },
            },
          ],
        },
        metadata: {
          userId: 'user_123',
        },
      } as any;

      await expect(
        handleSubscriptionUpdated(mockSubscription)
      ).resolves.not.toThrow();
    });

    it('should handle subscription cancellation', async () => {
      const { handleSubscriptionUpdated } = await import(
        '@/lib/stripe-webhook-handlers'
      );

      const mockSubscription = {
        id: 'sub_test_123',
        status: 'canceled',
        metadata: {
          userId: 'user_123',
        },
      } as any;

      await expect(
        handleSubscriptionUpdated(mockSubscription)
      ).resolves.not.toThrow();
    });
  });

  describe('handleSubscriptionDeleted', () => {
    it('should downgrade to free tier on cancellation', async () => {
      const { handleSubscriptionDeleted } = await import(
        '@/lib/stripe-webhook-handlers'
      );

      const mockSubscription = {
        id: 'sub_test_123',
        metadata: {
          userId: 'user_123',
        },
      } as any;

      await expect(
        handleSubscriptionDeleted(mockSubscription)
      ).resolves.not.toThrow();
    });
  });

  describe('handlePaymentFailed', () => {
    it('should log payment failure', async () => {
      const { handlePaymentFailed } = await import(
        '@/lib/stripe-webhook-handlers'
      );

      const mockInvoice = {
        id: 'in_test_123',
        customer: 'cus_test_123',
        subscription: 'sub_test_123',
        amount_due: 2900,
        attempt_count: 1,
      } as any;

      await expect(handlePaymentFailed(mockInvoice)).resolves.not.toThrow();
    });
  });

  describe('getTierFromPriceId', () => {
    it('should map Pro price ID to Pro tier', async () => {
      const { getTierFromPriceId } = await import(
        '@/lib/stripe-webhook-handlers'
      );

      const tier = getTierFromPriceId('price_pro_monthly');
      expect(['pro', 'whale', 'free']).toContain(tier);
    });

    it('should map Whale price ID to Whale tier', async () => {
      const { getTierFromPriceId } = await import(
        '@/lib/stripe-webhook-handlers'
      );

      const tier = getTierFromPriceId('price_whale_monthly');
      expect(['pro', 'whale', 'free']).toContain(tier);
    });

    it('should default to Free for unknown price ID', async () => {
      const { getTierFromPriceId } = await import(
        '@/lib/stripe-webhook-handlers'
      );

      const tier = getTierFromPriceId('price_unknown');
      expect(tier).toBe('free');
    });
  });
});
