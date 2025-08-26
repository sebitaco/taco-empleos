-- Try using PUBLIC role instead of anon specifically
-- Sometimes RLS works better with PUBLIC role

-- Drop the anon-specific policy
DROP POLICY IF EXISTS "anon_can_insert" ON waitlist;

-- Create policy for PUBLIC (which includes anon)
CREATE POLICY "public_insert_access" ON waitlist
  FOR INSERT
  TO public  -- This targets ALL roles including anon
  WITH CHECK (true);

-- Let's also check what roles actually exist and their properties
SELECT 
  'Role Check' as info,
  rolname as policyname,
  CASE 
    WHEN rolname = 'anon' THEN 'Anonymous Role'
    WHEN rolname = 'authenticated' THEN 'Authenticated Role'
    WHEN rolname = 'public' THEN 'Public Role (Everyone)'
    ELSE 'Other Role'
  END as cmd,
  rolcanlogin as target_role,
  rolbypassrls as with_check_condition
FROM pg_roles 
WHERE rolname IN ('anon', 'authenticated', 'public', 'postgres')

UNION ALL

-- Check the new policy
SELECT 
  'Policy Check' as info,
  policyname,
  cmd,
  roles[1] as target_role,
  with_check::text as with_check_condition
FROM pg_policies 
WHERE tablename = 'waitlist'
ORDER BY info, policyname;