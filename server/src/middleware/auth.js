const { verifyToken, extractToken } = require('../utils/auth');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Middleware to authenticate user using JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided',
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'User account is inactive',
      });
    }

    // Attach user to request object
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);

    return res.status(401).json({
      error: 'Authentication failed',
      message: error.message || 'Invalid or expired token',
    });
  }
};

/**
 * Middleware to check if user has specific role
 * @param {string[]} roles - Array of allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please authenticate first',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Authorization failed',
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);

      if (user && user.isActive) {
        req.user = user;
        req.userId = user._id;
      }
    }

    next();
  } catch (error) {
    // Don't fail, just continue without user
    logger.warn('Optional auth failed:', error.message);
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
};
