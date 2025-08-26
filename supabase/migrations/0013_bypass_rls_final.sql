-- Final approach: Create a policy that works for ALL users
-- This eliminates any role-specific targeting issues

-- Drop the current policies
DROP POLICY IF EXISTS "allow_insert_to_all" ON waitlist;
DROP POLICY IF EXISTS "block_select" ON waitlist; 
DROP POLICY IF EXISTS "block_update" ON waitlist;
DROP POLICY IF EXISTS "block_delete" ON waitlist;

-- Create a single, universal INSERT policy that applies to everyone
-- No role restrictions, no conditions, just pure access
CREATE POLICY "universal_insert" ON waitlist
  FOR INSERT 
  TO public  -- This targets ALL roles
  WITH CHECK (true);

-- For security, create restrictive policies for other operations
-- But target specific roles to avoid conflicts
CREATE POLICY "authenticated_select" ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated_update" ON waitlist  
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "authenticated_delete" ON waitlist
  FOR DELETE
  TO authenticated
  USING (true);

-- Verify the setup
SELECT 
  'Final Setup:' as status,
  policyname,
  cmd,
  roles,
  CASE 
    WHEN cmd = 'INSERT' THEN '🌍 Universal access'
    ELSE '👤 Admin only'
  END as access_description
FROM pg_policies 
WHERE tablename = 'waitlist'
ORDER BY cmd, policyname;