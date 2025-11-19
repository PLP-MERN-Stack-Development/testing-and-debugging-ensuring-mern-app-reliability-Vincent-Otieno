// Test setup file for server-side tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '1d';

// Increase test timeout for database operations
jest.setTimeout(30000);

// Global test utilities
global.testUtils = {
  // Add any global test utilities here
};

// Mock console methods to reduce noise in test output (optional)
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warn: jest.fn(),
// };
