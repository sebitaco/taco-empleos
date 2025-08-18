import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('Running database migration...');
    
    // Read the migration file
    const migrationSQL = readFileSync(
      join(__dirname, '..', 'supabase', 'migrations', '0001_create_waitlist_table.sql'),
      'utf8'
    );
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    }).single();
    
    if (error) {
      // If RPC doesn't exist, try direct approach
      console.log('Attempting alternative migration method...');
      
      // Check if table exists
      const { data: tables, error: tableError } = await supabase
        .from('waitlist')
        .select('*')
        .limit(1);
      
      if (tableError && tableError.code === '42P01') {
        console.log('Table does not exist. Please run the migration manually in Supabase SQL Editor.');
        console.log('\nMigration SQL saved at: supabase/migrations/0001_create_waitlist_table.sql');
        console.log('\nSteps:');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Copy and paste the migration SQL');
        console.log('4. Click "Run"');
      } else if (!tableError) {
        console.log('✅ Waitlist table already exists!');
      } else {
        console.error('Error checking table:', tableError);
      }
    } else {
      console.log('✅ Migration completed successfully!');
    }
    
  } catch (err) {
    console.error('Migration error:', err);
  }
}

runMigration();