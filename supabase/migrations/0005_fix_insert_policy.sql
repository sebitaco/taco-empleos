-- Fix INSERT policy to be more permissive but still secure
-- The current policy might be too restrictive

-- Drop the problematic insert policy
DROP POLICY IF EXISTS "allow_insert" ON waitlist;

-- Create a more permissive INSERT policy that matches the actual constraints
-- This allows the form to work while still requiring essential fields
CREATE POLICY "public_insert_waitlist" ON waitlist
  FOR INSERT
  TO public
  WITH CHECK (
    -- Only require the absolute essentials
    email IS NOT NULL 
    AND city IS NOT NULL 
    AND audience IN ('employer', 'candidate')
    AND consent = true
  );

-- Ensure the blocking policies remain in place
-- These are critical for security
DROP POLICY IF EXISTS "block_select" ON waitlist;
CREATE POLICY "anon_cannot_select" ON waitlist
  FOR SELECT
  TO public  
  USING (
    -- Only authenticated users can read
    auth.uid() IS NOT NULL OR
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- Ensure UPDATE is blocked for anonymous
DROP POLICY IF EXISTS "block_update" ON waitlist;
CREATE POLICY "anon_cannot_update" ON waitlist
  FOR UPDATE
  TO public
  USING (
    -- Only authenticated users can update
    auth.uid() IS NOT NULL OR
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  )
  WITH CHECK (
    auth.uid() IS NOT NULL OR
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- Ensure DELETE is blocked for anonymous
DROP POLICY IF EXISTS "block_delete" ON waitlist;
CREATE POLICY "anon_cannot_delete" ON waitlist
  FOR DELETE
  TO public
  USING (
    -- Only authenticated users can delete
    auth.uid() IS NOT NULL OR
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- Verify RLS is enabled
SELECT 
  'RLS Status:' as info,
  tablename,
  CASE 
    WHEN rowsecurity THEN 'ENABLED ✅'
    ELSE 'DISABLED ❌'
  END as status
FROM pg_tables
WHERE tablename = 'waitlist';