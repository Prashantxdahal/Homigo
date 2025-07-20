const request = require('supertest');
const createTestApp = require('./testApp');

const app = createTestApp();

describe('Health Check API', () => {
  it('should return server health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Server is healthy');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    
    // Verify timestamp is a valid ISO string
    expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    
    // Verify uptime is a number
    expect(typeof response.body.uptime).toBe('number');
    expect(response.body.uptime).toBeGreaterThanOrEqual(0);
  });

  it('should have correct response headers', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.headers['content-type']).toMatch(/json/);
  });
});
