const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'your-secret-key',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Extract token from authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */
const extractToken = (authHeader) => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');

  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }

  return null;
};

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
const comparePassword = async (password, hash) => {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(password, hash);
};

module.exports = {
  generateToken,
  verifyToken,
  extractToken,
  hashPassword,
  comparePassword,
};
