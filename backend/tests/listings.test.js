const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createTestApp = require('./testApp');

const app = createTestApp();

describe('Listings API', () => {
  let testUser;
  let authToken;
  let testListing;

  beforeEach(async () => {
    // Create a test user
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    const userResult = await global.testPool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      ['Test Host', 'host@example.com', hashedPassword]
    );
    testUser = userResult.rows[0];

    // Generate auth token
    authToken = jwt.sign(
      { userId: testUser.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // Create a test listing
    const listingResult = await global.testPool.query(
      `INSERT INTO listings (title, description, location, price, host_id, images, amenities) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        'Test Property',
        'A beautiful test property',
        'Test City',
        100.00,
        testUser.id,
        JSON.stringify(['image1.jpg']),
        JSON.stringify(['wifi', 'parking'])
      ]
    );
    testListing = listingResult.rows[0];
  });

  describe('POST /api/listings', () => {
    it('should create a new listing successfully', async () => {
      const newListing = {
        title: 'Amazing Villa',
        description: 'A stunning villa with ocean view',
        location: 'Beach City',
        price: 250,
        images: ['villa1.jpg', 'villa2.jpg'],
        amenities: ['wifi', 'pool', 'parking']
      };

      const response = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newListing)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Listing created successfully');
      expect(response.body.data.listing).toHaveProperty('id');
      expect(response.body.data.listing.title).toBe(newListing.title);
      expect(response.body.data.listing.description).toBe(newListing.description);
      expect(response.body.data.listing.location).toBe(newListing.location);
      expect(response.body.data.listing.price).toBe(newListing.price);
      expect(response.body.data.listing.host_id).toBe(testUser.id);
    });

    it('should fail with missing required fields', async () => {
      const incompleteListing = {
        title: 'Incomplete Listing'
        // Missing description, location, price
      };

      const response = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(incompleteListing)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should fail without authorization', async () => {
      const newListing = {
        title: 'Unauthorized Listing',
        description: 'This should fail',
        location: 'Nowhere',
        price: 100
      };

      const response = await request(app)
        .post('/api/listings')
        .send(newListing)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/listings', () => {
    it('should get all listings', async () => {
      const response = await request(app)
        .get('/api/listings')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.listings).toHaveLength(1);
      expect(response.body.data.listings[0]).toHaveProperty('id');
      expect(response.body.data.listings[0]).toHaveProperty('title');
      expect(response.body.data.listings[0]).toHaveProperty('description');
      expect(response.body.data.listings[0]).toHaveProperty('location');
      expect(response.body.data.listings[0]).toHaveProperty('price');
    });

    it('should filter listings by location', async () => {
      // Create another listing in different location
      await global.testPool.query(
        `INSERT INTO listings (title, description, location, price, host_id) 
         VALUES ($1, $2, $3, $4, $5)`,
        ['Another Property', 'Another description', 'Another City', 150.00, testUser.id]
      );

      const response = await request(app)
        .get('/api/listings?location=Test City')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.listings).toHaveLength(1);
      expect(response.body.data.listings[0].location).toBe('Test City');
    });

    it('should filter listings by price range', async () => {
      const response = await request(app)
        .get('/api/listings?minPrice=50&maxPrice=150')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.listings).toHaveLength(1);
      expect(response.body.data.listings[0].price).toBeGreaterThanOrEqual(50);
      expect(response.body.data.listings[0].price).toBeLessThanOrEqual(150);
    });
  });

  describe('GET /api/listings/:id', () => {
    it('should get a specific listing', async () => {
      const response = await request(app)
        .get(`/api/listings/${testListing.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.listing).toHaveProperty('id', testListing.id);
      expect(response.body.data.listing).toHaveProperty('title', 'Test Property');
    });

    it('should fail for non-existent listing', async () => {
      const response = await request(app)
        .get('/api/listings/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PUT /api/listings/:id', () => {
    it('should update listing successfully', async () => {
      const updateData = {
        title: 'Updated Property Title',
        description: 'Updated description',
        price: 200
      };

      const response = await request(app)
        .put(`/api/listings/${testListing.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.listing.title).toBe(updateData.title);
      expect(response.body.data.listing.description).toBe(updateData.description);
      expect(response.body.data.listing.price).toBe(updateData.price);
    });

    it('should fail to update non-existent listing', async () => {
      const updateData = {
        title: 'Updated Title'
      };

      const response = await request(app)
        .put('/api/listings/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should fail without authorization', async () => {
      const updateData = {
        title: 'Unauthorized Update'
      };

      const response = await request(app)
        .put(`/api/listings/${testListing.id}`)
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/listings/:id', () => {
    it('should delete listing successfully', async () => {
      const response = await request(app)
        .delete(`/api/listings/${testListing.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // Verify listing is deleted
      const checkListing = await global.testPool.query(
        'SELECT * FROM listings WHERE id = $1',
        [testListing.id]
      );
      expect(checkListing.rows).toHaveLength(0);
    });

    it('should fail to delete non-existent listing', async () => {
      const response = await request(app)
        .delete('/api/listings/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should fail without authorization', async () => {
      const response = await request(app)
        .delete(`/api/listings/${testListing.id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/listings/host/:hostId', () => {
    it('should get listings for a specific host', async () => {
      const response = await request(app)
        .get(`/api/listings/host/${testUser.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.listings).toHaveLength(1);
      expect(response.body.data.listings[0].host_id).toBe(testUser.id);
    });

    it('should return empty array for host with no listings', async () => {
      // Create another user
      const hashedPassword = await bcrypt.hash('password123', 10);
      const anotherUserResult = await global.testPool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        ['Another Host', 'another@example.com', hashedPassword]
      );
      const anotherUser = anotherUserResult.rows[0];

      const response = await request(app)
        .get(`/api/listings/host/${anotherUser.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.listings).toHaveLength(0);
    });
  });
});
