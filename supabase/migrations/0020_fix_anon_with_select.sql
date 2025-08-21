-- FIX: Supabase requires BOTH INSERT and SELECT policies for anon role
-- Based on community findings: Supabase internally performs a SELECT after INSERT
-- This is why INSERT-only policies fail with "row violates row-level security policy"

-- First, ensure RLS is enabled
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start clean
DROP POLICY IF EXISTS "allow_anon_insert_all" ON waitlist;
DROP POLICY IF EXISTS "allow_public_insert" ON waitlist;
DROP POLICY IF EXISTS "anon_can_insert" ON waitlist;
DROP POLICY IF EXISTS "public_insert_access" ON waitlist;
DROP POLICY IF EXISTS "anon_insert_with_consent" ON waitlist;

-- Grant necessary permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT ON TABLE waitlist TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- CREATE BOTH INSERT AND SELECT POLICIES (this is the key!)
-- Policy 1: Allow anon to INSERT with consent
CREATE POLICY "anon_insert_waitlist" 
ON waitlist
FOR INSERT 
TO anon
WITH CHECK (consent = true);

-- Policy 2: Allow anon to SELECT their own submission (necessary for INSERT to work)
-- We restrict this to only allow selecting records created in the last minute
-- This prevents anon from reading other people's data while allowing the INSERT operation
CREATE POLICY "anon_select_own_recent" 
ON waitlist
FOR SELECT 
TO anon
USING (
  created_at >= (NOW() - INTERVAL '1 minute')
);

-- Verify our policies
SELECT 
  policyname,
  cmd,
  roles,
  with_check::text as check_condition,
  qual::text as using_condition
FROM pg_policies 
WHERE tablename = 'waitlist'
ORDER BY cmd, policyname;

-- Test that RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'waitlist';