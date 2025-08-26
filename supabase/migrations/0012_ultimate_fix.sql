-- Ultimate fix: Grant explicit permissions and create the most basic policies
-- Sometimes the issue is permissions at the role level

-- First, ensure the anon role has basic table permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON TABLE waitlist TO anon;

-- Remove ALL existing policies to start fresh
DROP POLICY IF EXISTS "public_insert_policy" ON waitlist;
DROP POLICY IF EXISTS "no_select_policy" ON waitlist;
DROP POLICY IF EXISTS "no_update_policy" ON waitlist;
DROP POLICY IF EXISTS "no_delete_policy" ON waitlist;
DROP POLICY IF EXISTS "authenticated_all_access" ON waitlist;

-- Create the most permissive policy possible for INSERT
-- This bypasses any role-specific issues
CREATE POLICY "allow_insert_to_all" ON waitlist
  FOR INSERT
  WITH CHECK (true);

-- Keep security policies for other operations
CREATE POLICY "block_select" ON waitlist
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "block_update" ON waitlist
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "block_delete" ON waitlist
  FOR DELETE  
  USING (auth.role() = 'authenticated');

-- Show what we've created
SELECT 
  policyname,
  cmd,
  roles,
  CASE 
    WHEN cmd = 'INSERT' THEN '✅ Anyone can insert'
    ELSE '🔒 Auth required'
  END as access_level
FROM pg_policies 
WHERE tablename = 'waitlist'
ORDER BY cmd;

-- Also verify the permissions
SELECT 
  'Permissions:' as type,
  grantee as role_name,
  privilege_type,
  is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'waitlist'
AND grantee IN ('anon', 'authenticated', 'public')
ORDER BY grantee, privilege_type;