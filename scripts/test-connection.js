import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

console.log('Checking environment variables...\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const databaseUrl = process.env.DATABASE_URL;

console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
console.log('DATABASE_URL:', databaseUrl ? '✅ Set' : '❌ Missing');

if (databaseUrl) {
  // Parse and validate DATABASE_URL format
  try {
    const url = new URL(databaseUrl);
    console.log('\nDATABASE_URL structure:');
    console.log('  Protocol:', url.protocol);
    console.log('  Host:', url.hostname);
    console.log('  Port:', url.port || '(default 5432)');
    console.log('  Database:', url.pathname.slice(1));
    console.log('  Username:', url.username);
    console.log('  Password:', url.password ? '***' : 'Missing');
  } catch (e) {
    console.error('\n❌ DATABASE_URL is not a valid URL format');
    console.log('Expected format: postgresql://username:password@host:port/database');
  }
}

if (supabaseUrl) {
  try {
    const url = new URL(supabaseUrl);
    console.log('\nSUPABASE_URL structure:');
    console.log('  Host:', url.hostname);
    
    // Extract project ref from URL
    const projectRef = url.hostname.split('.')[0];
    console.log('  Project Reference:', projectRef);
    
    console.log('\n📝 Your DATABASE_URL should look like:');
    console.log(`postgresql://postgres:[YOUR-PASSWORD]@db.${projectRef}.supabase.co:5432/postgres`);
    console.log('\nYou can find the password in:');
    console.log('Supabase Dashboard → Settings → Database → Connection string');
  } catch (e) {
    console.error('Could not parse SUPABASE_URL');
  }
}