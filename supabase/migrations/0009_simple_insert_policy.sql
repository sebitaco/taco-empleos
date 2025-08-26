-- Ultra-simple INSERT policy to ensure forms work
-- We'll be very permissive for INSERT but maintain security for everything else

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "enable_waitlist_form_submissions" ON waitlist;

-- Create the simplest possible INSERT policy that will work
CREATE POLICY "allow_all_inserts" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);  -- Allow all INSERTs - database constraints will handle validation

-- Double-check our security policies are still in place
-- Make sure anon CANNOT SELECT (this is the key security protection)
DROP POLICY IF EXISTS "enable_select_for_authenticated" ON waitlist;
CREATE POLICY "block_anon_select" ON waitlist
  FOR SELECT
  TO anon
  USING (false);  -- Explicitly block anon from reading

-- Allow authenticated to SELECT
CREATE POLICY "allow_auth_select" ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure anon cannot UPDATE
DROP POLICY IF EXISTS "enable_update_for_authenticated" ON waitlist;
CREATE POLICY "block_anon_update" ON waitlist
  FOR UPDATE
  TO anon
  USING (false);

-- Allow authenticated to UPDATE
CREATE POLICY "allow_auth_update" ON waitlist
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure anon cannot DELETE
DROP POLICY IF EXISTS "enable_delete_for_authenticated" ON waitlist;
CREATE POLICY "block_anon_delete" ON waitlist
  FOR DELETE
  TO anon
  USING (false);

-- Allow authenticated to DELETE
CREATE POLICY "allow_auth_delete" ON waitlist
  FOR DELETE
  TO authenticated
  USING (true);

-- Verify all policies
SELECT 
  'Policy Summary:' as info,
  policyname,
  cmd,
  roles[1] as target_role,
  CASE 
    WHEN cmd = 'INSERT' AND roles[1] = 'anon' THEN '✅ Forms can submit'
    WHEN cmd = 'SELECT' AND roles[1] = 'anon' THEN '🔒 Data protected'
    WHEN cmd = 'UPDATE' AND roles[1] = 'anon' THEN '🔒 Cannot modify'
    WHEN cmd = 'DELETE' AND roles[1] = 'anon' THEN '🔒 Cannot delete'
    ELSE '👤 Admin access'
  END as purpose
FROM pg_policies
WHERE tablename = 'waitlist'
ORDER BY cmd, target_role;