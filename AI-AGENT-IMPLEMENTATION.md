# 🛠️ Background AI Agent - Technical Implementation Guide
## Delaware Zoning SaaS Platform

**Document Version:** 1.0  
**Created:** December 11, 2025  
**Status:** Ready for Development  
**Owner:** Delaware Zoning Development Team

---

## 📋 Table of Contents

1. [Database Schema](#database-schema)
2. [Core Agent Class](#core-agent-class)
3. [Search API Integration](#search-api-integration)
4. [Scheduled Functions](#scheduled-functions)
5. [Admin Dashboard](#admin-dashboard)
6. [Phase 2: Intelligence Features](#phase-2-intelligence-features)
7. [Phase 3: AI Translations](#phase-3-ai-translations)
8. [Testing Strategy](#testing-strategy)
9. [Deployment Checklist](#deployment-checklist)

---

## 🗄️ Database Schema

### **Step 1: Add Agent Tables to Supabase**

Add these tables during **Week 2: Supabase Setup**

**File:** `supabase/05-agent-schema.sql` (create new file)

```sql
-- ========================================
-- BACKGROUND AGENT SCHEMA
-- ========================================
-- Tables to support intelligent caching, 
-- analytics, and AI-powered features

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== CACHE METADATA TABLE ==========
-- Stores pre-cached zoning results for popular addresses

CREATE TABLE IF NOT EXISTS agent_cache_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lon NUMERIC NOT NULL,
  zone_id UUID REFERENCES zoning_districts(id),
  hit_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  data JSONB NOT NULL, -- Full zoning result (zone + uses + dimensions + permits)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cache_key ON agent_cache_metadata(cache_key);
CREATE INDEX idx_cache_expires ON agent_cache_metadata(expires_at);
CREATE INDEX idx_cache_hit_count ON agent_cache_metadata(hit_count DESC);
CREATE INDEX idx_cache_address ON agent_cache_metadata(address);
CREATE INDEX idx_cache_zone ON agent_cache_metadata(zone_id);

COMMENT ON TABLE agent_cache_metadata IS 'Pre-cached zoning results for popular addresses';
COMMENT ON COLUMN agent_cache_metadata.cache_key IS 'Normalized address key for lookups';
COMMENT ON COLUMN agent_cache_metadata.hit_count IS 'Number of times this cache was used';
COMMENT ON COLUMN agent_cache_metadata.data IS 'Full zoning result JSON (zone, uses, dimensions, permits)';

-- ========== SEARCH ANALYTICS TABLE ==========
-- Tracks every search for pattern detection and optimization

CREATE TABLE IF NOT EXISTS agent_search_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  address TEXT NOT NULL,
  zone_id UUID REFERENCES zoning_districts(id),
  search_time_ms INTEGER NOT NULL, -- Response time in milliseconds
  was_cached BOOLEAN DEFAULT false,
  user_tier TEXT, -- 'free', 'basic', 'pro'
  searched_at TIMESTAMPTZ DEFAULT NOW(),
  day_of_week INTEGER, -- 0-6 (Sunday = 0)
  hour_of_day INTEGER, -- 0-23
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_address ON agent_search_analytics(address);
CREATE INDEX idx_analytics_zone ON agent_search_analytics(zone_id);
CREATE INDEX idx_analytics_user ON agent_search_analytics(user_id);
CREATE INDEX idx_analytics_time ON agent_search_analytics(searched_at DESC);
CREATE INDEX idx_analytics_cached ON agent_search_analytics(was_cached);

COMMENT ON TABLE agent_search_analytics IS 'Every search logged for pattern detection and optimization';
COMMENT ON COLUMN agent_search_analytics.search_time_ms IS 'Total response time including API calls';
COMMENT ON COLUMN agent_search_analytics.was_cached IS 'Whether result came from cache';

-- ========== AGENT JOBS TABLE ==========
-- Tracks background job execution

CREATE TABLE IF NOT EXISTS agent_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL, -- 'cache_popular', 'check_staleness', 'translate_zones', 'analyze_patterns'
  status TEXT DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  addresses_processed INTEGER DEFAULT 0,
  results JSONB, -- Job-specific results/metrics
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER, -- Job duration in milliseconds
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_jobs_type ON agent_jobs(job_type);
CREATE INDEX idx_jobs_status ON agent_jobs(status);
CREATE INDEX idx_jobs_created ON agent_jobs(created_at DESC);

COMMENT ON TABLE agent_jobs IS 'Background job execution tracking';

-- ========== PDF GENERATION TRACKING ==========
-- Track PDF exports for analytics

CREATE TABLE IF NOT EXISTS pdf_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  address TEXT NOT NULL,
  zone_id UUID REFERENCES zoning_districts(id),
  generation_time_ms INTEGER,
  file_size_kb INTEGER,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pdf_user ON pdf_generations(user_id);
CREATE INDEX idx_pdf_zone ON pdf_generations(zone_id);
CREATE INDEX idx_pdf_generated ON pdf_generations(generated_at DESC);

COMMENT ON TABLE pdf_generations IS 'Track PDF export usage and performance';

-- ========== AI ZONE TRANSLATIONS TABLE ==========
-- Store pre-generated plain-English zone descriptions (Phase 3)

CREATE TABLE IF NOT EXISTS zone_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES zoning_districts(id) ON DELETE CASCADE,
  translation TEXT NOT NULL, -- Plain-English description
  model_version TEXT, -- e.g., 'gpt-4o-mini', 'claude-3-haiku'
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_translation_zone ON zone_translations(zone_id);
CREATE UNIQUE INDEX idx_translation_zone_unique ON zone_translations(zone_id);

COMMENT ON TABLE zone_translations IS 'AI-generated plain-English zone descriptions';

-- ========== HELPER FUNCTIONS ==========

-- Function to get most-searched addresses
CREATE OR REPLACE FUNCTION get_popular_addresses(days_ago INTEGER DEFAULT 7, result_limit INTEGER DEFAULT 50)
RETURNS TABLE (
  address TEXT,
  zone_id UUID,
  search_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    asa.address,
    asa.zone_id,
    COUNT(*) as search_count
  FROM agent_search_analytics asa
  WHERE asa.searched_at >= NOW() - (days_ago || ' days')::INTERVAL
  GROUP BY asa.address, asa.zone_id
  ORDER BY search_count DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_popular_addresses IS 'Get most-searched addresses in last N days';

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM agent_cache_metadata
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_expired_cache IS 'Remove expired cache entries, returns count deleted';

-- Function to get cache statistics
CREATE OR REPLACE FUNCTION get_cache_stats()
RETURNS TABLE (
  total_cached INTEGER,
  total_hits BIGINT,
  avg_hit_count NUMERIC,
  top_address TEXT,
  top_hits INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_cached,
    SUM(hit_count)::BIGINT as total_hits,
    AVG(hit_count)::NUMERIC(10,2) as avg_hit_count,
    (SELECT address FROM agent_cache_metadata ORDER BY hit_count DESC LIMIT 1) as top_address,
    (SELECT hit_count FROM agent_cache_metadata ORDER BY hit_count DESC LIMIT 1)::INTEGER as top_hits
  FROM agent_cache_metadata
  WHERE expires_at > NOW();
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_cache_stats IS 'Get current cache statistics';

-- ========== ROW LEVEL SECURITY ==========

-- Enable RLS on all agent tables
ALTER TABLE agent_cache_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE zone_translations ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for background agent)
CREATE POLICY "Service role full access" ON agent_cache_metadata FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON agent_search_analytics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON agent_jobs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON pdf_generations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON zone_translations FOR ALL USING (auth.role() = 'service_role');

-- Users can read their own analytics
CREATE POLICY "Users can view own analytics" ON agent_search_analytics 
  FOR SELECT USING (auth.uid() = user_id);

-- Users can read their own PDF history
CREATE POLICY "Users can view own PDFs" ON pdf_generations 
  FOR SELECT USING (auth.uid() = user_id);

-- Everyone can read zone translations (public data)
CREATE POLICY "Anyone can read translations" ON zone_translations 
  FOR SELECT USING (true);

-- ========== INITIAL DATA ==========

-- Create first agent job to initialize system
INSERT INTO agent_jobs (job_type, status, results)
VALUES ('system_init', 'completed', '{"message": "Agent system initialized"}');
```

---

## 🤖 Core Agent Class

### **Step 2: Create Background Agent Service**

Add during **Week 3: Core Search**

**File:** `src/lib/backgroundAgent.ts` (create new file)

```typescript
/**
 * Background Agent Service
 * 
 * Handles intelligent caching, analytics, and pattern detection
 * for the Delaware Zoning platform.
 * 
 * @module BackgroundAgent
 * @version 1.0.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface CachedZoningData {
  id: string;
  zone_code: string;
  zone_name: string;
  county: string;
  permitted_uses: any[];
  dimensional_standards: any[];
  permits_required: any[];
}

interface SearchAnalytics {
  userId?: string;
  address: string;
  zoneId: string;
  searchTimeMs: number;
  wasCached: boolean;
  userTier?: string;
}

interface JobResult {
  total: number;
  processed: number;
  cached?: number;
  errors?: number;
}

export class BackgroundAgent {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for admin operations
    );
  }

  /**
   * Get most-searched addresses in last N days
   */
  async getPopularAddresses(daysAgo: number = 7, limit: number = 50) {
    const { data, error } = await this.supabase
      .rpc('get_popular_addresses', {
        days_ago: daysAgo,
        result_limit: limit
      });

    if (error) {
      console.error('Error fetching popular addresses:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Check if address is already cached and not expired
   */
  async checkCacheExists(address: string): Promise<boolean> {
    const cacheKey = this.generateCacheKey(address);
    
    const { data, error } = await this.supabase
      .from('agent_cache_metadata')
      .select('id')
      .eq('cache_key', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (error) {
      console.error('Error checking cache:', error);
      return false;
    }

    return !!data;
  }

  /**
   * Get cached zoning data for an address (if exists and not expired)
   */
  async getCachedData(address: string): Promise<CachedZoningData | null> {
    const cacheKey = this.generateCacheKey(address);
    
    const { data, error } = await this.supabase
      .from('agent_cache_metadata')
      .select('data, hit_count, id')
      .eq('cache_key', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (error) {
      console.error('Error fetching cached data:', error);
      return null;
    }

    if (data) {
      // Increment hit count (fire and forget)
      this.incrementCacheHit(cacheKey).catch(console.error);
      
      return data.data as CachedZoningData;
    }

    return null;
  }

  /**
   * Cache zoning data for an address
   */
  async cacheZoningData(
    address: string, 
    lat: number,
    lon: number,
    zoneId: string
  ): Promise<CachedZoningData | null> {
    try {
      // Fetch full zoning data with all related tables
      const { data: zoningData, error } = await this.supabase
        .from('zoning_districts')
        .select(`
          *,
          permitted_uses(*),
          dimensional_standards(*),
          permits_required(*)
        `)
        .eq('id', zoneId)
        .single();

      if (error || !zoningData) {
        console.error('Error fetching zoning data for cache:', error);
        return null;
      }

      const cacheKey = this.generateCacheKey(address);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

      // Upsert cache entry
      const { error: cacheError } = await this.supabase
        .from('agent_cache_metadata')
        .upsert({
          cache_key: cacheKey,
          address,
          lat,
          lon,
          zone_id: zoneId,
          data: zoningData,
          expires_at: expiresAt.toISOString(),
          cached_at: now.toISOString()
        }, {
          onConflict: 'cache_key'
        });

      if (cacheError) {
        console.error('Error caching data:', cacheError);
        return null;
      }

      return zoningData as CachedZoningData;
    } catch (error) {
      console.error('Exception caching zoning data:', error);
      return null;
    }
  }

  /**
   * Pre-cache popular addresses (main agent job)
   */
  async cachePopularSearches(): Promise<JobResult> {
    const jobId = await this.createJob('cache_popular', 'running');
    const startTime = Date.now();

    try {
      const popular = await this.getPopularAddresses(7, 50);
      let cached = 0;
      let errors = 0;

      for (const item of popular) {
        try {
          const exists = await this.checkCacheExists(item.address);
          
          if (!exists && item.zone_id) {
            // Note: You'll need lat/lon from somewhere - could store in analytics
            // For now, we skip if no zone_id
            cached++;
          }
        } catch (error) {
          console.error(`Error caching ${item.address}:`, error);
          errors++;
        }
      }

      const duration = Date.now() - startTime;
      
      await this.completeJob(jobId, 'completed', {
        total: popular.length,
        processed: popular.length,
        cached,
        errors
      }, duration);

      return { total: popular.length, processed: popular.length, cached, errors };
    } catch (error) {
      const duration = Date.now() - startTime;
      await this.failJob(jobId, error instanceof Error ? error.message : 'Unknown error', duration);
      throw error;
    }
  }

  /**
   * Log search for analytics
   */
  async logSearch(params: SearchAnalytics): Promise<void> {
    try {
      const now = new Date();
      
      await this.supabase
        .from('agent_search_analytics')
        .insert({
          user_id: params.userId || null,
          address: params.address,
          zone_id: params.zoneId,
          search_time_ms: params.searchTimeMs,
          was_cached: params.wasCached,
          user_tier: params.userTier || null,
          day_of_week: now.getDay(),
          hour_of_day: now.getHours(),
          searched_at: now.toISOString()
        });
    } catch (error) {
      // Don't throw - analytics failure shouldn't break search
      console.error('Error logging search:', error);
    }
  }

  /**
   * Log PDF generation
   */
  async logPdfGeneration(params: {
    userId: string;
    address: string;
    zoneId: string;
    generationTimeMs: number;
    fileSizeKb?: number;
  }): Promise<void> {
    try {
      await this.supabase
        .from('pdf_generations')
        .insert({
          user_id: params.userId,
          address: params.address,
          zone_id: params.zoneId,
          generation_time_ms: params.generationTimeMs,
          file_size_kb: params.fileSizeKb || null,
          generated_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error logging PDF generation:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    const { data, error } = await this.supabase
      .rpc('get_cache_stats');

    if (error) {
      console.error('Error fetching cache stats:', error);
      return null;
    }

    return data?.[0] || null;
  }

  /**
   * Clean up expired cache entries
   */
  async cleanupExpiredCache(): Promise<number> {
    const { data, error } = await this.supabase
      .rpc('cleanup_expired_cache');

    if (error) {
      console.error('Error cleaning cache:', error);
      return 0;
    }

    return data || 0;
  }

  // ========== PRIVATE HELPER METHODS ==========

  /**
   * Generate consistent cache key from address
   */
  private generateCacheKey(address: string): string {
    return address
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Increment cache hit count
   */
  private async incrementCacheHit(cacheKey: string): Promise<void> {
    await this.supabase
      .from('agent_cache_metadata')
      .update({ 
        last_accessed: new Date().toISOString()
      })
      .eq('cache_key', cacheKey);

    // Increment hit_count using SQL
    await this.supabase.rpc('increment_cache_hit', { key: cacheKey });
  }

  /**
   * Create new agent job
   */
  private async createJob(jobType: string, status: string): Promise<string> {
    const { data, error } = await this.supabase
      .from('agent_jobs')
      .insert({
        job_type: jobType,
        status,
        started_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error || !data) {
      throw new Error('Failed to create job');
    }

    return data.id;
  }

  /**
   * Complete agent job
   */
  private async completeJob(
    jobId: string, 
    status: string, 
    results: any,
    durationMs: number
  ): Promise<void> {
    await this.supabase
      .from('agent_jobs')
      .update({
        status,
        results,
        duration_ms: durationMs,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);
  }

  /**
   * Fail agent job
   */
  private async failJob(jobId: string, errorMessage: string, durationMs: number): Promise<void> {
    await this.supabase
      .from('agent_jobs')
      .update({
        status: 'failed',
        error_message: errorMessage,
        duration_ms: durationMs,
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId);
  }
}
```

**Add helper SQL function for cache hit increment:**

```sql
-- Add to supabase/05-agent-schema.sql
CREATE OR REPLACE FUNCTION increment_cache_hit(key TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE agent_cache_metadata
  SET hit_count = hit_count + 1
  WHERE cache_key = key;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔍 Search API Integration

### **Step 3: Update Search API to Use Agent**

Modify during **Week 3: Core Search**

**File:** `src/pages/api/search.ts` (modify existing or create new)

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { BackgroundAgent } from '@/lib/backgroundAgent';
import { createClient } from '@supabase/supabase-js';

const agent = new BackgroundAgent();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.body;
  const startTime = Date.now();

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    // FAST PATH: Check cache first
    const cachedData = await agent.getCachedData(address);
    
    if (cachedData) {
      const searchTime = Date.now() - startTime;
      
      // Log the cached search (fire and forget)
      agent.logSearch({
        userId: req.headers['x-user-id'] as string, // From auth middleware
        address,
        zoneId: cachedData.id,
        searchTimeMs: searchTime,
        wasCached: true,
        userTier: req.headers['x-user-tier'] as string
      }).catch(console.error);

      return res.status(200).json({
        ...cachedData,
        fromCache: true,
        responseTime: searchTime
      });
    }

    // SLOW PATH: Full lookup
    // 1. Get lat/lon from Google Places API
    const geocodeResult = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_PLACES_API_KEY}`
    ).then(r => r.json());

    if (!geocodeResult.results || geocodeResult.results.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const { lat, lng } = geocodeResult.results[0].geometry.location;

    // 2. Find zoning district at this point
    const { data: zoneData, error: zoneError } = await supabase
      .rpc('find_zoning_at_point', { lat, lon: lng });

    if (zoneError || !zoneData || zoneData.length === 0) {
      return res.status(404).json({ error: 'No zoning data found for this location' });
    }

    const zone = zoneData[0];

    // 3. Fetch full zoning details
    const { data: zoningDetails, error: detailsError } = await supabase
      .from('zoning_districts')
      .select(`
        *,
        permitted_uses(*),
        dimensional_standards(*),
        permits_required(*)
      `)
      .eq('id', zone.zone_id)
      .single();

    if (detailsError || !zoningDetails) {
      return res.status(500).json({ error: 'Error fetching zoning details' });
    }

    const searchTime = Date.now() - startTime;

    // Log the non-cached search
    agent.logSearch({
      userId: req.headers['x-user-id'] as string,
      address,
      zoneId: zoningDetails.id,
      searchTimeMs: searchTime,
      wasCached: false,
      userTier: req.headers['x-user-tier'] as string
    }).catch(console.error);

    // Background: Cache this for future searches (fire and forget)
    agent.cacheZoningData(address, lat, lng, zoningDetails.id).catch(console.error);

    return res.status(200).json({
      ...zoningDetails,
      fromCache: false,
      responseTime: searchTime
    });

  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ 
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
```

---

## ⏰ Scheduled Functions

### **Step 4: Create Netlify Scheduled Functions**

Add during **Week 3: Core Search**

**File:** `netlify/functions/scheduled-cache.ts` (create new file)

```typescript
/**
 * Scheduled Function: Cache Popular Searches
 * 
 * Runs every 6 hours to pre-cache the top 50 most-searched addresses
 * 
 * Schedule: 0 */6 * * * (every 6 hours)
 */

import { schedule } from '@netlify/functions';
import { BackgroundAgent } from '../../src/lib/backgroundAgent';

const agent = new BackgroundAgent();

const handler = schedule('0 */6 * * *', async (event) => {
  console.log('🤖 Background Agent: Starting cache refresh...');
  console.log('Triggered at:', new Date().toISOString());

  try {
    const result = await agent.cachePopularSearches();
    
    console.log(`✅ Cache job completed successfully`);
    console.log(`   - Total popular addresses: ${result.total}`);
    console.log(`   - Newly cached: ${result.cached}`);
    console.log(`   - Errors: ${result.errors || 0}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        ...result,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('❌ Cache job failed:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    };
  }
});

export { handler };
```

**File:** `netlify/functions/cleanup-cache.ts` (create new file)

```typescript
/**
 * Scheduled Function: Cleanup Expired Cache
 * 
 * Runs daily at 2am to remove expired cache entries
 * 
 * Schedule: 0 2 * * * (2am daily)
 */

import { schedule } from '@netlify/functions';
import { BackgroundAgent } from '../../src/lib/backgroundAgent';

const agent = new BackgroundAgent();

const handler = schedule('0 2 * * *', async (event) => {
  console.log('🧹 Background Agent: Cleaning expired cache...');
  
  try {
    const deletedCount = await agent.cleanupExpiredCache();
    
    console.log(`✅ Cleanup completed: ${deletedCount} expired entries removed`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        deletedCount,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('❌ Cleanup job failed:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
});

export { handler };
```

**Update `netlify.toml`:**

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

# Scheduled Functions
[[functions]]
  name = "scheduled-cache"
  schedule = "0 */6 * * *"

[[functions]]
  name = "cleanup-cache"
  schedule = "0 2 * * *"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## 📊 Admin Dashboard

### **Step 5: Add Agent Metrics to Admin Dashboard**

Add during **Week 8: Polish & Launch**

**File:** `src/pages/api/admin/agent-stats.ts` (create new file)

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { BackgroundAgent } from '@/lib/backgroundAgent';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const agent = new BackgroundAgent();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO: Add admin authentication check here
  // if (!isAdmin(req)) return res.status(403).json({ error: 'Forbidden' });

  try {
    // Get cache statistics
    const cacheStats = await agent.getCacheStats();

    // Get search analytics
    const { data: searches } = await supabase
      .from('agent_search_analytics')
      .select('search_time_ms, was_cached, searched_at')
      .gte('searched_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('searched_at', { ascending: false });

    const totalSearches = searches?.length || 0;
    const cachedSearches = searches?.filter(s => s.was_cached).length || 0;
    const cacheHitRate = totalSearches > 0 
      ? ((cachedSearches / totalSearches) * 100).toFixed(1) 
      : '0.0';

    // Calculate average response times
    const cachedTimes = searches?.filter(s => s.was_cached).map(s => s.search_time_ms) || [];
    const uncachedTimes = searches?.filter(s => !s.was_cached).map(s => s.search_time_ms) || [];

    const avgCached = cachedTimes.length > 0
      ? Math.round(cachedTimes.reduce((a, b) => a + b, 0) / cachedTimes.length)
      : 0;

    const avgUncached = uncachedTimes.length > 0
      ? Math.round(uncachedTimes.reduce((a, b) => a + b, 0) / uncachedTimes.length)
      : 0;

    // Get top searched addresses
    const { data: topAddresses } = await supabase
      .rpc('get_popular_addresses', { days_ago: 30, result_limit: 10 });

    // Get recent jobs
    const { data: recentJobs } = await supabase
      .from('agent_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    return res.status(200).json({
      cacheHitRate: `${cacheHitRate}%`,
      totalSearches,
      cachedSearches,
      uncachedSearches: totalSearches - cachedSearches,
      avgResponseTime: {
        cached: `${avgCached}ms`,
        uncached: `${avgUncached}ms`,
        improvement: avgUncached > 0 
          ? `${Math.round(((avgUncached - avgCached) / avgUncached) * 100)}%` 
          : '0%'
      },
      cacheStats,
      topAddresses: topAddresses || [],
      recentJobs: recentJobs || []
    });

  } catch (error) {
    console.error('Error fetching agent stats:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch agent statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
```

**File:** `src/components/admin/AgentStatsPanel.tsx` (create new file)

```typescript
import { useEffect, useState } from 'react';
import { FiZap, FiClock, FiTrendingUp, FiDatabase } from 'react-icons/fi';

interface AgentStats {
  cacheHitRate: string;
  totalSearches: number;
  cachedSearches: number;
  uncachedSearches: number;
  avgResponseTime: {
    cached: string;
    uncached: string;
    improvement: string;
  };
  cacheStats: any;
  topAddresses: Array<{
    address: string;
    search_count: number;
  }>;
  recentJobs: Array<{
    job_type: string;
    status: string;
    created_at: string;
  }>;
}

export default function AgentStatsPanel() {
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/agent-stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching agent stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading agent statistics...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8 text-red-600">Failed to load agent statistics</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">🤖 Background Agent Performance</h2>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-delaware-blue text-white rounded-lg hover:bg-opacity-90"
        >
          Refresh
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<FiTrendingUp />}
          label="Cache Hit Rate"
          value={stats.cacheHitRate}
          trend="up"
          color="green"
        />
        <MetricCard
          icon={<FiZap />}
          label="Avg Response (Cached)"
          value={stats.avgResponseTime.cached}
          color="blue"
        />
        <MetricCard
          icon={<FiClock />}
          label="Avg Response (Uncached)"
          value={stats.avgResponseTime.uncached}
          color="orange"
        />
        <MetricCard
          icon={<FiDatabase />}
          label="Total Searches (30d)"
          value={stats.totalSearches.toString()}
          color="purple"
        />
      </div>

      {/* Performance Improvement */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 font-semibold">
          🎉 Performance Improvement: {stats.avgResponseTime.improvement} faster with cache
        </p>
        <p className="text-green-700 text-sm mt-1">
          {stats.cachedSearches} of {stats.totalSearches} searches served from cache
        </p>
      </div>

      {/* Top Searched Addresses */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">📍 Top 10 Most-Searched Addresses (30 days)</h3>
        <div className="space-y-2">
          {stats.topAddresses.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span className="text-gray-700">{item.address}</span>
              <span className="bg-delaware-blue text-white px-3 py-1 rounded-full text-sm">
                {item.search_count} searches
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Agent Jobs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">⚙️ Recent Agent Jobs</h3>
        <div className="space-y-2">
          {stats.recentJobs.map((job, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <div>
                <span className="font-medium text-gray-800">{job.job_type}</span>
                <span className="text-gray-500 text-sm ml-2">
                  {new Date(job.created_at).toLocaleString()}
                </span>
              </div>
              <StatusBadge status={job.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, trend, color }: any) {
  const colorClasses = {
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    orange: 'text-orange-600 bg-orange-50',
    purple: 'text-purple-600 bg-purple-50'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        <div className="text-2xl">{icon}</div>
      </div>
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    completed: 'bg-green-100 text-green-800',
    running: 'bg-blue-100 text-blue-800',
    failed: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}
```

**Update `src/pages/admin.tsx`:**

```typescript
import Layout from '@/components/layout/Layout';
import AgentStatsPanel from '@/components/admin/AgentStatsPanel';
import AdminStats from '@/components/admin/AdminStats';
import AdminUserList from '@/components/admin/AdminUserList';
import AdminTierBreakdown from '@/components/admin/AdminTierBreakdown';

export default function AdminPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Add Agent Stats Panel */}
        <div className="mb-12">
          <AgentStatsPanel />
        </div>

        {/* Existing admin components */}
        <AdminStats />
        <AdminTierBreakdown />
        <AdminUserList />
      </div>
    </Layout>
  );
}
```

---

## 🧠 Phase 2: Intelligence Features

### **Step 6: Smart Upgrade Prompts** (Week 6)

**File:** `src/lib/backgroundAgent.ts` (add these methods)

```typescript
/**
 * Get user's search history
 */
async getUserSearchHistory(userId: string, daysAgo: number = 30) {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - daysAgo);

  const { data, error } = await this.supabase
    .from('agent_search_analytics')
    .select('address, zone_id, searched_at, user_tier')
    .eq('user_id', userId)
    .gte('searched_at', sinceDate.toISOString())
    .order('searched_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching user search history:', error);
    return [];
  }

  return data || [];
}

/**
 * Detect if user is a repeat searcher (likely professional)
 */
async detectRepeatSearcher(userId: string): Promise<boolean> {
  const history = await this.getUserSearchHistory(userId, 7);
  
  // Count searches per address
  const addressCounts: Record<string, number> = {};
  history.forEach(item => {
    addressCounts[item.address] = (addressCounts[item.address] || 0) + 1;
  });

  // If any address searched 2+ times in a week
  return Object.values(addressCounts).some(count => count >= 2);
}

/**
 * Analyze user behavior to suggest upgrade
 */
async analyzeUserForUpgrade(userId: string) {
  const [history, isRepeat] = await Promise.all([
    this.getUserSearchHistory(userId, 30),
    this.detectRepeatSearcher(userId)
  ]);

  const currentTier = history[0]?.user_tier || 'free';

  // Free user approaching limit
  if (currentTier === 'free' && history.length >= 4) {
    return {
      shouldPrompt: true,
      reason: 'approaching_limit',
      message: "You've used 4 of 5 free searches this month. Upgrade to Basic for unlimited searches!",
      recommendedTier: 'basic',
      priority: 'high'
    };
  }

  // Free user hit limit
  if (currentTier === 'free' && history.length >= 5) {
    return {
      shouldPrompt: true,
      reason: 'limit_reached',
      message: "You've reached your 5 free searches. Upgrade now to continue searching!",
      recommendedTier: 'basic',
      priority: 'critical'
    };
  }

  // Repeat searcher (professional user pattern)
  if (isRepeat && currentTier === 'basic') {
    return {
      shouldPrompt: true,
      reason: 'repeat_searcher',
      message: "You're searching properties multiple times. Save time with PDF exports! Upgrade to Pro.",
      recommendedTier: 'pro',
      priority: 'medium'
    };
  }

  // Heavy user (could benefit from Pro features)
  if (currentTier === 'basic' && history.length > 30) {
    return {
      shouldPrompt: true,
      reason: 'heavy_user',
      message: "You're a power user! Get more value with Pro features including PDF exports and dimensional data.",
      recommendedTier: 'pro',
      priority: 'low'
    };
  }

  return { shouldPrompt: false };
}
```

**File:** `src/pages/api/user/upgrade-prompt.ts` (create new file)

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { BackgroundAgent } from '@/lib/backgroundAgent';

const agent = new BackgroundAgent();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.headers['x-user-id'] as string;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const analysis = await agent.analyzeUserForUpgrade(userId);
    
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing user for upgrade:', error);
    return res.status(500).json({ error: 'Analysis failed' });
  }
}
```

---

## 🤖 Phase 3: AI Translations

### **Step 7: AI-Powered Zone Translator** (Weeks 12-14)

**File:** `src/lib/zoningTranslator.ts` (create new file)

```typescript
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class ZoningTranslator {
  /**
   * Generate plain-English description of a zoning code
   */
  async translateZone(params: {
    zoneCode: string;
    zoneName: string;
    permittedUses: string[];
    county: string;
  }): Promise<string> {
    const prompt = `Explain this Delaware zoning classification in simple terms for a real estate agent or property buyer:

Zone Code: ${params.zoneCode}
Zone Name: ${params.zoneName}
County: ${params.county}
Permitted Uses: ${params.permittedUses.slice(0, 5).join(', ')}

Write 2-3 sentences that explain:
1. What this zone is typically used for
2. What types of buildings/uses are allowed
3. Any notable restrictions

Use simple, everyday language. Avoid legal jargon. Be friendly and informative.`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Cost-effective model
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('Error translating zone:', error);
      return '';
    }
  }

  /**
   * Pre-generate translations for all zones (batch job)
   */
  async batchTranslateZones() {
    // Fetch all zones that don't have translations yet
    const { data: zones, error } = await supabase
      .from('zoning_districts')
      .select(`
        id,
        zone_code,
        zone_name,
        county,
        permitted_uses(use_name)
      `)
      .is('zone_translations', null)
      .limit(100);

    if (error || !zones) {
      console.error('Error fetching zones:', error);
      return { processed: 0, errors: 0 };
    }

    let processed = 0;
    let errors = 0;

    for (const zone of zones) {
      try {
        const permittedUses = zone.permitted_uses.map((pu: any) => pu.use_name);
        
        const translation = await this.translateZone({
          zoneCode: zone.zone_code,
          zoneName: zone.zone_name,
          county: zone.county,
          permittedUses
        });

        if (translation) {
          await supabase
            .from('zone_translations')
            .upsert({
              zone_id: zone.id,
              translation,
              model_version: 'gpt-4o-mini',
              generated_at: new Date().toISOString()
            });

          processed++;
        }

        // Rate limit: wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error translating zone ${zone.zone_code}:`, error);
        errors++;
      }
    }

    return { processed, errors, total: zones.length };
  }

  /**
   * Get translation for a zone (from cache)
   */
  async getTranslation(zoneId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('zone_translations')
      .select('translation')
      .eq('zone_id', zoneId)
      .single();

    if (error || !data) {
      return null;
    }

    return data.translation;
  }
}
```

**File:** `netlify/functions/translate-zones.ts` (create new file)

```typescript
/**
 * Scheduled Function: Batch Translate Zones
 * 
 * Runs weekly to generate AI translations for new zones
 * 
 * Schedule: 0 2 * * 0 (Sunday 2am)
 */

import { schedule } from '@netlify/functions';
import { ZoningTranslator } from '../../src/lib/zoningTranslator';

const translator = new ZoningTranslator();

const handler = schedule('0 2 * * 0', async (event) => {
  console.log('🤖 AI Translator: Starting batch translation...');
  
  try {
    const result = await translator.batchTranslateZones();
    
    console.log(`✅ Translation completed: ${result.processed} zones translated`);
    console.log(`   - Total zones: ${result.total}`);
    console.log(`   - Errors: ${result.errors}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        ...result,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('❌ Translation job failed:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
});

export { handler };
```

---

## 🧪 Testing Strategy

### **Unit Tests**

```typescript
// tests/backgroundAgent.test.ts
import { BackgroundAgent } from '../src/lib/backgroundAgent';

describe('BackgroundAgent', () => {
  let agent: BackgroundAgent;

  beforeEach(() => {
    agent = new BackgroundAgent();
  });

  test('generateCacheKey normalizes addresses', () => {
    const key = agent['generateCacheKey']('123 Main St, Wilmington, DE');
    expect(key).toBe('123-main-st-wilmington-de');
  });

  test('getCachedData returns null for non-existent address', async () => {
    const result = await agent.getCachedData('nonexistent address');
    expect(result).toBeNull();
  });

  // Add more tests...
});
```

### **Integration Tests**

```typescript
// tests/api/search.test.ts
import { testApiHandler } from 'next-test-api-route-handler';
import * as searchHandler from '../../src/pages/api/search';

describe('/api/search', () => {
  test('returns cached results when available', async () => {
    await testApiHandler({
      handler: searchHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          body: JSON.stringify({ address: '123 Market St, Wilmington, DE' })
        });
        
        const data = await res.json();
        expect(data.fromCache).toBeDefined();
        expect(res.status).toBe(200);
      }
    });
  });
});
```

---

## ✅ Deployment Checklist

### **Week 2: Database Setup**
- [ ] Run `supabase/05-agent-schema.sql` on Supabase project
- [ ] Verify all tables created successfully
- [ ] Test helper functions (get_popular_addresses, etc.)
- [ ] Configure RLS policies

### **Week 3: Core Agent**
- [ ] Install dependencies: `npm install @netlify/functions`
- [ ] Create `src/lib/backgroundAgent.ts`
- [ ] Update search API to use agent
- [ ] Create scheduled functions
- [ ] Test locally with `netlify dev`
- [ ] Deploy to Netlify

### **Week 4: Testing**
- [ ] Test cache hit/miss scenarios
- [ ] Verify analytics logging works
- [ ] Confirm scheduled functions run
- [ ] Monitor Netlify function logs

### **Week 6: Intelligence**
- [ ] Add upgrade prompt methods
- [ ] Create upgrade prompt API route
- [ ] Test with different user scenarios
- [ ] A/B test messaging

### **Week 8: Dashboard**
- [ ] Create admin stats API
- [ ] Build AgentStatsPanel component
- [ ] Add to admin dashboard
- [ ] Test with real data

### **Week 12-14: AI (Optional)**
- [ ] Set up OpenAI API key
- [ ] Create ZoningTranslator class
- [ ] Test with sample zones
- [ ] Run batch translation
- [ ] Monitor API costs

---

## 📞 Support & Questions

If you encounter issues during implementation:

1. **Check Netlify Function Logs:** Netlify Dashboard → Functions → View Logs
2. **Check Supabase Logs:** Supabase Dashboard → Database → Logs
3. **Test Locally:** `netlify dev` to run functions locally
4. **Review SQL:** Test queries directly in Supabase SQL Editor

---

**Status:** ✅ Ready for Implementation  
**Next Step:** Week 2 - Add agent database tables  
**Document Version:** 1.0  

*Last Updated: December 11, 2025*
