import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL environment variable is required. ' +
    'Set it in .env.local, e.g.: DATABASE_URL="postgresql://postgres:password@localhost:5432/rice_bikes"'
  );
}

const isLocalhost =
  connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

const pool = new Pool({
  connectionString,
  ...(isLocalhost ? {} : { ssl: { rejectUnauthorized: false } }),
});

export default pool;
