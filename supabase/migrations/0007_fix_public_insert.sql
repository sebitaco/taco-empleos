-- Fix public INSERT access - ensure anon role can insert
-- The issue might be that public != anon role in Supabase

-- Drop and recreate the INSERT policy with explicit role targeting
DROP POLICY IF EXISTS "enable_insert_for_all" ON waitlist;

-- Create policy that explicitly allows anon, authenticated, and service roles
CREATE POLICY "allow_public_insert" ON waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL 
    AND city IS NOT NULL 
    AND audience IN ('employer', 'candidate')
    AND consent = true
  );

-- Verify all policies
SELECT 
  policyname,
  roles,
  cmd as operation,
  CASE 
    WHEN qual IS NOT NULL THEN qual
    ELSE 'true (no condition)'
  END as using_condition,
  CASE 
    WHEN with_check IS NOT NULL THEN with_check
    ELSE 'true (no condition)'
  END as check_condition
FROM pg_policies
WHERE tablename = 'waitlist'
ORDER BY policyname;

-- Also check RLS status
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN 'ENABLED ✅'
    ELSE 'DISABLED ❌'
  END as rls_status
FROM pg_tables
WHERE tablename = 'waitlist';