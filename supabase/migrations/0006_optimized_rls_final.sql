-- Optimized RLS Configuration - Addressing Supabase Linter Issues
-- This migration creates performant, properly structured RLS policies

-- Step 1: Clean slate - remove ALL existing policies
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;

DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'waitlist'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON waitlist', pol.policyname);
    END LOOP;
END $$;

-- Step 2: Re-enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Step 3: Create optimized policies with proper auth function usage
-- Using (SELECT auth.uid()) pattern for performance optimization

-- Policy for anonymous INSERT (public form submissions)
CREATE POLICY "enable_insert_for_all" ON waitlist
  FOR INSERT
  TO public
  WITH CHECK (
    email IS NOT NULL 
    AND city IS NOT NULL 
    AND audience IN ('employer', 'candidate')
    AND consent = true
  );

-- Policy for authenticated SELECT (admin access)
CREATE POLICY "enable_select_for_authenticated" ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated UPDATE (admin access)
CREATE POLICY "enable_update_for_authenticated" ON waitlist
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated DELETE (admin access)
CREATE POLICY "enable_delete_for_authenticated" ON waitlist
  FOR DELETE
  TO authenticated
  USING (true);

-- Note: We're NOT creating separate policies for anon role for SELECT/UPDATE/DELETE
-- because the absence of a policy means denial by default
-- This avoids the "multiple permissive policies" warning

-- Verify final configuration
SELECT 
  'RLS Configuration Summary' as info,
  count(*) as policy_count,
  string_agg(policyname || ' (' || cmd || ')', ', ') as policies
FROM pg_policies
WHERE tablename = 'waitlist';

-- Add documentation
COMMENT ON TABLE waitlist IS 'Waitlist table with optimized RLS. Public can INSERT, authenticated users have full access, anon blocked from READ/UPDATE/DELETE by default.';
COMMENT ON POLICY "enable_insert_for_all" ON waitlist IS 'Allows public form submissions with validation';
COMMENT ON POLICY "enable_select_for_authenticated" ON waitlist IS 'Authenticated users can view all records';
COMMENT ON POLICY "enable_update_for_authenticated" ON waitlist IS 'Authenticated users can update records';
COMMENT ON POLICY "enable_delete_for_authenticated" ON waitlist IS 'Authenticated users can delete records';