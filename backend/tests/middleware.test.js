const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');

describe('Authentication Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should authenticate valid token', async () => {
    const userId = 1;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key');
    req.headers.authorization = `Bearer ${token}`;

    await authenticateToken(req, res, next);

    expect(req.userId).toBe(userId);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should reject request without token', async () => {
    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Access token is required'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject request with invalid token format', async () => {
    req.headers.authorization = 'InvalidTokenFormat';

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Access token is required'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject request with invalid token', async () => {
    req.headers.authorization = 'Bearer invalid-token';

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid or expired token'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject expired token', async () => {
    const userId = 1;
    const expiredToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '-1h' } // Expired 1 hour ago
    );
    req.headers.authorization = `Bearer ${expiredToken}`;

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid or expired token'
    });
    expect(next).not.toHaveBeenCalled();
  });
});
