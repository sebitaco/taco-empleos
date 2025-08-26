-- Simple PUBLIC role policy without complex queries

-- Drop existing policies
DROP POLICY IF EXISTS "anon_can_insert" ON waitlist;
DROP POLICY IF EXISTS "public_insert_access" ON waitlist;

-- Create policy for PUBLIC role (includes anon)
CREATE POLICY "allow_public_insert" ON waitlist
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Simple verification
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'waitlist' AND cmd = 'INSERT';