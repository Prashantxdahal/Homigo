const { Pool } = require('pg');

// Load test environment variables
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: '.env.test' });
} else {
  require('dotenv').config();
}

// Test database configuration
const testPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.TEST_DB_NAME || 'homigo_test',
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || 'admin123'),
  max: 5,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 2000,
});

// Clean database before each test
beforeEach(async () => {
  await testPool.query('DELETE FROM bookings');
  await testPool.query('DELETE FROM listings');
  await testPool.query('DELETE FROM users');
});

// Close database connection after all tests
afterAll(async () => {
  await testPool.end();
});

// Export test pool for use in tests
global.testPool = testPool;
