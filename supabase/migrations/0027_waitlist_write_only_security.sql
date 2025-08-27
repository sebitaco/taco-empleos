-- Write-only RLS setup for waitlist table
-- This ensures COMPLETE privacy - no one can read waitlist submissions
-- Only admins with service role can access the data

-- Drop ALL existing policies to ensure clean setup
DO $$ 
DECLARE
  r RECORD;
BEGIN
  -- Drop all policies on waitlist table
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'waitlist') LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON waitlist';
  END LOOP;
END $$;

-- Ensure RLS is enabled
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Single INSERT-only policy for anonymous users
-- This is a write-only system - data goes in but CANNOT be read back
CREATE POLICY "anonymous_users_can_submit_waitlist" 
ON "waitlist" 
FOR INSERT 
TO anon
WITH CHECK (
  -- Validate all required fields are present
  email IS NOT NULL 
  AND city IS NOT NULL 
  AND audience IS NOT NULL
  AND audience IN ('employer', 'candidate')
  AND consent = true
  -- Employer-specific validation
  AND (
    (audience = 'employer' AND company_name IS NOT NULL) 
    OR audience = 'candidate'
  )
);

-- NO SELECT policies at all - completely private data
-- Reading will only be possible through admin dashboard with service role

-- Revoke all permissions and grant only INSERT
REVOKE ALL ON "waitlist" FROM anon;
GRANT INSERT ON "waitlist" TO anon;

-- Ensure anon has schema and sequence access
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Add comment explaining the security model
COMMENT ON TABLE waitlist IS 'Write-only waitlist for privacy. Anonymous users can submit but NEVER read. Only service role can access submissions for admin review.';