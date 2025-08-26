-- Re-enable RLS with completely fresh, working policies
-- This time we'll be more explicit about the role configuration

-- First, ensure we have a clean slate
DROP POLICY IF EXISTS "allow_all_inserts" ON waitlist;
DROP POLICY IF EXISTS "block_anon_select" ON waitlist;
DROP POLICY IF EXISTS "allow_auth_select" ON waitlist;
DROP POLICY IF EXISTS "block_anon_update" ON waitlist;
DROP POLICY IF EXISTS "allow_auth_update" ON waitlist;
DROP POLICY IF EXISTS "block_anon_delete" ON waitlist;
DROP POLICY IF EXISTS "allow_auth_delete" ON waitlist;
DROP POLICY IF EXISTS "enable_waitlist_form_submissions" ON waitlist;
DROP POLICY IF EXISTS "enable_select_for_authenticated" ON waitlist;
DROP POLICY IF EXISTS "enable_update_for_authenticated" ON waitlist;
DROP POLICY IF EXISTS "enable_delete_for_authenticated" ON waitlist;
DROP POLICY IF EXISTS "allow_public_insert" ON waitlist;

-- Re-enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create the simplest possible INSERT policy for anonymous users
-- This should definitely work
CREATE POLICY "public_insert_policy" ON waitlist
  FOR INSERT
  WITH CHECK (true);

-- Block everything else for anonymous users (security)
CREATE POLICY "no_select_policy" ON waitlist
  FOR SELECT
  USING (false);

CREATE POLICY "no_update_policy" ON waitlist
  FOR UPDATE
  USING (false);

CREATE POLICY "no_delete_policy" ON waitlist
  FOR DELETE
  USING (false);

-- Allow authenticated users full access
CREATE POLICY "authenticated_all_access" ON waitlist
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Verify policies were created correctly
SELECT 
  'Final Policies:' as status,
  policyname,
  cmd as operation,
  roles[1] as role,
  CASE 
    WHEN cmd = 'INSERT' THEN '📝 Form submissions'
    WHEN cmd = 'SELECT' THEN '👁️ Read data'
    WHEN cmd = 'UPDATE' THEN '✏️ Modify data'
    WHEN cmd = 'DELETE' THEN '🗑️ Delete data'
    ELSE '🔧 Other'
  END as purpose
FROM pg_policies
WHERE tablename = 'waitlist'
ORDER BY cmd, policyname;