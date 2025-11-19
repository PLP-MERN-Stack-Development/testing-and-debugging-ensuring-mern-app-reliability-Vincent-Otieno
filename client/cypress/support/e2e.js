// Cypress E2E support file

// Import commands
import './commands';

// Hide fetch/XHR requests from command log
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Preserve cookies between tests
beforeEach(() => {
  cy.intercept('*').as('allRequests');
});

// Add custom error handler
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false prevents Cypress from failing the test
  // You can customize this based on your needs
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  return true;
});
