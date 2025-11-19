/**
 * Client-side validation utilities
 */

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
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
 * Validate required field
 * @param {any} value - Field value
 * @returns {boolean} True if not empty
 */
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validate minimum length
 * @param {string} value - String value
 * @param {number} min - Minimum length
 * @returns {boolean} True if meets minimum
 */
export const minLength = (value, min) => {
  return typeof value === 'string' && value.length >= min;
};

/**
 * Validate maximum length
 * @param {string} value - String value
 * @param {number} max - Maximum length
 * @returns {boolean} True if within maximum
 */
export const maxLength = (value, max) => {
  return typeof value === 'string' && value.length <= max;
};

/**
 * Validate username format
 * @param {string} username - Username
 * @returns {boolean} True if valid
 */
export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
};

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - HTML string
 * @returns {string} Sanitized string
 */
export const sanitizeHtml = (html) => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Validate form fields
 * @param {Object} values - Form values
 * @param {Object} rules - Validation rules
 * @returns {Object} Errors object
 */
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = values[field];

    fieldRules.forEach((rule) => {
      if (rule.required && !isRequired(value)) {
        errors[field] = rule.message || `${field} is required`;
      }

      if (rule.minLength && !minLength(value, rule.minLength)) {
        errors[field] = rule.message || `${field} must be at least ${rule.minLength} characters`;
      }

      if (rule.maxLength && !maxLength(value, rule.maxLength)) {
        errors[field] = rule.message || `${field} must be at most ${rule.maxLength} characters`;
      }

      if (rule.email && !isValidEmail(value)) {
        errors[field] = rule.message || 'Invalid email address';
      }

      if (rule.username && !isValidUsername(value)) {
        errors[field] = rule.message || 'Invalid username format';
      }

      if (rule.custom && !rule.custom(value, values)) {
        errors[field] = rule.message || 'Validation failed';
      }
    });
  });

  return errors;
};
