-- ============================================================================
-- PAGE VISITS TRACKING
-- ============================================================================
-- Tracks page visits across the site for analytics
-- ============================================================================

-- Ensure subscription_tier and subscription_status enums exist with all values
DO $$ 
BEGIN
    -- Create subscription_tier type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier') THEN
        CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'business');
    END IF;
    
    -- Create subscription_status type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'trial');
    END IF;
END $$;

-- Create page_visits table
CREATE TABLE IF NOT EXISTS public.page_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- User info (nullable for anonymous visitors)
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Page details
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  
  -- Session tracking
  session_id TEXT,
  
  -- Device/Browser info
  user_agent TEXT,
  ip_address INET,
  device_type TEXT, -- 'mobile', 'tablet', 'desktop'
  browser TEXT,
  os TEXT,
  
  -- Geographic info (can be derived from IP)
  country TEXT,
  region TEXT,
  city TEXT,
  
  -- Timing
  visit_duration INTEGER, -- in seconds
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_page_visits_user_id ON public.page_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_visited_at ON public.page_visits(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_visits_page_path ON public.page_visits(page_path);
CREATE INDEX IF NOT EXISTS idx_page_visits_session_id ON public.page_visits(session_id);

-- Update admin_statistics view to include page visit stats
DROP VIEW IF EXISTS public.admin_statistics;
CREATE OR REPLACE VIEW public.admin_statistics AS
SELECT
  -- User counts
  (SELECT COUNT(*) FROM public.profiles) AS total_users,
  (SELECT COUNT(*) FROM public.profiles WHERE created_at >= NOW() - INTERVAL '30 days') AS users_last_30_days,
  (SELECT COUNT(*) FROM public.profiles WHERE created_at >= NOW() - INTERVAL '7 days') AS users_last_7_days,
  
  -- Subscription breakdown
  (SELECT COUNT(*) FROM public.subscriptions WHERE tier::text = 'free' AND status::text = 'active') AS free_users,
  (SELECT COUNT(*) FROM public.subscriptions WHERE tier::text = 'pro' AND status::text = 'active') AS pro_users,
  (SELECT COUNT(*) FROM public.subscriptions WHERE tier::text = 'business' AND status::text = 'active') AS business_users,
  
  -- Usage stats
  (SELECT COUNT(*) FROM public.search_history) AS total_searches,
  (SELECT COUNT(*) FROM public.search_history WHERE searched_at >= NOW() - INTERVAL '30 days') AS searches_last_30_days,
  (SELECT COUNT(*) FROM public.saved_properties) AS total_saved_properties,
  
  -- Page visit stats
  (SELECT COUNT(*) FROM public.page_visits) AS total_page_visits,
  (SELECT COUNT(*) FROM public.page_visits WHERE visited_at >= NOW() - INTERVAL '24 hours') AS page_visits_last_24h,
  (SELECT COUNT(*) FROM public.page_visits WHERE visited_at >= NOW() - INTERVAL '7 days') AS page_visits_last_7_days,
  (SELECT COUNT(*) FROM public.page_visits WHERE visited_at >= NOW() - INTERVAL '30 days') AS page_visits_last_30_days,
  (SELECT COUNT(DISTINCT session_id) FROM public.page_visits WHERE visited_at >= NOW() - INTERVAL '24 hours') AS unique_visitors_24h,
  (SELECT COUNT(DISTINCT user_id) FROM public.page_visits WHERE user_id IS NOT NULL AND visited_at >= NOW() - INTERVAL '30 days') AS active_users_30_days,
  
  -- Revenue (placeholder - will be calculated from Stripe)
  (SELECT 
    COALESCE(SUM(
      CASE 
        WHEN tier::text = 'pro' THEN 29.99
        WHEN tier::text = 'business' THEN 99.99
        ELSE 0
      END
    ), 0)
  FROM public.subscriptions 
  WHERE status::text = 'active' AND tier::text != 'free') AS monthly_recurring_revenue;

-- Create a view for popular pages
CREATE OR REPLACE VIEW public.popular_pages AS
SELECT 
  page_path,
  page_title,
  COUNT(*) as visit_count,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as unique_sessions,
  AVG(visit_duration) as avg_duration_seconds
FROM public.page_visits
WHERE visited_at >= NOW() - INTERVAL '30 days'
GROUP BY page_path, page_title
ORDER BY visit_count DESC
LIMIT 20;

COMMENT ON TABLE public.page_visits IS 'Tracks all page visits for analytics';
COMMENT ON VIEW public.popular_pages IS 'Most visited pages in the last 30 days';
