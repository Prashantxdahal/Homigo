# Homigo Backend Test Suite

This directory contains comprehensive tests for the Homigo Node.js Express application using Jest and Supertest.

## Test Structure

```
tests/
├── setup.js              # Test setup and database configuration
├── testApp.js            # Test application factory
├── auth.test.js          # Authentication API tests
├── users.test.js         # Users API tests
├── listings.test.js      # Listings API tests
├── bookings.test.js      # Bookings API tests
├── middleware.test.js    # Middleware tests
├── utils.test.js         # Utility function tests
├── integration.test.js   # End-to-end integration tests
├── health.test.js        # Health check tests
└── runTests.js          # Test runner script
```

## Prerequisites

1. **Test Database**: Create a separate test database to avoid affecting development data:
   ```sql
   CREATE DATABASE homigo_test;
   ```

2. **Environment Variables**: Copy `.env.test.example` to your `.env` file and update with your test database credentials.

## Running Tests

### All Tests
```bash
npm test
```

### With Coverage Report
```bash
npm run test:coverage
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### Specific Test Suites
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Health check tests only
npm run test:health
```

### Individual Test Files
```bash
# Authentication tests
npx jest auth.test.js

# Listings tests
npx jest listings.test.js

# Bookings tests
npx jest bookings.test.js
```

## Test Coverage

The test suite covers:

### Authentication (`auth.test.js`)
- ✅ User registration with validation
- ✅ User login with credentials
- ✅ Password validation
- ✅ Email format validation
- ✅ Duplicate email handling
- ✅ Token generation and validation
- ✅ Logout functionality

### Users API (`users.test.js`)
- ✅ Get user profile
- ✅ Update user profile
- ✅ User listing retrieval
- ✅ User deletion
- ✅ Authorization validation
- ✅ Input validation

### Listings API (`listings.test.js`)
- ✅ Create new listings
- ✅ Retrieve all listings
- ✅ Get specific listing
- ✅ Update listings
- ✅ Delete listings
- ✅ Filter by location and price
- ✅ Host-specific listings
- ✅ Authorization checks

### Bookings API (`bookings.test.js`)
- ✅ Create bookings
- ✅ Date validation
- ✅ User and host booking retrieval
- ✅ Booking status updates
- ✅ Booking deletion
- ✅ Date range validation
- ✅ Authorization checks

### Middleware (`middleware.test.js`)
- ✅ JWT token authentication
- ✅ Token validation
- ✅ Authorization header parsing
- ✅ Error handling

### Utilities (`utils.test.js`)
- ✅ JWT token generation
- ✅ JWT token verification
- ✅ Token expiration handling

### Integration (`integration.test.js`)
- ✅ Complete user journey flow
- ✅ Register → Login → Profile → Listing → Booking → Cleanup
- ✅ Error scenario handling
- ✅ Cross-feature interactions

### Health Check (`health.test.js`)
- ✅ Server health status
- ✅ Response format validation
- ✅ Uptime reporting

## Test Features

### Database Management
- **Isolated Tests**: Each test runs with a clean database state
- **Automatic Cleanup**: Database is cleaned before each test
- **Test Data**: Realistic test data for comprehensive testing

### Authentication Testing
- **Token Management**: Automatic JWT token generation for authenticated requests
- **Authorization Testing**: Comprehensive authorization scenario coverage
- **Security Validation**: Password hashing and validation testing

### API Testing
- **HTTP Status Codes**: Proper status code validation
- **Response Structure**: JSON response format validation
- **Error Handling**: Comprehensive error scenario testing
- **Input Validation**: Request payload validation testing

### Performance Testing
- **Response Times**: Implicit performance testing through timeouts
- **Memory Management**: Database connection pooling testing
- **Concurrent Requests**: Multiple simultaneous request handling

## Writing New Tests

### Test Structure Example
```javascript
describe('Feature Name', () => {
  let testData;

  beforeEach(async () => {
    // Setup test data
    testData = await createTestData();
  });

  describe('Specific Endpoint', () => {
    it('should handle success case', async () => {
      const response = await request(app)
        .post('/api/endpoint')
        .send(validData)
        .expect(200);

      expect(response.body.success).toBe(true);
      // Additional assertions
    });

    it('should handle error case', async () => {
      const response = await request(app)
        .post('/api/endpoint')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('error message');
    });
  });
});
```

### Best Practices
1. **Descriptive Test Names**: Use clear, descriptive test names
2. **Arrange-Act-Assert**: Follow AAA pattern in tests
3. **Test Data Isolation**: Each test should be independent
4. **Error Testing**: Test both success and failure scenarios
5. **Edge Cases**: Include boundary and edge case testing

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    npm install
    npm run test:coverage
  env:
    NODE_ENV: test
    TEST_DB_NAME: homigo_test
    TEST_DB_HOST: localhost
    TEST_DB_USER: postgres
    TEST_DB_PASSWORD: postgres
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure test database exists and credentials are correct
2. **Port Conflicts**: Make sure test ports are available
3. **Environment Variables**: Verify all required environment variables are set
4. **Dependencies**: Run `npm install` to ensure all test dependencies are installed

### Debug Mode
```bash
# Run tests with debug output
DEBUG=* npm test

# Run specific test with verbose output
npx jest --verbose auth.test.js
```

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all existing tests pass
3. Add tests for both success and error cases
4. Update this documentation if needed
5. Maintain test coverage above 80%
