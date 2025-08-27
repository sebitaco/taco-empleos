-- Write-only RLS setup for job_postings
-- This allows anonymous users to submit job postings but NEVER read them
-- Only admins with service role can read/manage the submissions

-- Drop all existing policies to ensure clean setup
DROP POLICY IF EXISTS "anon_can_insert_job_postings" ON "job_postings";
DROP POLICY IF EXISTS "anon_can_view_approved_jobs" ON "job_postings";
DROP POLICY IF EXISTS "anon_insert_policy" ON "job_postings";
DROP POLICY IF EXISTS "anon_select_own_pending" ON "job_postings";
DROP POLICY IF EXISTS "Enable insert for anon role" ON "job_postings";
DROP POLICY IF EXISTS "Enable read approved jobs for anon" ON "job_postings";
DROP POLICY IF EXISTS "Allow anonymous insert job postings" ON "job_postings";
DROP POLICY IF EXISTS "Allow public read access to approved job postings" ON "job_postings";

-- Single INSERT-only policy for anonymous users
-- This is a write-only system - data goes in but can't be read back
CREATE POLICY "anonymous_users_can_submit_job_postings" 
ON "job_postings" 
FOR INSERT 
TO anon
WITH CHECK (
  -- Validate all required fields are present
  email IS NOT NULL 
  AND city IS NOT NULL 
  AND restaurant_name IS NOT NULL
  AND contact_name IS NOT NULL
  AND contact_phone IS NOT NULL
  AND position IS NOT NULL
  AND description IS NOT NULL
  AND consent = true
  AND status = 'pending' -- Force all submissions to start as pending
);

-- NO SELECT policies at all - completely private data
-- Reading will only be possible through admin dashboard with service role

-- Grant only INSERT permission to anon role (no SELECT)
REVOKE ALL ON "job_postings" FROM anon;
GRANT INSERT ON "job_postings" TO anon;

-- Ensure anon has schema access
GRANT USAGE ON SCHEMA public TO anon;