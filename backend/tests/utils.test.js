const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../utils/jwt');

describe('JWT Utilities', () => {
  const testUserId = 123;
  const secret = process.env.JWT_SECRET || 'your-secret-key';

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(testUserId);
      
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
      
      // Verify the token contains correct user ID
      const decoded = jwt.verify(token, secret);
      expect(decoded.id).toBe(testUserId);
    });

    it('should generate tokens with expiration', () => {
      const token = generateToken(testUserId);
      const decoded = jwt.verify(token, secret);
      
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const token = generateToken(testUserId);
      const decoded = verifyToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(testUserId);
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = verifyToken(invalidToken);
      
      expect(decoded).toBeNull();
    });

    it('should return null for expired token', () => {
      const expiredToken = jwt.sign(
        { userId: testUserId },
        secret,
        { expiresIn: '-1h' }
      );
      
      const decoded = verifyToken(expiredToken);
      expect(decoded).toBeNull();
    });

    it('should return null for malformed token', () => {
      const malformedToken = 'not-a-jwt-token';
      const decoded = verifyToken(malformedToken);
      
      expect(decoded).toBeNull();
    });
  });
});
