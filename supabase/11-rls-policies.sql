-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- This file sets up RLS to ensure users can only access their own data
-- and admins can access all data
-- ============================================================================

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================================================

-- Check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user has 'admin' role in their JWT claims
  RETURN COALESCE(
    (auth.jwt()->>'role')::TEXT = 'admin',
    FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get current user ID
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS UUID AS $$
BEGIN
  RETURN COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::UUID);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PROFILES TABLE POLICIES
-- ============================================================================

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (handled by trigger, but allow explicit inserts)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin());

-- Admins can update all profiles
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.is_admin());

-- ============================================================================
-- SUBSCRIPTIONS TABLE POLICIES
-- ============================================================================

-- Users can view their own subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own subscription (for initial setup)
DROP POLICY IF EXISTS "Users can insert own subscription" ON public.subscriptions;
CREATE POLICY "Users can insert own subscription"
  ON public.subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only service role can update subscriptions (through API routes)
-- This prevents users from manually upgrading their tier
DROP POLICY IF EXISTS "Service role can update subscriptions" ON public.subscriptions;
CREATE POLICY "Service role can update subscriptions"
  ON public.subscriptions
  FOR UPDATE
  USING (public.is_admin());

-- Admins can view all subscriptions
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (public.is_admin());

-- ============================================================================
-- SAVED PROPERTIES TABLE POLICIES
-- ============================================================================

-- Users can view their own saved properties
DROP POLICY IF EXISTS "Users can view own saved properties" ON public.saved_properties;
CREATE POLICY "Users can view own saved properties"
  ON public.saved_properties
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own saved properties
DROP POLICY IF EXISTS "Users can insert own saved properties" ON public.saved_properties;
CREATE POLICY "Users can insert own saved properties"
  ON public.saved_properties
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own saved properties (notes, tags)
DROP POLICY IF EXISTS "Users can update own saved properties" ON public.saved_properties;
CREATE POLICY "Users can update own saved properties"
  ON public.saved_properties
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saved properties
DROP POLICY IF EXISTS "Users can delete own saved properties" ON public.saved_properties;
CREATE POLICY "Users can delete own saved properties"
  ON public.saved_properties
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all saved properties
DROP POLICY IF EXISTS "Admins can view all saved properties" ON public.saved_properties;
CREATE POLICY "Admins can view all saved properties"
  ON public.saved_properties
  FOR SELECT
  USING (public.is_admin());

-- ============================================================================
-- SEARCH HISTORY TABLE POLICIES
-- ============================================================================

-- Users can view their own search history
DROP POLICY IF EXISTS "Users can view own search history" ON public.search_history;
CREATE POLICY "Users can view own search history"
  ON public.search_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own search history
DROP POLICY IF EXISTS "Users can insert own search history" ON public.search_history;
CREATE POLICY "Users can insert own search history"
  ON public.search_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users CANNOT update or delete search history (audit trail)
-- Only admins can view all search history

DROP POLICY IF EXISTS "Admins can view all search history" ON public.search_history;
CREATE POLICY "Admins can view all search history"
  ON public.search_history
  FOR SELECT
  USING (public.is_admin());

-- ============================================================================
-- USAGE TRACKING TABLE POLICIES
-- ============================================================================

-- Users can view their own usage
DROP POLICY IF EXISTS "Users can view own usage" ON public.usage_tracking;
CREATE POLICY "Users can view own usage"
  ON public.usage_tracking
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own usage records
DROP POLICY IF EXISTS "Users can insert own usage" ON public.usage_tracking;
CREATE POLICY "Users can insert own usage"
  ON public.usage_tracking
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own usage records (increments)
DROP POLICY IF EXISTS "Users can update own usage" ON public.usage_tracking;
CREATE POLICY "Users can update own usage"
  ON public.usage_tracking
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all usage
DROP POLICY IF EXISTS "Admins can view all usage" ON public.usage_tracking;
CREATE POLICY "Admins can view all usage"
  ON public.usage_tracking
  FOR SELECT
  USING (public.is_admin());

-- ============================================================================
-- ADMIN STATISTICS VIEW
-- ============================================================================
-- The admin_statistics view doesn't need RLS as it's derived from tables
-- that already have RLS enabled. Access is controlled by the underlying tables.
-- ============================================================================

-- Grant access to authenticated users for their own data
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant access to service role for admin operations
GRANT ALL ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
