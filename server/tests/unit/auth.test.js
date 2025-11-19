const {
  generateToken,
  verifyToken,
  extractToken,
  hashPassword,
  comparePassword,
} = require('../../src/utils/auth');

describe('Auth Utilities', () => {
  const testUser = {
    _id: '507f1f77bcf86cd799439011',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
  };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(testUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should include user information in token payload', () => {
      const token = generateToken(testUser);
      const decoded = verifyToken(token);

      expect(decoded.id).toBe(testUser._id);
      expect(decoded.username).toBe(testUser.username);
      expect(decoded.email).toBe(testUser.email);
      expect(decoded.role).toBe(testUser.role);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = generateToken(testUser);
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(testUser._id);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyToken('invalid.token.here');
      }).toThrow();
    });

    it('should throw error for malformed token', () => {
      expect(() => {
        verifyToken('not-a-token');
      }).toThrow();
    });
  });

  describe('extractToken', () => {
    it('should extract token from Bearer authorization header', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      const authHeader = `Bearer ${token}`;

      expect(extractToken(authHeader)).toBe(token);
    });

    it('should return null for missing authorization header', () => {
      expect(extractToken(null)).toBeNull();
      expect(extractToken(undefined)).toBeNull();
    });

    it('should return null for malformed authorization header', () => {
      expect(extractToken('InvalidFormat')).toBeNull();
      expect(extractToken('Basic token123')).toBeNull();
    });

    it('should return null for empty bearer token', () => {
      expect(extractToken('Bearer')).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2); // Due to salt
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(password, hash);

      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(wrongPassword, hash);

      expect(isMatch).toBe(false);
    });
  });
});
