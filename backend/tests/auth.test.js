const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createTestApp = require('./testApp');

const app = createTestApp();

describe('Authentication API', () => {
  let testUser;

  beforeEach(async () => {
    // Create a test user
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    const result = await global.testPool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      ['Test User', 'test@example.com', hashedPassword]
    );
    testUser = result.rows[0];
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        name: 'John Doe',
        email: `john_${Date.now()}@example.com`, // Unique email
        password: 'password123',
        confirmPassword: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Registration successful');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(newUser.email);
      expect(response.body.data.user.name).toBe(newUser.name);
      expect(response.body.data).toHaveProperty('token');
    });

    it('should fail with invalid email', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
        confirmPassword: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should fail with password mismatch', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'differentpassword'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('match');
    });

    it('should fail with duplicate email', async () => {
      const newUser = {
        name: 'Test User 2',
        email: 'test@example.com', // Same as existing user
        password: 'password123',
        confirmPassword: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(credentials.email);
      expect(response.body.data).toHaveProperty('token');

      // Verify token is valid
      const decoded = jwt.verify(response.body.data.token, process.env.JWT_SECRET || 'your-secret-key');
      expect(decoded.userId).toBe(testUser.id);
    });

    it('should fail with invalid email', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid');
    });

    it('should fail with invalid password', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid');
    });

    it('should fail with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged out successfully');
    });
  });
});
