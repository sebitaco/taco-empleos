-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audience TEXT NOT NULL CHECK (audience IN ('employer', 'candidate')),
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  source TEXT,
  
  -- Employer fields
  company_name TEXT,
  needs TEXT,
  
  -- Candidate fields  
  role TEXT,
  experience_years INTEGER,
  preferred_city TEXT,
  
  -- Meta fields
  consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure unique combination of email and audience
  UNIQUE(email, audience)
);

-- Create indexes for better query performance
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at DESC);
CREATE INDEX idx_waitlist_audience ON waitlist(audience);
CREATE INDEX idx_waitlist_email ON waitlist(email);

-- Add constraints to ensure data integrity
ALTER TABLE waitlist ADD CONSTRAINT check_employer_fields 
  CHECK (
    (audience = 'employer' AND company_name IS NOT NULL) OR 
    audience != 'employer'
  );

ALTER TABLE waitlist ADD CONSTRAINT check_candidate_fields 
  CHECK (
    (audience = 'candidate' AND role IS NOT NULL AND experience_years IS NOT NULL) OR 
    audience != 'candidate'
  );