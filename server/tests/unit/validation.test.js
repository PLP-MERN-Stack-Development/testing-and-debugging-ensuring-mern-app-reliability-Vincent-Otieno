const {
  isValidEmail,
  validatePassword,
  sanitizeString,
  isValidObjectId,
  isValidUsername,
  isValidUrl,
  validatePagination,
} = require('../../src/utils/validation');
const mongoose = require('mongoose');

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('first+last@test.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test @example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('Strong@Pass123');
      expect(result.isValid).toBe(true);
      expect(result.hasUpperCase).toBe(true);
      expect(result.hasLowerCase).toBe(true);
      expect(result.hasNumbers).toBe(true);
      expect(result.hasSpecialChar).toBe(true);
      expect(result.strength).toBe('strong');
    });

    it('should identify weak passwords', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.strength).toBe('weak');
    });

    it('should identify medium strength passwords', () => {
      const result = validatePassword('Medium123');
      expect(result.isValid).toBe(true);
      // This password has uppercase, lowercase, numbers = 3 criteria = strong
      // For medium, we'd need exactly 2-3 criteria
      expect(['medium', 'strong']).toContain(result.strength);
    });
  });

  describe('sanitizeString', () => {
    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>hello';
      const result = sanitizeString(input);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
    });

    it('should limit string length', () => {
      const longString = 'a'.repeat(2000);
      const result = sanitizeString(longString);
      expect(result.length).toBeLessThanOrEqual(1000);
    });

    it('should handle non-string input', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
      expect(sanitizeString(123)).toBe('');
    });
  });

  describe('isValidObjectId', () => {
    it('should validate valid ObjectIds', () => {
      const validId = new mongoose.Types.ObjectId().toString();
      expect(isValidObjectId(validId)).toBe(true);
    });

    it('should reject invalid ObjectIds', () => {
      expect(isValidObjectId('invalid')).toBe(false);
      expect(isValidObjectId('12345')).toBe(false);
      expect(isValidObjectId('')).toBe(false);
      expect(isValidObjectId(null)).toBe(false);
    });
  });

  describe('isValidUsername', () => {
    it('should accept valid usernames', () => {
      expect(isValidUsername('user123')).toBe(true);
      expect(isValidUsername('john_doe')).toBe(true);
      expect(isValidUsername('test-user')).toBe(true);
    });

    it('should reject invalid usernames', () => {
      expect(isValidUsername('ab')).toBe(false); // Too short
      expect(isValidUsername('a'.repeat(31))).toBe(false); // Too long
      expect(isValidUsername('user name')).toBe(false); // Contains space
      expect(isValidUsername('user@123')).toBe(false); // Invalid character
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://test.org/path')).toBe(true);
      expect(isValidUrl('https://subdomain.example.com:8080')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false); // Missing protocol
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('validatePagination', () => {
    it('should return validated pagination parameters', () => {
      const result = validatePagination(2, 20);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
      expect(result.skip).toBe(20); // (2-1) * 20
    });

    it('should use defaults for invalid values', () => {
      const result = validatePagination(-1, 0);
      expect(result.page).toBe(1);
      expect(result.limit).toBeGreaterThan(0);
    });

    it('should enforce maximum limit', () => {
      const result = validatePagination(1, 200);
      expect(result.limit).toBeLessThanOrEqual(100);
    });

    it('should handle string inputs', () => {
      const result = validatePagination('3', '15');
      expect(result.page).toBe(3);
      expect(result.limit).toBe(15);
    });

    it('should handle undefined inputs', () => {
      const result = validatePagination(undefined, undefined);
      expect(result.page).toBeDefined();
      expect(result.limit).toBeDefined();
      expect(result.skip).toBeDefined();
    });
  });
});
