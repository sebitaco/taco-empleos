-- Create enum for audience type
CREATE TYPE audience_type AS ENUM ('employer', 'candidate');

-- Create waitlist table
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audience audience_type NOT NULL,
  email VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  source TEXT,
  
  -- Employer specific fields
  company_name VARCHAR(255),
  needs TEXT,
  
  -- Candidate specific fields
  role VARCHAR(255),
  experience_years INTEGER,
  preferred_city VARCHAR(100),
  
  -- Common fields
  consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Unique constraint on email + audience combination
  UNIQUE(email, audience)
);

-- Create indexes for better query performance
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at DESC);
CREATE INDEX idx_waitlist_audience ON waitlist(audience);
CREATE INDEX idx_waitlist_city ON waitlist(city);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting (public can insert)
CREATE POLICY "Anyone can insert waitlist entries" ON waitlist
  FOR INSERT WITH CHECK (true);

-- No public read access for privacy
CREATE POLICY "No public read access" ON waitlist
  FOR SELECT USING (false);