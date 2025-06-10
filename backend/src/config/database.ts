import { Pool } from 'pg';
import dotenv from 'dotenv';
import { mockPool, initializeMockData } from './mock-database';

dotenv.config();

// Use mock database if no real database is configured
const useMockDatabase = !process.env.DATABASE_URL && !process.env.DB_HOST;

let pool: any;

if (useMockDatabase) {
  console.log('🗄️ Using mock database (no PostgreSQL configured)');
  initializeMockData();
  pool = mockPool;
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'vibe_play',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Test database connection
  pool.on('connect', () => {
    console.log('🗄️ Database connected successfully');
  });

  pool.on('error', (err) => {
    console.error('❌ Database connection error:', err);
  });
}

export { pool };

// Helper function for transactions
export const withTransaction = async (callback: (client: any) => Promise<any>) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};