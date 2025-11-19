// Custom Cypress commands

/**
 * Login command
 * @example cy.login('test@example.com', 'password123')
 */
Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL') || 'http://localhost:5000'}/api/auth/login`,
    body: {
      email,
      password,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    const { token } = response.body;

    // Store token in localStorage
    window.localStorage.setItem('authToken', token);

    // Set token in cookies for subsequent requests
    cy.setCookie('authToken', token);
  });
});

/**
 * Logout command
 * @example cy.logout()
 */
Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('authToken');
  cy.clearCookie('authToken');
});

/**
 * Register a new user
 * @example cy.register('testuser', 'test@example.com', 'password123')
 */
Cypress.Commands.add('register', (username, email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL') || 'http://localhost:5000'}/api/auth/register`,
    body: {
      username,
      email,
      password,
    },
  }).then((response) => {
    expect(response.status).to.eq(201);
    const { token } = response.body;

    // Store token in localStorage
    window.localStorage.setItem('authToken', token);
  });
});

/**
 * Check if user is logged in
 * @example cy.isLoggedIn().should('be.true')
 */
Cypress.Commands.add('isLoggedIn', () => {
  return cy.window().then((win) => {
    return !!win.localStorage.getItem('authToken');
  });
});

/**
 * Get auth token from localStorage
 * @example cy.getAuthToken().then(token => {...})
 */
Cypress.Commands.add('getAuthToken', () => {
  return cy.window().then((win) => {
    return win.localStorage.getItem('authToken');
  });
});

/**
 * Make authenticated API request
 * @example cy.apiRequest('GET', '/api/posts')
 */
Cypress.Commands.add('apiRequest', (method, url, body = null) => {
  return cy.getAuthToken().then((token) => {
    const options = {
      method,
      url: `${Cypress.env('API_URL') || 'http://localhost:5000'}${url}`,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };

    if (body) {
      options.body = body;
    }

    return cy.request(options);
  });
});

/**
 * Fill and submit a form
 * @example cy.fillForm({ email: 'test@example.com', password: 'password123' })
 */
Cypress.Commands.add('fillForm', (formData) => {
  Object.keys(formData).forEach((key) => {
    cy.get(`[name="${key}"]`).clear().type(formData[key]);
  });
});

/**
 * Check for toast notification
 * @example cy.checkToast('Success message')
 */
Cypress.Commands.add('checkToast', (message) => {
  cy.contains(message).should('be.visible');
});

/**
 * Wait for page to load
 * @example cy.waitForPageLoad()
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.window().should('have.property', 'document');
  cy.document().its('readyState').should('eq', 'complete');
});
