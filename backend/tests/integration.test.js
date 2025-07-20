const request = require('supertest');
const createTestApp = require('./testApp');

const app = createTestApp();

describe('Integration Tests - Complete User Flow', () => {
  let userData;
  let authToken;
  let listingId;
  let bookingId;

  it('should complete a full user journey', async () => {
    // 1. Register a new user
    userData = {
      name: 'Integration Test User',
      email: 'integration@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(registerResponse.body.success).toBe(true);
    expect(registerResponse.body.data).toHaveProperty('token');
    authToken = registerResponse.body.data.token;

    // 2. Login with the registered user
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      })
      .expect(200);

    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.data).toHaveProperty('token');

    // 3. Get user profile
    const profileResponse = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(profileResponse.body.success).toBe(true);
    expect(profileResponse.body.data.user.email).toBe(userData.email);

    // 4. Update user profile
    const updateData = {
      name: 'Updated Integration User',
      bio: 'This is my updated bio for integration testing'
    };

    const updateResponse = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData)
      .expect(200);

    expect(updateResponse.body.success).toBe(true);
    expect(updateResponse.body.data.user.name).toBe(updateData.name);
    expect(updateResponse.body.data.user.bio).toBe(updateData.bio);

    // 5. Create a listing
    const listingData = {
      title: 'Integration Test Property',
      description: 'A beautiful property for integration testing',
      location: 'Test City',
      price: 150,
      images: ['test1.jpg', 'test2.jpg'],
      amenities: ['wifi', 'parking', 'pool']
    };

    const listingResponse = await request(app)
      .post('/api/listings')
      .set('Authorization', `Bearer ${authToken}`)
      .send(listingData)
      .expect(201);

    expect(listingResponse.body.success).toBe(true);
    expect(listingResponse.body.data.listing.title).toBe(listingData.title);
    listingId = listingResponse.body.data.listing.id;

    // 6. Get all listings
    const listingsResponse = await request(app)
      .get('/api/listings')
      .expect(200);

    expect(listingsResponse.body.success).toBe(true);
    expect(listingsResponse.body.data.listings).toHaveLength(1);
    expect(listingsResponse.body.data.listings[0].id).toBe(listingId);

    // 7. Get specific listing
    const singleListingResponse = await request(app)
      .get(`/api/listings/${listingId}`)
      .expect(200);

    expect(singleListingResponse.body.success).toBe(true);
    expect(singleListingResponse.body.data.listing.id).toBe(listingId);

    // 8. Update the listing
    const listingUpdateData = {
      title: 'Updated Integration Test Property',
      price: 200
    };

    const listingUpdateResponse = await request(app)
      .put(`/api/listings/${listingId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(listingUpdateData)
      .expect(200);

    expect(listingUpdateResponse.body.success).toBe(true);
    expect(listingUpdateResponse.body.data.listing.title).toBe(listingUpdateData.title);
    expect(listingUpdateResponse.body.data.listing.price).toBe(listingUpdateData.price);

    // 9. Create a booking
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);

    const bookingData = {
      listing_id: listingId,
      booking_date: new Date().toISOString().split('T')[0],
      check_in_date: tomorrow.toISOString().split('T')[0],
      check_out_date: dayAfterTomorrow.toISOString().split('T')[0]
    };

    const bookingResponse = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${authToken}`)
      .send(bookingData)
      .expect(201);

    expect(bookingResponse.body.success).toBe(true);
    expect(bookingResponse.body.data.booking.listing_id).toBe(listingId);
    bookingId = bookingResponse.body.data.booking.id;

    // 10. Get user bookings
    const userBookingsResponse = await request(app)
      .get('/api/bookings/user')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(userBookingsResponse.body.success).toBe(true);
    expect(userBookingsResponse.body.data.bookings).toHaveLength(1);
    expect(userBookingsResponse.body.data.bookings[0].id).toBe(bookingId);

    // 11. Get host bookings
    const hostBookingsResponse = await request(app)
      .get('/api/bookings/host')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(hostBookingsResponse.body.success).toBe(true);
    expect(hostBookingsResponse.body.data.bookings).toHaveLength(1);

    // 12. Update booking status
    const statusUpdateResponse = await request(app)
      .put(`/api/bookings/${bookingId}/status`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'confirmed' })
      .expect(200);

    expect(statusUpdateResponse.body.success).toBe(true);
    expect(statusUpdateResponse.body.data.booking.status).toBe('confirmed');

    // 13. Get all bookings
    const allBookingsResponse = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(allBookingsResponse.body.success).toBe(true);
    expect(allBookingsResponse.body.data.bookings).toHaveLength(1);

    // 14. Delete booking
    const deleteBookingResponse = await request(app)
      .delete(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(deleteBookingResponse.body.success).toBe(true);

    // 15. Delete listing
    const deleteListingResponse = await request(app)
      .delete(`/api/listings/${listingId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(deleteListingResponse.body.success).toBe(true);

    // 16. Logout
    const logoutResponse = await request(app)
      .post('/api/auth/logout')
      .expect(200);

    expect(logoutResponse.body.success).toBe(true);
  });

  it('should handle error scenarios properly', async () => {
    // Test unauthorized access
    const unauthorizedResponse = await request(app)
      .get('/api/users/profile')
      .expect(401);

    expect(unauthorizedResponse.body.success).toBe(false);

    // Test accessing non-existent resource
    const notFoundResponse = await request(app)
      .get('/api/listings/99999')
      .expect(404);

    expect(notFoundResponse.body.success).toBe(false);

    // Test invalid data
    const invalidDataResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: '',
        email: 'invalid-email',
        password: '123' // Too short
      })
      .expect(400);

    expect(invalidDataResponse.body.success).toBe(false);
  });
});
