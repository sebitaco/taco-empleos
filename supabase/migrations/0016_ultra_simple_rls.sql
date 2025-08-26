-- Ultra-simple RLS approach
-- Start with the absolute most basic policy that should definitely work

-- Remove the potentially problematic policy
DROP POLICY IF EXISTS "anon_insert_with_consent" ON waitlist;

-- Create the simplest possible INSERT policy
-- No conditions, just allow anon to insert
CREATE POLICY "anon_can_insert" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);  -- This should allow ALL inserts from anon

-- Let's also verify the current state
SELECT 
  'Current Policies' as info,
  policyname,
  cmd,
  roles[1] as target_role,
  with_check::text as with_check_condition
FROM pg_policies 
WHERE tablename = 'waitlist'
ORDER BY cmd, policyname;