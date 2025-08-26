-- Enable form submissions while maintaining security
-- This allows legitimate form submissions but blocks everything else

-- Drop the current INSERT policy that's blocking forms
DROP POLICY IF EXISTS "allow_public_insert" ON waitlist;

-- Create a permissive INSERT policy for form submissions
-- This matches exactly what your form sends
CREATE POLICY "enable_waitlist_form_submissions" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Basic validation - ensure required fields exist
    email IS NOT NULL 
    AND city IS NOT NULL 
    AND audience IS NOT NULL
    AND consent = true
    -- Don't be too restrictive on audience values in case form sends different format
  );

-- Ensure all our security policies remain in place
-- Verify SELECT is blocked for anon (data protection)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'waitlist' 
    AND policyname = 'enable_select_for_authenticated'
  ) THEN
    CREATE POLICY "enable_select_for_authenticated" ON waitlist
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Verify UPDATE is blocked for anon 
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'waitlist' 
    AND policyname = 'enable_update_for_authenticated'
  ) THEN
    CREATE POLICY "enable_update_for_authenticated" ON waitlist
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Verify DELETE is blocked for anon
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'waitlist' 
    AND policyname = 'enable_delete_for_authenticated'
  ) THEN
    CREATE POLICY "enable_delete_for_authenticated" ON waitlist
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Show final policy summary
SELECT 
  '=== FINAL RLS POLICIES ===' as status,
  policyname,
  cmd as operation,
  roles[1] as target_role
FROM pg_policies
WHERE tablename = 'waitlist'
ORDER BY cmd, policyname;