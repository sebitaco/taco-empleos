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

async function removeConstraints() {
  const sql = postgres(connectionString);
  
  try {
    console.log('Dropping check_candidate_fields constraint...');
    
    await sql`
      ALTER TABLE waitlist 
      DROP CONSTRAINT IF EXISTS check_candidate_fields
    `;
    
    console.log('✅ Dropped check_candidate_fields constraint');
    
    console.log('Adding new simplified constraint...');
    
    await sql`
      ALTER TABLE waitlist 
      ADD CONSTRAINT check_candidate_fields 
      CHECK (
        (audience = 'candidate' AND role IS NOT NULL) OR 
        audience != 'candidate'
      )
    `;
    
    console.log('✅ Added new simplified constraint');
    
    // Check constraints
    const constraints = await sql`
      SELECT constraint_name, check_clause 
      FROM information_schema.check_constraints 
      WHERE constraint_name LIKE '%candidate%'
    `;
    
    console.log('Current constraints:', constraints);
    
  } catch (error) {
    console.error('Error updating constraints:', error.message);
  } finally {
    await sql.end();
  }
}

removeConstraints();