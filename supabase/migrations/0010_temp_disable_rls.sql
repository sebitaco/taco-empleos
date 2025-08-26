-- Temporarily disable RLS to confirm form functionality
-- Then re-enable with simplified approach

-- Disable RLS temporarily
ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;

-- Test that inserts work without RLS
-- This will help confirm the issue is purely RLS-related