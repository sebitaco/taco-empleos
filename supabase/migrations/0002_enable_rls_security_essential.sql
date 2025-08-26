-- ESSENTIAL RLS SECURITY FOR PRODUCTION
-- Run this in your Supabase SQL Editor immediately to secure your waitlist table

-- 1. Enable RLS on waitlist table
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- 2. Allow public INSERT (for waitlist form submissions)
CREATE POLICY "public_can_insert_waitlist" ON waitlist
  FOR INSERT
  WITH CHECK (
    email IS NOT NULL 
    AND city IS NOT NULL 
    AND audience IS NOT NULL
    AND consent = true
  );

-- 3. Prevent public SELECT (protect user data)
CREATE POLICY "public_cannot_read_waitlist" ON waitlist
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- 4. Allow authenticated users full access (for admin)
CREATE POLICY "authenticated_full_access" ON waitlist
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Verify RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'waitlist';