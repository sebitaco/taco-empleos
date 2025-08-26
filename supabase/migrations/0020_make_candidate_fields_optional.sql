-- Remove the constraint that requires role and experience_years for candidates
-- This allows simplified email capture forms to work without collecting all candidate details

-- Drop the existing constraint
ALTER TABLE waitlist DROP CONSTRAINT IF EXISTS check_candidate_fields;

-- Add a new, more flexible constraint that allows optional fields for candidates
-- (keeping employer requirement intact)
ALTER TABLE waitlist ADD CONSTRAINT check_employer_fields_only 
  CHECK (
    (audience = 'employer' AND company_name IS NOT NULL) OR 
    audience != 'employer'
  );

-- Add comment to document the change
COMMENT ON TABLE waitlist IS 'Waitlist for employers and candidates. Candidate fields (role, experience_years) are now optional to support simplified signup forms.';