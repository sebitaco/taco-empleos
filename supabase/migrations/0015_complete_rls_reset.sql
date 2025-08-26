-- Complete RLS reset and proper configuration
-- This will systematically rebuild RLS from the ground up

-- STEP 1: Complete cleanup
DROP POLICY IF EXISTS "allow_all_inserts_no_conditions" ON waitlist;
DROP POLICY IF EXISTS "allow_select_for_testing" ON waitlist;
DROP POLICY IF EXISTS "universal_insert" ON waitlist;
DROP POLICY IF EXISTS "authenticated_select" ON waitlist;
DROP POLICY IF EXISTS "authenticated_update" ON waitlist;
DROP POLICY IF EXISTS "authenticated_delete" ON waitlist;
DROP POLICY IF EXISTS "public_insert_policy" ON waitlist;
DROP POLICY IF EXISTS "no_select_policy" ON waitlist;
DROP POLICY IF EXISTS "no_update_policy" ON waitlist;
DROP POLICY IF EXISTS "no_delete_policy" ON waitlist;
DROP POLICY IF EXISTS "authenticated_all_access" ON waitlist;

-- Disable RLS to start fresh
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;

-- STEP 2: Verify and set up proper permissions
-- Ensure anon role has the correct permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant table-level permissions explicitly
GRANT SELECT, INSERT ON TABLE waitlist TO anon;
GRANT ALL ON TABLE waitlist TO authenticated;

-- Grant sequence permissions for ID generation
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- STEP 3: Re-enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create simple, working policies
-- Policy for INSERT - allow anonymous users to insert with consent
CREATE POLICY "anon_insert_with_consent" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (consent = true);

-- Policy for SELECT - authenticated users only
CREATE POLICY "authenticated_select" ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for UPDATE - authenticated users only  
CREATE POLICY "authenticated_update" ON waitlist
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for DELETE - authenticated users only
CREATE POLICY "authenticated_delete" ON waitlist
  FOR DELETE
  TO authenticated
  USING (true);

-- STEP 5: Verification
SELECT 
  'RLS Status' as check_type,
  tablename,
  rowsecurity as enabled,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as status
FROM pg_tables 
WHERE tablename = 'waitlist';

SELECT 
  'Policy Check' as check_type,
  policyname as tablename,
  cmd as enabled,
  roles[1] as status
FROM pg_policies 
WHERE tablename = 'waitlist'
ORDER BY cmd, policyname;

SELECT 
  'Permissions Check' as check_type,
  grantee as tablename,
  privilege_type as enabled,
  'OK' as status
FROM information_schema.table_privileges 
WHERE table_name = 'waitlist' 
AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;