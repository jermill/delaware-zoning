/**
 * Vitest Global Setup
 * 
 * This file runs before all tests and sets up the test environment.
 */

import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables for tests (skip NODE_ENV as it's read-only in build)
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_mock';
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_mock';
process.env.UPSTASH_REDIS_REST_URL = 'https://test-redis.upstash.io';
process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
process.env.SENDGRID_API_KEY = 'SG.test-key';
process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'AIzaTest123';
process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY = 'test-hcaptcha-site-key';
process.env.HCAPTCHA_SECRET_KEY = 'test-hcaptcha-secret';

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    beforePopState: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
    isFallback: false,
    isReady: true,
  }),
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: (props: any) => {
    const { src, alt, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return { type: 'img', props: { src, alt, ...rest } };
  },
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => {
    return { type: 'a', props: { href }, children };
  },
}));

// Suppress console errors in tests (optional - comment out to see errors)
// global.console = {
//   ...console,
//   error: vi.fn(),
//   warn: vi.fn(),
// };

export {};

