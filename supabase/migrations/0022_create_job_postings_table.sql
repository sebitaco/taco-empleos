-- Create job_postings table for employer job posting submissions
CREATE TABLE IF NOT EXISTS "job_postings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text NOT NULL,
  "city" text NOT NULL,
  "restaurant_name" text NOT NULL,
  "contact_name" text NOT NULL,
  "contact_phone" text NOT NULL,
  "position" text NOT NULL,
  "salary" text,
  "description" text NOT NULL,
  "consent" boolean NOT NULL DEFAULT false,
  "status" text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "reviewed_at" timestamp with time zone,
  "reviewed_by" text
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "idx_job_postings_status" ON "job_postings" ("status");
CREATE INDEX IF NOT EXISTS "idx_job_postings_created_at" ON "job_postings" ("created_at");
CREATE INDEX IF NOT EXISTS "idx_job_postings_city" ON "job_postings" ("city");
CREATE INDEX IF NOT EXISTS "idx_job_postings_position" ON "job_postings" ("position");

-- Enable RLS (Row Level Security)
ALTER TABLE "job_postings" ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert job postings (for the form submission)
CREATE POLICY "Allow anonymous insert job postings" 
ON "job_postings" FOR INSERT 
WITH CHECK (true);

-- Allow public read access to approved job postings only (if needed for public display)
CREATE POLICY "Allow public read access to approved job postings" 
ON "job_postings" FOR SELECT 
USING (status = 'approved');