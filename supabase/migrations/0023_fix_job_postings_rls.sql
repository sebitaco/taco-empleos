-- Fix RLS policies for job_postings table to properly work with anon role

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous insert job postings" ON "job_postings";
DROP POLICY IF EXISTS "Allow public read access to approved job postings" ON "job_postings";

-- Create new policy that explicitly allows anon role to insert
CREATE POLICY "Enable insert for anon role" 
ON "job_postings" 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Optional: If you want to allow reading approved jobs publicly
CREATE POLICY "Enable read approved jobs for anon" 
ON "job_postings" 
FOR SELECT 
TO anon
USING (status = 'approved');

-- Grant necessary permissions to anon role
GRANT INSERT ON "job_postings" TO anon;
GRANT SELECT ON "job_postings" TO anon;