-- Write-only RLS setup for waitlist - COPYING EXACT PATTERN FROM job_postings
-- This allows anonymous users to submit waitlist entries but NEVER read them
-- Only admins with service role can read/manage the submissions

-- Drop all existing policies to ensure clean setup
DROP POLICY IF EXISTS "anonymous_users_can_submit_waitlist" ON "waitlist";
DROP POLICY IF EXISTS "anon_insert_waitlist" ON "waitlist";
DROP POLICY IF EXISTS "anon_select_own_recent" ON "waitlist";
DROP POLICY IF EXISTS "allow_anon_insert_all" ON "waitlist";
DROP POLICY IF EXISTS "allow_public_insert" ON "waitlist";
DROP POLICY IF EXISTS "anon_can_insert" ON "waitlist";
DROP POLICY IF EXISTS "public_insert_access" ON "waitlist";
DROP POLICY IF EXISTS "anon_insert_with_consent" ON "waitlist";

-- Single INSERT-only policy for anonymous users - SAME AS job_postings
-- This is a write-only system - data goes in but can't be read back
CREATE POLICY "anonymous_users_can_submit_waitlist" 
ON "waitlist" 
FOR INSERT 
TO anon
WITH CHECK (
  -- Simple validation for candidate signups
  email IS NOT NULL 
  AND audience = 'candidate' -- Hero form is always candidates
  AND consent = true
  -- City can be default value, role is optional
);

-- NO SELECT policies at all - completely private data
-- Reading will only be possible through admin dashboard with service role

-- Grant only INSERT permission to anon role (no SELECT) - SAME AS job_postings
REVOKE ALL ON "waitlist" FROM anon;
GRANT INSERT ON "waitlist" TO anon;

-- Ensure anon has schema access - SAME AS job_postings
GRANT USAGE ON SCHEMA public TO anon;