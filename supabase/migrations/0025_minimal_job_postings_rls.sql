-- Minimal RLS setup for job_postings - INSERT only, no SELECT required
-- This works with returning: 'minimal' option in the application code

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "anon_insert_policy" ON "job_postings";
DROP POLICY IF EXISTS "anon_select_own_pending" ON "job_postings";
DROP POLICY IF EXISTS "Enable insert for anon role" ON "job_postings";
DROP POLICY IF EXISTS "Enable read approved jobs for anon" ON "job_postings";
DROP POLICY IF EXISTS "Allow anonymous insert job postings" ON "job_postings";
DROP POLICY IF EXISTS "Allow public read access to approved job postings" ON "job_postings";

-- Create single INSERT policy for anon role
-- This allows anonymous users to submit job postings
CREATE POLICY "anon_can_insert_job_postings" 
ON "job_postings" 
FOR INSERT 
TO anon
WITH CHECK (
  -- Ensure required fields are present
  email IS NOT NULL 
  AND city IS NOT NULL 
  AND restaurant_name IS NOT NULL
  AND contact_name IS NOT NULL
  AND contact_phone IS NOT NULL
  AND position IS NOT NULL
  AND description IS NOT NULL
  AND consent = true
  AND status = 'pending' -- Ensure all new posts start as pending
);

-- Optional: Add a SELECT policy ONLY for approved jobs if you want public job listings
-- This keeps private data (phone, email) secure
CREATE POLICY "anon_can_view_approved_jobs" 
ON "job_postings" 
FOR SELECT 
TO anon
USING (status = 'approved');

-- Grant minimal necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON "job_postings" TO anon;
-- Only grant SELECT if you want public job listings
GRANT SELECT ON "job_postings" TO anon;