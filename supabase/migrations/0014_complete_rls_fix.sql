-- Complete RLS fix - Remove all policies and start from absolute basics
-- This time we'll be 100% certain the policy works

-- First, let's see what's currently there and clean everything
DO $$
DECLARE
    pol RECORD;
BEGIN
    -- Drop ALL existing policies on waitlist table
    FOR pol IN (SELECT policyname FROM pg_policies WHERE tablename = 'waitlist') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON waitlist', pol.policyname);
    END LOOP;
    
    RAISE NOTICE 'Dropped all existing policies on waitlist table';
END $$;

-- Ensure RLS is enabled
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions explicitly
GRANT INSERT ON TABLE waitlist TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- Create the absolute simplest policy that should work
-- No role restriction, no conditions, just pure INSERT access
CREATE POLICY "allow_all_inserts_no_conditions" ON waitlist
  FOR INSERT
  WITH CHECK (true);

-- For testing, let's also allow SELECT to anon temporarily
-- This will help us verify if the policies are working at all
CREATE POLICY "allow_select_for_testing" ON waitlist
  FOR SELECT
  TO anon
  USING (true);

-- Verify what we created
SELECT 
  'Policy Check:' as info,
  policyname,
  cmd,
  roles,
  qual::text as using_clause,
  with_check::text as with_check_clause
FROM pg_policies 
WHERE tablename = 'waitlist'
ORDER BY cmd, policyname;

-- Also verify table permissions
SELECT 
  'Permissions:' as info,
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'waitlist' 
AND grantee = 'anon';

-- Test insert as anon role
SET ROLE anon;
INSERT INTO waitlist (email, audience, city, consent, role) 
VALUES ('test-policy-check@example.com', 'candidate', 'Test City', true, 'Test Role')
RETURNING id, email, audience;
RESET ROLE;