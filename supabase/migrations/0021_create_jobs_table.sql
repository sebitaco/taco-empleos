-- Create jobs table for job listings with Facebook integration
CREATE TABLE IF NOT EXISTS "jobs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "location" text NOT NULL,
  "salary" text NOT NULL,
  "body_content" text NOT NULL,
  "facebook_url" text NOT NULL,
  "tags" text[],
  "featured" boolean DEFAULT false,
  "is_new" boolean DEFAULT false,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "idx_jobs_title" ON "jobs" ("title");
CREATE INDEX IF NOT EXISTS "idx_jobs_location" ON "jobs" ("location");
CREATE INDEX IF NOT EXISTS "idx_jobs_featured" ON "jobs" ("featured");
CREATE INDEX IF NOT EXISTS "idx_jobs_is_active" ON "jobs" ("is_active");
CREATE INDEX IF NOT EXISTS "idx_jobs_created_at" ON "jobs" ("created_at");

-- Enable RLS (Row Level Security)
ALTER TABLE "jobs" ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active jobs
CREATE POLICY "Allow public read access to active jobs" 
ON "jobs" FOR SELECT 
USING ("is_active" = true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON "jobs" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();