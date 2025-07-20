const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 */
const generateToken = (payload) => {
  // Ensure payload is an object
  const tokenPayload = typeof payload === 'object' ? payload : { id: payload };
  
  return jwt.sign(tokenPayload, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null; // Return null instead of throwing error
  }
};

/**
 * Extract token from Authorization header
 */
const extractToken = (authHeader) => {
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

module.exports = {
  generateToken,
  verifyToken,
  extractToken,
};
