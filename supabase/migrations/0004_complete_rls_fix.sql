-- Complete RLS fix - removing all old policies and starting fresh
-- This ensures we have a clean slate

-- First, disable RLS temporarily to clean up
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (comprehensive list)
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'waitlist'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON waitlist', pol.policyname);
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies

-- Policy 1: Everyone can INSERT (with basic validation)
-- Note: We're being permissive here to ensure the form works
CREATE POLICY "allow_insert" ON waitlist
  FOR INSERT
  WITH CHECK (
    email IS NOT NULL 
    AND city IS NOT NULL 
    AND audience IS NOT NULL
    AND consent = true
  );

-- Policy 2: Nobody can SELECT without authentication
-- This protects user data from being read publicly
CREATE POLICY "block_select" ON waitlist
  FOR SELECT
  USING (
    -- Check if user is authenticated
    auth.uid() IS NOT NULL
  );

-- Policy 3: Nobody can UPDATE without authentication
CREATE POLICY "block_update" ON waitlist
  FOR UPDATE
  USING (false)  -- Block all updates from public
  WITH CHECK (false);

-- Policy 4: Nobody can DELETE without authentication  
CREATE POLICY "block_delete" ON waitlist
  FOR DELETE
  USING (false);  -- Block all deletes from public

-- Add a special policy for service role (admin access)
CREATE POLICY "service_role_all" ON waitlist
  FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Verify the table has RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'waitlist';