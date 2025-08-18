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

async function fixExperienceColumn() {
  const sql = postgres(connectionString);
  
  try {
    console.log('Changing experience_years column from INTEGER to TEXT...');
    
    await sql`
      ALTER TABLE waitlist 
      ALTER COLUMN experience_years TYPE TEXT 
      USING experience_years::TEXT
    `;
    
    console.log('✅ Successfully changed experience_years to TEXT');
    
    // Verify the change
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'waitlist' 
      AND column_name = 'experience_years'
    `;
    
    console.log('Column info:', columns[0]);
    
  } catch (error) {
    console.error('Error changing column:', error.message);
  } finally {
    await sql.end();
  }
}

fixExperienceColumn();