-- Reset anon role configuration completely
-- This will ensure the anon role has proper permissions and properties

-- First, let's see the current anon role configuration
SELECT 
  'Current anon role' as info,
  rolname,
  rolsuper,
  rolinherit,
  rolcreaterole,
  rolcreatedb,
  rolcanlogin,
  rolreplication,
  rolbypassrls,
  rolconnlimit
FROM pg_roles WHERE rolname = 'anon';

-- Reset anon role properties
ALTER ROLE anon WITH 
  NOSUPERUSER 
  INHERIT 
  NOCREATEROLE 
  NOCREATEDB 
  NOLOGIN 
  NOREPLICATION 
  NOBYPASSRLS 
  CONNECTION LIMIT -1;

-- Ensure anon has proper schema access
GRANT USAGE ON SCHEMA public TO anon;

-- Reset all permissions on waitlist table for anon
REVOKE ALL ON TABLE waitlist FROM anon;

-- Grant only the permissions we need
GRANT INSERT, SELECT ON TABLE waitlist TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Verify the new configuration
SELECT 
  'Updated anon role' as info,
  rolname,
  rolsuper,
  rolinherit,
  rolcreaterole,
  rolcreatedb,
  rolcanlogin,
  rolreplication,
  rolbypassrls,
  rolconnlimit
FROM pg_roles WHERE rolname = 'anon';

-- Check permissions
SELECT 
  'anon permissions' as info,
  grantee as rolname,
  privilege_type as rolsuper,
  is_grantable as rolinherit,
  'waitlist' as rolcreaterole
FROM information_schema.table_privileges 
WHERE table_name = 'waitlist' AND grantee = 'anon'
ORDER BY privilege_type;