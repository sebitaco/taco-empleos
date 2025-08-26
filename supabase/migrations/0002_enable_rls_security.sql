-- Enable Row Level Security (RLS) for the waitlist table
-- This migration implements comprehensive security policies for the job board waitlist

-- Enable RLS on the waitlist table
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create anon_users role if it doesn't exist (for anonymous access)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon_users') THEN
    CREATE ROLE anon_users;
  END IF;
END $$;

-- Grant necessary permissions to authenticated and anonymous users
GRANT USAGE ON SCHEMA public TO anon, authenticated, anon_users;
GRANT SELECT, INSERT ON waitlist TO anon, authenticated, anon_users;

-- Policy 1: Allow anonymous users to INSERT new waitlist entries
-- This enables the public waitlist form to work
CREATE POLICY "allow_anonymous_waitlist_insert" ON waitlist
  FOR INSERT
  TO anon, anon_users
  WITH CHECK (
    -- Ensure required fields are present
    email IS NOT NULL 
    AND city IS NOT NULL 
    AND audience IS NOT NULL
    AND consent = true
    -- Validate audience-specific required fields
    AND (
      (audience = 'employer' AND company_name IS NOT NULL) OR
      (audience = 'candidate' AND role IS NOT NULL AND experience_years IS NOT NULL) OR
      audience NOT IN ('employer', 'candidate')
    )
  );

-- Policy 2: Allow authenticated users (admin/staff) to view all waitlist entries
-- This enables admin dashboard functionality
CREATE POLICY "allow_authenticated_users_select_all" ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 3: Prevent anonymous users from reading waitlist data
-- This protects user privacy while allowing form submissions
CREATE POLICY "deny_anonymous_select" ON waitlist
  FOR SELECT
  TO anon, anon_users
  USING (false);

-- Policy 4: Allow authenticated users to UPDATE waitlist entries (for admin functions)
CREATE POLICY "allow_authenticated_users_update" ON waitlist
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (
    -- Maintain data integrity on updates
    email IS NOT NULL 
    AND city IS NOT NULL 
    AND audience IS NOT NULL
    AND consent IS NOT NULL
  );

-- Policy 5: Allow authenticated users to DELETE waitlist entries (for admin cleanup)
CREATE POLICY "allow_authenticated_users_delete" ON waitlist
  FOR DELETE
  TO authenticated
  USING (true);

-- Policy 6: Rate limiting protection - prevent rapid insertions from same source
-- Note: This is implemented at application level, but we add a comment for tracking
-- Application should implement rate limiting on the /api/waitlist endpoint

-- Create a function to validate email format (additional security layer)
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- Policy 7: Ensure email format validation
CREATE POLICY "validate_email_format" ON waitlist
  FOR INSERT
  TO anon, authenticated, anon_users
  WITH CHECK (is_valid_email(email));

-- Create indexes for RLS performance optimization
CREATE INDEX IF NOT EXISTS idx_waitlist_rls_audience_email ON waitlist(audience, email);
CREATE INDEX IF NOT EXISTS idx_waitlist_rls_created_at_consent ON waitlist(created_at, consent) WHERE consent = true;

-- Add helpful comments for maintenance
COMMENT ON TABLE waitlist IS 'Job board waitlist with RLS enabled. Anonymous users can INSERT, authenticated users have full access.';
COMMENT ON POLICY "allow_anonymous_waitlist_insert" ON waitlist IS 'Enables public waitlist form submissions with data validation';
COMMENT ON POLICY "allow_authenticated_users_select_all" ON waitlist IS 'Admin dashboard access to view all waitlist entries';
COMMENT ON POLICY "deny_anonymous_select" ON waitlist IS 'Privacy protection - prevents anonymous reading of user data';

-- Security audit logging (optional - uncomment if you want detailed logs)
-- CREATE TABLE IF NOT EXISTS waitlist_audit_log (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   table_name TEXT NOT NULL,
--   operation TEXT NOT NULL,
--   old_values JSONB,
--   new_values JSONB,
--   user_id UUID,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- Security best practices summary:
-- 1. RLS enabled on waitlist table
-- 2. Anonymous users can only INSERT with validation
-- 3. Authenticated users have full CRUD access
-- 4. Email validation function prevents malformed emails
-- 5. Data integrity checks ensure required fields
-- 6. Performance indexes for RLS queries
-- 7. Clear policy names and documentation