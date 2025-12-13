/**
 * Example test to verify Vitest setup is working
 */

import { describe, it, expect } from 'vitest';

describe('Vitest Setup', () => {
  it('should run basic tests', () => {
    expect(1 + 1).toBe(2);
  });
  
  it('should have environment variables set', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
  
  it('should support async tests', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});

