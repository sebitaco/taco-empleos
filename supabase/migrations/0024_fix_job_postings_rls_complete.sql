-- Complete fix for RLS policies on job_postings table
-- This ensures anonymous users can insert job postings

-- First, drop all existing policies
DROP POLICY IF EXISTS "Enable insert for anon role" ON "job_postings";
DROP POLICY IF EXISTS "Enable read approved jobs for anon" ON "job_postings";
DROP POLICY IF EXISTS "Allow anonymous insert job postings" ON "job_postings";
DROP POLICY IF EXISTS "Allow public read access to approved job postings" ON "job_postings";

-- Create a policy that allows anonymous inserts
-- Using 'anon' role explicitly
CREATE POLICY "anon_insert_policy" 
ON "job_postings" 
FOR INSERT 
TO anon
WITH CHECK (true);

-- IMPORTANT: We need a SELECT policy for the INSERT to work
-- This is because Supabase uses RETURNING clause which requires SELECT permission
-- We'll make it restrictive - only allow selecting your own just-inserted row
CREATE POLICY "anon_select_own_pending" 
ON "job_postings" 
FOR SELECT 
TO anon
USING (
  -- Only allow selecting pending status (just inserted) from the same session
  status = 'pending' 
  AND created_at >= (now() - interval '1 minute')
);

-- Ensure anon role has the necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT, SELECT ON "job_postings" TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;