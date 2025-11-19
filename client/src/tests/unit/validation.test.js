import {
  isValidEmail,
  validatePassword,
  isRequired,
  minLength,
  maxLength,
  isValidUsername,
  sanitizeHtml,
  validateForm,
} from '../../utils/validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('first+last@test.org')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test @example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate password with all criteria', () => {
      const result = validatePassword('Strong@123');
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
      expect(result.strength).toBe('medium');
    });

    it('should require minimum length', () => {
      const result = validatePassword('Abc1');
      expect(result.isValid).toBe(false);
      expect(result.length).toBe(false);
    });
  });

  describe('isRequired', () => {
    it('should return true for non-empty values', () => {
      expect(isRequired('text')).toBe(true);
      expect(isRequired(123)).toBe(true);
      expect(isRequired(true)).toBe(true);
      expect(isRequired([])).toBe(true);
    });

    it('should return false for empty values', () => {
      expect(isRequired('')).toBe(false);
      expect(isRequired('   ')).toBe(false);
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });
  });

  describe('minLength', () => {
    it('should validate minimum length', () => {
      expect(minLength('hello', 3)).toBe(true);
      expect(minLength('hello', 5)).toBe(true);
      expect(minLength('hi', 3)).toBe(false);
    });
  });

  describe('maxLength', () => {
    it('should validate maximum length', () => {
      expect(maxLength('hello', 10)).toBe(true);
      expect(maxLength('hello', 5)).toBe(true);
      expect(maxLength('hello world', 5)).toBe(false);
    });
  });

  describe('isValidUsername', () => {
    it('should accept valid usernames', () => {
      expect(isValidUsername('user123')).toBe(true);
      expect(isValidUsername('john_doe')).toBe(true);
      expect(isValidUsername('test-user')).toBe(true);
      expect(isValidUsername('abc')).toBe(true);
    });

    it('should reject invalid usernames', () => {
      expect(isValidUsername('ab')).toBe(false); // Too short
      expect(isValidUsername('a'.repeat(31))).toBe(false); // Too long
      expect(isValidUsername('user name')).toBe(false); // Contains space
      expect(isValidUsername('user@123')).toBe(false); // Invalid character
    });
  });

  describe('sanitizeHtml', () => {
    it('should escape HTML tags', () => {
      const result = sanitizeHtml('<script>alert("xss")</script>');
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });

    it('should handle plain text', () => {
      expect(sanitizeHtml('plain text')).toBe('plain text');
    });
  });

  describe('validateForm', () => {
    it('should validate form with all rules passing', () => {
      const values = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'Strong@123',
      };

      const rules = {
        username: [{ required: true }, { username: true }],
        email: [{ required: true }, { email: true }],
        password: [{ required: true }, { minLength: 6 }],
      };

      const errors = validateForm(values, rules);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('should return errors for invalid fields', () => {
      const values = {
        username: 'ab',
        email: 'invalid',
        password: '123',
      };

      const rules = {
        username: [{ required: true }, { username: true }],
        email: [{ required: true }, { email: true }],
        password: [{ required: true }, { minLength: 6 }],
      };

      const errors = validateForm(values, rules);
      expect(errors.username).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.password).toBeDefined();
    });

    it('should validate required fields', () => {
      const values = {
        username: '',
      };

      const rules = {
        username: [{ required: true, message: 'Username is required' }],
      };

      const errors = validateForm(values, rules);
      expect(errors.username).toBe('Username is required');
    });
  });
});
