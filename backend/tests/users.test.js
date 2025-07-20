const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createTestApp = require('./testApp');

const app = createTestApp();

describe('Users API', () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    // Create a test user
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    const result = await global.testPool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      ['Test User', 'test@example.com', hashedPassword]
    );
    testUser = result.rows[0];

    // Generate auth token
    authToken = jwt.sign(
      { userId: testUser.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('id', testUser.id);
      expect(response.body.data.user).toHaveProperty('name', 'Test User');
      expect(response.body.data.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.data.user).not.toHaveProperty('password_hash');
    });

    it('should fail without authorization token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('token');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        bio: 'This is my updated bio'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe(updateData.name);
      expect(response.body.data.user.bio).toBe(updateData.bio);
    });

    it('should fail to update with invalid email format', async () => {
      const updateData = {
        email: 'invalid-email-format'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should fail without authorization', async () => {
      const updateData = {
        name: 'Updated Name'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users', () => {
    it('should get all users (admin endpoint)', async () => {
      // Create another user for testing
      const hashedPassword = await bcrypt.hash('password123', 10);
      await global.testPool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
        ['Another User', 'another@example.com', hashedPassword]
      );

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toHaveLength(2);
      expect(response.body.data.users[0]).toHaveProperty('id');
      expect(response.body.data.users[0]).toHaveProperty('name');
      expect(response.body.data.users[0]).toHaveProperty('email');
      expect(response.body.data.users[0]).not.toHaveProperty('password_hash');
    });

    it('should fail without authorization', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user successfully', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify user is deleted
      const checkUser = await global.testPool.query(
        'SELECT * FROM users WHERE id = $1',
        [testUser.id]
      );
      expect(checkUser.rows).toHaveLength(0);
    });

    it('should fail to delete non-existent user', async () => {
      const response = await request(app)
        .delete('/api/users/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should fail without authorization', async () => {
      const response = await request(app)
        .delete(`/api/users/${testUser.id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
