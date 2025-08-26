-- Fix RLS policies to properly work with Supabase auth
-- This migration corrects the policies to properly handle anonymous vs authenticated access

-- First, drop existing policies that aren't working correctly
DROP POLICY IF EXISTS "allow_anonymous_waitlist_insert" ON waitlist;
DROP POLICY IF EXISTS "allow_authenticated_users_select_all" ON waitlist;
DROP POLICY IF EXISTS "deny_anonymous_select" ON waitlist;
DROP POLICY IF EXISTS "allow_authenticated_users_update" ON waitlist;
DROP POLICY IF EXISTS "allow_authenticated_users_delete" ON waitlist;
DROP POLICY IF EXISTS "validate_email_format" ON waitlist;
DROP POLICY IF EXISTS "public_can_insert_waitlist" ON waitlist;
DROP POLICY IF EXISTS "public_cannot_read_waitlist" ON waitlist;
DROP POLICY IF EXISTS "authenticated_full_access" ON waitlist;

-- Create correct policies using Supabase auth functions

-- Policy 1: Allow anyone to INSERT valid waitlist entries
CREATE POLICY "anyone_can_insert_with_consent" ON waitlist
  FOR INSERT
  TO public
  WITH CHECK (
    email IS NOT NULL 
    AND city IS NOT NULL 
    AND audience IS NOT NULL
    AND consent = true
    AND (
      (audience = 'employer' AND company_name IS NOT NULL) OR
      (audience = 'candidate' AND role IS NOT NULL) OR
      audience NOT IN ('employer', 'candidate')
    )
  );

-- Policy 2: Only authenticated users can SELECT
CREATE POLICY "only_authenticated_can_select" ON waitlist
  FOR SELECT
  TO public
  USING (
    auth.role() = 'authenticated' OR 
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Policy 3: Only authenticated users can UPDATE
CREATE POLICY "only_authenticated_can_update" ON waitlist
  FOR UPDATE
  TO public
  USING (
    auth.role() = 'authenticated' OR 
    auth.jwt() ->> 'role' = 'service_role'
  )
  WITH CHECK (
    auth.role() = 'authenticated' OR 
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Policy 4: Only authenticated users can DELETE
CREATE POLICY "only_authenticated_can_delete" ON waitlist
  FOR DELETE
  TO public
  USING (
    auth.role() = 'authenticated' OR 
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Verify RLS is still enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'waitlist' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Add helpful comment
COMMENT ON TABLE waitlist IS 'Waitlist table with corrected RLS policies. Anonymous can INSERT with consent, only authenticated users can SELECT/UPDATE/DELETE.';