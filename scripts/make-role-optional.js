import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set in .env.local');
  process.exit(1);
}

async function makeRoleOptional() {
  const sql = postgres(connectionString);
  
  try {
    console.log('Dropping check_candidate_fields constraint...');
    
    await sql`
      ALTER TABLE waitlist 
      DROP CONSTRAINT IF EXISTS check_candidate_fields
    `;
    
    console.log('✅ Dropped check_candidate_fields constraint');
    
    console.log('Role is now optional for candidates - no constraint needed');
    
  } catch (error) {
    console.error('Error updating constraints:', error.message);
  } finally {
    await sql.end();
  }
}

makeRoleOptional();