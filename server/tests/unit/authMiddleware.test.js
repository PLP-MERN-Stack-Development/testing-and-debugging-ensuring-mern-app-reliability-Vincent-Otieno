const { authenticate, authorize, optionalAuth } = require('../../src/middleware/auth');
const { generateToken } = require('../../src/utils/auth');
const User = require('../../src/models/User');

// Mock User model
jest.mock('../../src/models/User');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      user: null,
      userId: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    const testUser = {
      _id: '507f1f77bcf86cd799439011',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
      isActive: true,
    };

    it('should authenticate user with valid token', async () => {
      const token = generateToken(testUser);
      req.headers.authorization = `Bearer ${token}`;

      User.findById = jest.fn().mockResolvedValue(testUser);

      await authenticate(req, res, next);

      expect(User.findById).toHaveBeenCalledWith(testUser._id);
      expect(req.user).toEqual(testUser);
      expect(req.userId).toBe(testUser._id);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject request without token', async () => {
      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Authentication required',
        message: 'No token provided',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', async () => {
      req.headers.authorization = 'Bearer invalid-token';

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Authentication failed',
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject if user not found', async () => {
      const token = generateToken(testUser);
      req.headers.authorization = `Bearer ${token}`;

      User.findById = jest.fn().mockResolvedValue(null);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Authentication failed',
        message: 'User not found',
      });
    });

    it('should reject if user account is inactive', async () => {
      const token = generateToken(testUser);
      req.headers.authorization = `Bearer ${token}`;

      User.findById = jest.fn().mockResolvedValue({
        ...testUser,
        isActive: false,
      });

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Authentication failed',
        message: 'User account is inactive',
      });
    });
  });

  describe('authorize', () => {
    it('should allow access for authorized role', () => {
      req.user = { role: 'admin' };
      const middleware = authorize('admin', 'moderator');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access for unauthorized role', () => {
      req.user = { role: 'user' };
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Authorization failed',
        message: 'You do not have permission to perform this action',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access if user is not authenticated', () => {
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Authentication required',
        message: 'Please authenticate first',
      });
    });

    it('should accept multiple roles', () => {
      req.user = { role: 'moderator' };
      const middleware = authorize('admin', 'moderator', 'editor');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    const testUser = {
      _id: '507f1f77bcf86cd799439011',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
      isActive: true,
    };

    it('should attach user if valid token provided', async () => {
      const token = generateToken(testUser);
      req.headers.authorization = `Bearer ${token}`;

      User.findById = jest.fn().mockResolvedValue(testUser);

      await optionalAuth(req, res, next);

      expect(req.user).toEqual(testUser);
      expect(req.userId).toBe(testUser._id);
      expect(next).toHaveBeenCalled();
    });

    it('should continue without user if no token provided', async () => {
      await optionalAuth(req, res, next);

      expect(req.user).toBeNull();
      expect(req.userId).toBeNull();
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should continue without user if invalid token provided', async () => {
      req.headers.authorization = 'Bearer invalid-token';

      await optionalAuth(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
    });

    it('should not attach inactive user', async () => {
      const token = generateToken(testUser);
      req.headers.authorization = `Bearer ${token}`;

      User.findById = jest.fn().mockResolvedValue({
        ...testUser,
        isActive: false,
      });

      await optionalAuth(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
    });
  });
});
