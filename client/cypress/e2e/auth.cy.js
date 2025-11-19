describe('Authentication E2E Tests', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    // Clear any existing auth state
    cy.clearLocalStorage();
    cy.clearCookies();

    // Visit home page
    cy.visit('/');
  });

  describe('User Registration', () => {
    it('should display registration form', () => {
      cy.visit('/register');

      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should register a new user successfully', () => {
      cy.visit('/register');

      // Fill out registration form
      cy.get('input[name="username"]').type(testUser.username);
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);

      // Submit form
      cy.get('button[type="submit"]').click();

      // Should redirect to dashboard or home
      cy.url().should('not.include', '/register');

      // Should be logged in
      cy.isLoggedIn().should('be.true');
    });

    it('should show validation errors for invalid input', () => {
      cy.visit('/register');

      // Submit empty form
      cy.get('button[type="submit"]').click();

      // Should show validation errors
      cy.contains(/required/i).should('be.visible');
    });

    it('should show error for duplicate email', () => {
      // Register user first
      cy.register(testUser.username, testUser.email, testUser.password);

      // Try to register again with same email
      cy.visit('/register');
      cy.get('input[name="username"]').type('anotheruser');
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('button[type="submit"]').click();

      // Should show error
      cy.contains(/already/i).should('be.visible');
    });

    it('should validate email format', () => {
      cy.visit('/register');

      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.contains(/email/i).should('be.visible');
    });

    it('should validate password minimum length', () => {
      cy.visit('/register');

      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('123');
      cy.get('button[type="submit"]').click();

      cy.contains(/password/i).should('be.visible');
    });
  });

  describe('User Login', () => {
    beforeEach(() => {
      // Register a test user before each login test
      cy.register(testUser.username, testUser.email, testUser.password);
      cy.logout();
    });

    it('should display login form', () => {
      cy.visit('/login');

      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should login successfully with correct credentials', () => {
      cy.visit('/login');

      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type(testUser.password);
      cy.get('button[type="submit"]').click();

      // Should redirect after login
      cy.url().should('not.include', '/login');

      // Should be logged in
      cy.isLoggedIn().should('be.true');
    });

    it('should show error for incorrect password', () => {
      cy.visit('/login');

      cy.get('input[name="email"]').type(testUser.email);
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      cy.contains(/invalid|incorrect/i).should('be.visible');
      cy.isLoggedIn().should('be.false');
    });

    it('should show error for non-existent user', () => {
      cy.visit('/login');

      cy.get('input[name="email"]').type('nonexistent@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.contains(/invalid|not found/i).should('be.visible');
    });

    it('should require both email and password', () => {
      cy.visit('/login');

      cy.get('button[type="submit"]').click();

      cy.contains(/required/i).should('be.visible');
    });
  });

  describe('User Logout', () => {
    beforeEach(() => {
      cy.register(testUser.username, testUser.email, testUser.password);
    });

    it('should logout successfully', () => {
      cy.visit('/');

      // Should be logged in
      cy.isLoggedIn().should('be.true');

      // Click logout button
      cy.get('[data-testid="logout-button"]').click();

      // Should be logged out
      cy.isLoggedIn().should('be.false');

      // Should redirect to home or login
      cy.url().should('match', /\/(login|home|$)/);
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to login when accessing protected route without auth', () => {
      cy.visit('/dashboard');

      // Should redirect to login
      cy.url().should('include', '/login');
    });

    it('should access protected route when authenticated', () => {
      cy.register(testUser.username, testUser.email, testUser.password);

      cy.visit('/dashboard');

      // Should stay on dashboard
      cy.url().should('include', '/dashboard');
    });
  });
});
