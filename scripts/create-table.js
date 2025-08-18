import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set in .env.local');
  process.exit(1);
}

async function createTable() {
  const sql = postgres(connectionString);
  
  try {
    console.log('Creating waitlist table...');
    
    // Read the migration file
    const migrationSQL = readFileSync(
      join(__dirname, '..', 'supabase', 'migrations', '0001_create_waitlist_table.sql'),
      'utf8'
    );
    
    // Split into individual statements and execute
    const statements = migrationSQL
      .split(';')
      .filter(stmt => stmt.trim().length > 0)
      .map(stmt => stmt.trim() + ';');
    
    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 50) + '...');
      await sql.unsafe(statement);
    }
    
    console.log('✅ Waitlist table created successfully!');
    
    // Verify table exists
    const tables = await sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename = 'waitlist'
    `;
    
    if (tables.length > 0) {
      console.log('✅ Table verified: waitlist exists');
      
      // Check columns
      const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'waitlist' 
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `;
      
      console.log('\nTable columns:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });
    }
    
  } catch (error) {
    if (error.message && error.message.includes('already exists')) {
      console.log('✅ Table already exists!');
    } else {
      console.error('Error creating table:', error.message);
    }
  } finally {
    await sql.end();
  }
}

createTable();