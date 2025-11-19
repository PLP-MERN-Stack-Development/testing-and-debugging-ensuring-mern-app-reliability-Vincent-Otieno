/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password
 * @returns {Object} Validation result
 */
const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const result = {
    isValid: password.length >= minLength,
    length: password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
    strength: 'weak',
  };

  // Calculate strength
  let strengthScore = 0;
  if (result.length) strengthScore++;
  if (hasUpperCase) strengthScore++;
  if (hasLowerCase) strengthScore++;
  if (hasNumbers) strengthScore++;
  if (hasSpecialChar) strengthScore++;

  if (strengthScore >= 4) {
    result.strength = 'strong';
  } else if (strengthScore >= 2) {
    result.strength = 'medium';
  }

  return result;
};

/**
 * Sanitize string input
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId
 */
const isValidObjectId = (id) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Validate username format
 * @param {string} username - Username
 * @returns {boolean} True if valid
 */
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
};

/**
 * Validate URL format
 * @param {string} url - URL
 * @returns {boolean} True if valid
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validate pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Validated parameters
 */
const validatePagination = (page, limit) => {
  const validatedPage = Math.max(1, parseInt(page) || 1);
  const validatedLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));

  return {
    page: validatedPage,
    limit: validatedLimit,
    skip: (validatedPage - 1) * validatedLimit,
  };
};

module.exports = {
  isValidEmail,
  validatePassword,
  sanitizeString,
  isValidObjectId,
  isValidUsername,
  isValidUrl,
  validatePagination,
};
