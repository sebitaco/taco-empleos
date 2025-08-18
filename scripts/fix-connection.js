import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const dbUrl = process.env.DATABASE_URL;

if (dbUrl) {
  // Extract password from brackets
  const match = dbUrl.match(/postgres\.ovuyppqevddfidqacfbf:\[([^\]]+)\]@/);
  
  if (match) {
    const password = match[1];
    const encodedPassword = encodeURIComponent(password);
    
    console.log('Original password:', password);
    console.log('URL-encoded password:', encodedPassword);
    console.log('\nYour DATABASE_URL should be:');
    console.log(`postgresql://postgres.ovuyppqevddfidqacfbf:${encodedPassword}@aws-1-us-east-2.pooler.supabase.com:6543/postgres`);
    console.log('\nUpdate your .env.local file with the URL-encoded password (remove the brackets).');
  } else {
    console.log('Password format looks correct or different than expected.');
  }
}