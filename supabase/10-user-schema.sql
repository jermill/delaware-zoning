-- ============================================================================
-- USER MANAGEMENT SCHEMA FOR DELAWARE ZONING APP
-- ============================================================================
-- This file creates all user-related tables for authentication, subscriptions,
-- saved properties, search history, and usage tracking.
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
-- Extends auth.users with additional user profile information
-- One-to-one relationship with auth.users
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  -- Additional professional fields
  business_address TEXT,
  license_number TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================
-- Tracks user subscription tiers and billing information
-- ============================================================================

-- Create enum types if they don't exist
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

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'active',
  
  -- Limits based on tier
  search_limit INTEGER, -- NULL means unlimited
  save_limit INTEGER,   -- NULL means unlimited
  export_limit INTEGER, -- NULL means unlimited
  
  -- Billing info
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  billing_cycle_start TIMESTAMPTZ,
  billing_cycle_end TIMESTAMPTZ,
  
  -- Trial info
  trial_ends_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one active subscription per user
  UNIQUE(user_id, status)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- Function to create default free subscription
CREATE OR REPLACE FUNCTION public.handle_new_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, tier, status, search_limit, save_limit, export_limit)
  VALUES (
    NEW.id,
    'free',
    'active',
    10,  -- 10 searches for free tier
    5,   -- 5 saved properties for free tier
    3    -- 3 exports for free tier
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_subscription();

-- ============================================================================
-- SAVED PROPERTIES TABLE
-- ============================================================================
-- Stores properties that users have saved to their dashboard
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.saved_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Property identification
  property_id TEXT NOT NULL, -- From GIS system
  parcel_id TEXT NOT NULL,
  
  -- Property details (denormalized for quick access)
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  county TEXT NOT NULL,
  zip_code TEXT,
  
  -- Zoning information
  zoning_district TEXT,
  permitted_uses JSONB,
  dimensional_standards JSONB,
  
  -- Additional metadata
  notes TEXT,
  tags TEXT[],
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate saves
  UNIQUE(user_id, property_id)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_saved_properties_user_id ON public.saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_properties_county ON public.saved_properties(county);
CREATE INDEX IF NOT EXISTS idx_saved_properties_created_at ON public.saved_properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_properties_tags ON public.saved_properties USING GIN(tags);

-- ============================================================================
-- SEARCH HISTORY TABLE
-- ============================================================================
-- Tracks all searches performed by users for analytics and history
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Search details
  search_query TEXT NOT NULL,
  search_type TEXT NOT NULL, -- 'address', 'parcel', 'location', etc.
  
  -- Results
  results_count INTEGER DEFAULT 0,
  result_property_id TEXT,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamps
  searched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics and history retrieval
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_searched_at ON public.search_history(searched_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_search_type ON public.search_history(search_type);

-- ============================================================================
-- USAGE TRACKING TABLE
-- ============================================================================
-- Tracks monthly usage for enforcing subscription limits
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Billing period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Usage counters
  searches_used INTEGER DEFAULT 0,
  saves_used INTEGER DEFAULT 0,
  exports_used INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- One record per user per month
  UNIQUE(user_id, period_start)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON public.usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_period ON public.usage_tracking(period_start, period_end);

-- Function to get or create current month's usage
CREATE OR REPLACE FUNCTION public.get_current_usage(p_user_id UUID)
RETURNS public.usage_tracking AS $$
DECLARE
  v_usage public.usage_tracking;
  v_period_start DATE := DATE_TRUNC('month', NOW())::DATE;
  v_period_end DATE := (DATE_TRUNC('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
BEGIN
  SELECT * INTO v_usage
  FROM public.usage_tracking
  WHERE user_id = p_user_id 
    AND period_start = v_period_start;
  
  IF NOT FOUND THEN
    INSERT INTO public.usage_tracking (user_id, period_start, period_end)
    VALUES (p_user_id, v_period_start, v_period_end)
    RETURNING * INTO v_usage;
  END IF;
  
  RETURN v_usage;
END;
$$ LANGUAGE plpgsql;

-- Function to increment search count
CREATE OR REPLACE FUNCTION public.increment_search_count(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_usage public.usage_tracking;
  v_subscription public.subscriptions;
BEGIN
  -- Get current usage
  v_usage := public.get_current_usage(p_user_id);
  
  -- Get subscription limits
  SELECT * INTO v_subscription
  FROM public.subscriptions
  WHERE user_id = p_user_id AND status = 'active'
  LIMIT 1;
  
  -- Check if under limit (NULL = unlimited)
  IF v_subscription.search_limit IS NOT NULL 
     AND v_usage.searches_used >= v_subscription.search_limit THEN
    RETURN FALSE;
  END IF;
  
  -- Increment counter
  UPDATE public.usage_tracking
  SET searches_used = searches_used + 1,
      updated_at = NOW()
  WHERE id = v_usage.id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ADMIN STATISTICS VIEW
-- ============================================================================
-- Convenient view for admin dashboard statistics
-- ============================================================================

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

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
-- Automatically update the updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_saved_properties_updated_at ON public.saved_properties;
CREATE TRIGGER update_saved_properties_updated_at
  BEFORE UPDATE ON public.saved_properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_usage_tracking_updated_at ON public.usage_tracking;
CREATE TRIGGER update_usage_tracking_updated_at
  BEFORE UPDATE ON public.usage_tracking
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


