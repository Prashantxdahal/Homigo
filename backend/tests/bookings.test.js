const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createTestApp = require('./testApp');

const app = createTestApp();

describe('Bookings API', () => {
  let testUser;
  let hostUser;
  let authToken;
  let hostToken;
  let testListing;
  let testBooking;

  beforeEach(async () => {
    // Create a test guest user
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    const userResult = await global.testPool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      ['Test Guest', 'guest@example.com', hashedPassword]
    );
    testUser = userResult.rows[0];

    // Create a test host user
    const hostResult = await global.testPool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      ['Test Host', 'host@example.com', hashedPassword]
    );
    hostUser = hostResult.rows[0];

    // Generate auth tokens
    authToken = jwt.sign(
      { userId: testUser.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    hostToken = jwt.sign(
      { userId: hostUser.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Create a test listing
    const listingResult = await global.testPool.query(
      `INSERT INTO listings (title, description, location, price, host_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      ['Test Property', 'A beautiful test property', 'Test City', 100.00, hostUser.id]
    );
    testListing = listingResult.rows[0];

    // Create a test booking
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);

    const bookingResult = await global.testPool.query(
      `INSERT INTO bookings (user_id, listing_id, host_id, booking_date, check_in_date, check_out_date, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        testUser.id,
        testListing.id,
        hostUser.id,
        new Date().toISOString().split('T')[0],
        tomorrow.toISOString().split('T')[0],
        dayAfterTomorrow.toISOString().split('T')[0],
        'confirmed'
      ]
    );
    testBooking = bookingResult.rows[0];
  });

  describe('POST /api/bookings', () => {
    it('should create a new booking successfully', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 5);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 7);

      const newBooking = {
        listing_id: testListing.id,
        booking_date: new Date().toISOString().split('T')[0],
        check_in_date: tomorrow.toISOString().split('T')[0],
        check_out_date: dayAfter.toISOString().split('T')[0]
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newBooking)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Booking created successfully');
      expect(response.body.data.booking).toHaveProperty('id');
      expect(response.body.data.booking.user_id).toBe(testUser.id);
      expect(response.body.data.booking.listing_id).toBe(testListing.id);
      expect(response.body.data.booking.host_id).toBe(hostUser.id);
      expect(response.body.data.booking.status).toBe('confirmed');
    });

    it('should fail with missing required fields', async () => {
      const incompleteBooking = {
        listing_id: testListing.id
        // Missing dates
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(incompleteBooking)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should fail with invalid date range', async () => {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const invalidBooking = {
        listing_id: testListing.id,
        booking_date: today.toISOString().split('T')[0],
        check_in_date: today.toISOString().split('T')[0],
        check_out_date: yesterday.toISOString().split('T')[0] // Check-out before check-in
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidBooking)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('after');
    });

    it('should fail with past check-in date', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const today = new Date();

      const pastBooking = {
        listing_id: testListing.id,
        booking_date: today.toISOString().split('T')[0],
        check_in_date: yesterday.toISOString().split('T')[0],
        check_out_date: today.toISOString().split('T')[0]
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pastBooking)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('past');
    });

    it('should fail without authorization', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 3);

      const newBooking = {
        listing_id: testListing.id,
        booking_date: new Date().toISOString().split('T')[0],
        check_in_date: tomorrow.toISOString().split('T')[0],
        check_out_date: dayAfter.toISOString().split('T')[0]
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(newBooking)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/bookings/user', () => {
    it('should get user bookings', async () => {
      const response = await request(app)
        .get('/api/bookings/user')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookings).toHaveLength(1);
      expect(response.body.data.bookings[0]).toHaveProperty('id');
      expect(response.body.data.bookings[0].user_id).toBe(testUser.id);
    });

    it('should fail without authorization', async () => {
      const response = await request(app)
        .get('/api/bookings/user')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/bookings/host', () => {
    it('should get host bookings', async () => {
      const response = await request(app)
        .get('/api/bookings/host')
        .set('Authorization', `Bearer ${hostToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookings).toHaveLength(1);
      expect(response.body.data.bookings[0]).toHaveProperty('id');
      expect(response.body.data.bookings[0].host_id).toBe(hostUser.id);
    });

    it('should return empty array for host with no bookings', async () => {
      const response = await request(app)
        .get('/api/bookings/host')
        .set('Authorization', `Bearer ${authToken}`) // Using guest token
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookings).toHaveLength(0);
    });

    it('should fail without authorization', async () => {
      const response = await request(app)
        .get('/api/bookings/host')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/bookings', () => {
    it('should get all bookings', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookings).toHaveLength(1);
      expect(response.body.data.bookings[0]).toHaveProperty('id');
    });

    it('should fail without authorization', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/bookings/:id/status', () => {
    it('should update booking status successfully', async () => {
      const statusUpdate = {
        status: 'cancelled'
      };

      const response = await request(app)
        .put(`/api/bookings/${testBooking.id}/status`)
        .set('Authorization', `Bearer ${hostToken}`)
        .send(statusUpdate)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.booking.status).toBe('cancelled');
    });

    it('should fail with invalid status', async () => {
      const statusUpdate = {
        status: 'invalid-status'
      };

      const response = await request(app)
        .put(`/api/bookings/${testBooking.id}/status`)
        .set('Authorization', `Bearer ${hostToken}`)
        .send(statusUpdate)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid status');
    });

    it('should fail for non-existent booking', async () => {
      const statusUpdate = {
        status: 'cancelled'
      };

      const response = await request(app)
        .put('/api/bookings/99999/status')
        .set('Authorization', `Bearer ${hostToken}`)
        .send(statusUpdate)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should fail without authorization', async () => {
      const statusUpdate = {
        status: 'cancelled'
      };

      const response = await request(app)
        .put(`/api/bookings/${testBooking.id}/status`)
        .send(statusUpdate)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/bookings/:id', () => {
    it('should delete booking successfully', async () => {
      const response = await request(app)
        .delete(`/api/bookings/${testBooking.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify booking is deleted
      const checkBooking = await global.testPool.query(
        'SELECT * FROM bookings WHERE id = $1',
        [testBooking.id]
      );
      expect(checkBooking.rows).toHaveLength(0);
    });

    it('should fail to delete non-existent booking', async () => {
      const response = await request(app)
        .delete('/api/bookings/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should fail without authorization', async () => {
      const response = await request(app)
        .delete(`/api/bookings/${testBooking.id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
