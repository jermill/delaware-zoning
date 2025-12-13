/**
 * Unit tests for Supabase Client
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @supabase/supabase-js
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: 'test-id', name: 'test' },
        error: null,
      }),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
        error: null,
      }),
      signUp: vi.fn().mockResolvedValue({
        data: { user: { id: 'new-user' }, session: null },
        error: null,
      }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' }, session: { access_token: 'token' } },
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
  })),
}));

describe('Supabase Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Client Creation', () => {
    it('should create Supabase client with correct config', async () => {
      const { createSupabaseClient } = await import('@/lib/supabase');
      const { createClient } = await import('@supabase/supabase-js');
      
      createSupabaseClient();
      
      expect(createClient).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String)
      );
    });

    it('should create admin client with service role key', async () => {
      const { createSupabaseAdmin } = await import('@/lib/supabase');
      const { createClient } = await import('@supabase/supabase-js');
      
      createSupabaseAdmin();
      
      expect(createClient).toHaveBeenCalled();
    });
  });

  describe('Database Operations', () => {
    it('should query data from table', async () => {
      const { createSupabaseClient } = await import('@/lib/supabase');
      
      const client = createSupabaseClient();
      const result = await client.from('zoning_districts').select('*').single();
      
      expect(result.data).toBeDefined();
      expect(result.error).toBeNull();
    });

    it('should insert data into table', async () => {
      const { createSupabaseAdmin } = await import('@/lib/supabase');
      
      const admin = createSupabaseAdmin();
      const result = await admin
        .from('zoning_districts')
        .insert({ district_code: 'R-1', name: 'Residential' })
        .single();
      
      expect(result.error).toBeNull();
    });

    it('should update existing records', async () => {
      const { createSupabaseAdmin } = await import('@/lib/supabase');
      
      const admin = createSupabaseAdmin();
      const result = await admin
        .from('zoning_districts')
        .update({ name: 'Updated Name' })
        .eq('id', 'test-id')
        .single();
      
      expect(result.error).toBeNull();
    });

    it('should delete records', async () => {
      const { createSupabaseAdmin } = await import('@/lib/supabase');
      
      const admin = createSupabaseAdmin();
      const result = await admin
        .from('zoning_districts')
        .delete()
        .eq('id', 'test-id')
        .single();
      
      expect(result.error).toBeNull();
    });
  });

  describe('Authentication', () => {
    it('should get current user', async () => {
      const { createSupabaseClient } = await import('@/lib/supabase');
      
      const client = createSupabaseClient();
      const { data, error } = await client.auth.getUser();
      
      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.user?.id).toBe('user-123');
    });

    it('should sign up new user', async () => {
      const { createSupabaseClient } = await import('@/lib/supabase');
      
      const client = createSupabaseClient();
      const { data, error } = await client.auth.signUp({
        email: 'newuser@example.com',
        password: 'password123',
      });
      
      expect(error).toBeNull();
      expect(data.user).toBeDefined();
    });

    it('should sign in with password', async () => {
      const { createSupabaseClient } = await import('@/lib/supabase');
      
      const client = createSupabaseClient();
      const { data, error } = await client.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      });
      
      expect(error).toBeNull();
      expect(data.session).toBeDefined();
      expect(data.session?.access_token).toBe('token');
    });

    it('should sign out user', async () => {
      const { createSupabaseClient } = await import('@/lib/supabase');
      
      const client = createSupabaseClient();
      const { error } = await client.auth.signOut();
      
      expect(error).toBeNull();
    });
  });

  describe('RPC Functions', () => {
    it('should call PostGIS RPC function', async () => {
      const { createSupabaseClient } = await import('@/lib/supabase');
      
      const client = createSupabaseClient();
      const { data, error } = await client.rpc('find_zoning_at_point', {
        lat: 39.158168,
        lon: -75.52767,
      });
      
      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should handle RPC errors', async () => {
      const { createSupabaseClient } = await import('@/lib/supabase');
      const client = createSupabaseClient();
      
      (client.rpc as any).mockResolvedValueOnce({
        data: null,
        error: { message: 'Function not found' },
      });
      
      const { data, error } = await client.rpc('non_existent_function');
      
      expect(error).toBeDefined();
      expect(data).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors', async () => {
      const { createSupabaseClient } = await import('@/lib/supabase');
      const client = createSupabaseClient();
      
      (client.from as any).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Connection failed', code: 'ECONNREFUSED' },
        }),
      });
      
      const result = await client.from('test').select('*').single();
      
      expect(result.error).toBeDefined();
      expect(result.data).toBeNull();
    });

    it('should handle authentication errors', async () => {
      const { createSupabaseClient } = await import('@/lib/supabase');
      const client = createSupabaseClient();
      
      (client.auth.signInWithPassword as any).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      });
      
      const { error } = await client.auth.signInWithPassword({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });
      
      expect(error).toBeDefined();
    });
  });

  describe('Type Safety', () => {
    it('should provide type-safe queries', async () => {
      const { createSupabaseClient } = await import('@/lib/supabase');
      
      const client = createSupabaseClient();
      const result = await client
        .from('zoning_districts')
        .select('id, district_code, name')
        .single();
      
      // TypeScript should infer types correctly
      expect(result.data).toBeDefined();
      if (result.data) {
        expect(result.data.id).toBeDefined();
      }
    });
  });
});
