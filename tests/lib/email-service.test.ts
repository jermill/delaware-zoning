/**
 * Unit tests for Email Service (SendGrid)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @sendgrid/mail
vi.mock('@sendgrid/mail', () => ({
  default: {
    setApiKey: vi.fn(),
    send: vi.fn().mockResolvedValue([{ statusCode: 202 }, {}]),
  },
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Email Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Send Zoning Report Email', () => {
    it('should send PDF report via email', async () => {
      const { sendZoningReport } = await import('@/lib/email-service');
      const sgMail = (await import('@sendgrid/mail')).default;
      
      const mockPdfBuffer = Buffer.from('mock PDF content');
      
      await sendZoningReport({
        to: 'test@example.com',
        address: '123 Main St, Wilmington, DE',
        pdfBuffer: mockPdfBuffer,
      });
      
      expect(sgMail.send).toHaveBeenCalled();
      const callArg = (sgMail.send as any).mock.calls[0][0];
      
      expect(callArg.to).toBe('test@example.com');
      expect(callArg.subject).toContain('Zoning Report');
      expect(callArg.attachments).toBeDefined();
      expect(callArg.attachments[0].content).toBe(mockPdfBuffer.toString('base64'));
    });

    it('should include property address in subject', async () => {
      const { sendZoningReport } = await import('@/lib/email-service');
      const sgMail = (await import('@sendgrid/mail')).default;
      
      await sendZoningReport({
        to: 'test@example.com',
        address: '456 Oak Ave, Dover, DE',
        pdfBuffer: Buffer.from('test'),
      });
      
      const callArg = (sgMail.send as any).mock.calls[0][0];
      expect(callArg.subject).toContain('456 Oak Ave');
    });

    it('should attach PDF with correct filename', async () => {
      const { sendZoningReport } = await import('@/lib/email-service');
      const sgMail = (await import('@sendgrid/mail')).default;
      
      await sendZoningReport({
        to: 'test@example.com',
        address: '789 Pine St',
        pdfBuffer: Buffer.from('test'),
      });
      
      const callArg = (sgMail.send as any).mock.calls[0][0];
      expect(callArg.attachments[0].filename).toMatch(/zoning-report.*\.pdf$/);
      expect(callArg.attachments[0].type).toBe('application/pdf');
    });

    it('should handle SendGrid errors gracefully', async () => {
      const { sendZoningReport } = await import('@/lib/email-service');
      const sgMail = (await import('@sendgrid/mail')).default;
      
      (sgMail.send as any).mockRejectedValueOnce(
        new Error('SendGrid API error')
      );
      
      await expect(
        sendZoningReport({
          to: 'test@example.com',
          address: 'Test Address',
          pdfBuffer: Buffer.from('test'),
        })
      ).rejects.toThrow();
    });
  });

  describe('Send Welcome Email', () => {
    it('should send welcome email to new users', async () => {
      const { sendWelcomeEmail } = await import('@/lib/email-service');
      const sgMail = (await import('@sendgrid/mail')).default;
      
      await sendWelcomeEmail({
        to: 'newuser@example.com',
        name: 'John Doe',
      });
      
      expect(sgMail.send).toHaveBeenCalled();
      const callArg = (sgMail.send as any).mock.calls[0][0];
      
      expect(callArg.to).toBe('newuser@example.com');
      expect(callArg.subject).toContain('Welcome');
    });

    it('should personalize email with user name', async () => {
      const { sendWelcomeEmail } = await import('@/lib/email-service');
      const sgMail = (await import('@sendgrid/mail')).default;
      
      await sendWelcomeEmail({
        to: 'test@example.com',
        name: 'Jane Smith',
      });
      
      const callArg = (sgMail.send as any).mock.calls[0][0];
      expect(callArg.html).toContain('Jane Smith');
    });
  });

  describe('Send Subscription Confirmation', () => {
    it('should send Pro subscription confirmation', async () => {
      const { sendSubscriptionConfirmation } = await import('@/lib/email-service');
      const sgMail = (await import('@sendgrid/mail')).default;
      
      await sendSubscriptionConfirmation({
        to: 'subscriber@example.com',
        tier: 'pro',
        amount: 29,
      });
      
      expect(sgMail.send).toHaveBeenCalled();
      const callArg = (sgMail.send as any).mock.calls[0][0];
      
      expect(callArg.subject).toContain('Subscription');
      expect(callArg.html).toContain('Pro');
      expect(callArg.html).toContain('$29');
    });

    it('should send Whale subscription confirmation', async () => {
      const { sendSubscriptionConfirmation } = await import('@/lib/email-service');
      const sgMail = (await import('@sendgrid/mail')).default;
      
      await sendSubscriptionConfirmation({
        to: 'vip@example.com',
        tier: 'whale',
        amount: 99,
      });
      
      const callArg = (sgMail.send as any).mock.calls[0][0];
      expect(callArg.html).toContain('Whale');
    });
  });

  describe('Email Validation', () => {
    it('should validate email format before sending', async () => {
      const { sendZoningReport } = await import('@/lib/email-service');
      
      await expect(
        sendZoningReport({
          to: 'invalid-email',
          address: 'Test Address',
          pdfBuffer: Buffer.from('test'),
        })
      ).rejects.toThrow();
    });

    it('should reject empty email addresses', async () => {
      const { sendWelcomeEmail } = await import('@/lib/email-service');
      
      await expect(
        sendWelcomeEmail({
          to: '',
          name: 'Test User',
        })
      ).rejects.toThrow();
    });
  });

  describe('Rate Limiting', () => {
    it('should respect SendGrid rate limits', async () => {
      const { sendZoningReport } = await import('@/lib/email-service');
      const sgMail = (await import('@sendgrid/mail')).default;
      
      // Simulate rate limit error
      (sgMail.send as any).mockRejectedValueOnce({
        code: 429,
        message: 'Rate limit exceeded',
      });
      
      await expect(
        sendZoningReport({
          to: 'test@example.com',
          address: 'Test',
          pdfBuffer: Buffer.from('test'),
        })
      ).rejects.toThrow();
    });
  });

  describe('HTML Email Content', () => {
    it('should generate HTML email with branding', async () => {
      const { sendWelcomeEmail } = await import('@/lib/email-service');
      const sgMail = (await import('@sendgrid/mail')).default;
      
      await sendWelcomeEmail({
        to: 'test@example.com',
        name: 'Test User',
      });
      
      const callArg = (sgMail.send as any).mock.calls[0][0];
      expect(callArg.html).toContain('Delaware Zoning');
      expect(callArg.html).toContain('<html');
      expect(callArg.html).toContain('</html>');
    });

    it('should include CTA buttons in emails', async () => {
      const { sendWelcomeEmail } = await import('@/lib/email-service');
      const sgMail = (await import('@sendgrid/mail')).default;
      
      await sendWelcomeEmail({
        to: 'test@example.com',
        name: 'Test User',
      });
      
      const callArg = (sgMail.send as any).mock.calls[0][0];
      expect(callArg.html).toMatch(/button|btn|cta/i);
    });
  });
});

