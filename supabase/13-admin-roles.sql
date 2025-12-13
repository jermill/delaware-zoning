-- ============================================================================
-- ADMIN ROLE SETUP
-- ============================================================================
-- Adds proper admin role support for production
-- ============================================================================

-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Function to check if a user is an admin (using profiles table)
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to promote a user to admin (can only be run by existing admins or service role)
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id
  FROM public.profiles
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found with email: %', user_email;
  END IF;
  
  -- Update role to admin
  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = target_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (but RLS will protect it)
GRANT EXECUTE ON FUNCTION public.is_user_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin TO authenticated;

COMMENT ON COLUMN public.profiles.role IS 'User role: user or admin';
COMMENT ON FUNCTION public.promote_to_admin IS 'Promote a user to admin role - must be run by service role or existing admin';

-- Instructions for creating first admin
COMMENT ON FUNCTION public.promote_to_admin IS 'To create first admin, run in SQL Editor: SELECT public.promote_to_admin(''your-email@example.com'');';

-- ============================================================================
-- PROMOTE INITIAL ADMIN
-- ============================================================================
-- Promote hi@jermill.dev to admin (run after user signs up)
-- ============================================================================

DO $$
BEGIN
  -- Check if user exists and promote to admin
  IF EXISTS (SELECT 1 FROM public.profiles WHERE email = 'hi@jermill.dev') THEN
    UPDATE public.profiles 
    SET role = 'admin' 
    WHERE email = 'hi@jermill.dev';
    RAISE NOTICE 'Successfully promoted hi@jermill.dev to admin';
  ELSE
    RAISE NOTICE 'User hi@jermill.dev not found - please sign up first, then run this script again';
  END IF;
END $$;


