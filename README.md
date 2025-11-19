# Testing and Debugging MERN Applications ✅

This project demonstrates comprehensive testing strategies for a MERN stack application, including unit testing, integration testing, end-to-end testing, and debugging techniques.

## 🎯 Project Overview

A fully-tested MERN (MongoDB, Express, React, Node.js) application featuring:
- ✅ Complete unit test coverage (>70%)
- ✅ Integration tests for all API endpoints
- ✅ End-to-end tests for critical user flows
- ✅ Error boundaries and global error handling
- ✅ Comprehensive logging strategy
- ✅ Production-ready debugging tools

## 📂 Project Structure

```
mern-testing/
├── client/                      # React front-end
│   ├── src/
│   │   ├── components/          # React components (Button, Input, ErrorBoundary)
│   │   ├── hooks/               # Custom hooks (useForm, useFetch, useLocalStorage)
│   │   ├── utils/               # Utility functions (validation, formatting)
│   │   └── tests/
│   │       ├── unit/            # Unit tests for components, hooks, utils
│   │       └── __mocks__/       # Mock files
│   ├── cypress/                 # E2E tests
│   │   ├── e2e/                 # Test specs (auth.cy.js, posts.cy.js)
│   │   └── support/             # Custom commands
│   ├── package.json
│   └── cypress.config.js
├── server/                      # Express.js back-end
│   ├── src/
│   │   ├── controllers/         # Route controllers (auth, posts)
│   │   ├── models/              # Mongoose models (User, Post, Category)
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Auth, error handling, validation
│   │   ├── utils/               # Utilities (auth, validation, logger)
│   │   ├── config/              # Database configuration
│   │   ├── app.js               # Express app setup
│   │   └── server.js            # Server entry point
│   ├── tests/
│   │   ├── unit/                # Unit tests for utils and middleware
│   │   ├── integration/         # API integration tests
│   │   └── setup.js             # Test setup
│   ├── scripts/                 # Setup scripts
│   ├── logs/                    # Application logs (auto-generated)
│   ├── package.json
│   └── .env                     # Environment variables
├── jest.config.js               # Jest configuration
├── .babelrc                     # Babel configuration
├── .gitignore
├── package.json                 # Root package.json
├── TESTING_STRATEGY.md          # Detailed testing documentation
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd testing-and-debugging-ensuring-mern-app-reliability-Vincent-Otieno
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```
   This will install dependencies for root, client, and server.

3. **Set up environment variables**
   ```bash
   # Server environment variables are in server/.env
   # Update MongoDB URI and JWT secret as needed
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod

   # Or use MongoDB Atlas connection string in server/.env
   ```

5. **Run the application**
   ```bash
   # Development mode (both client and server)
   npm run dev

   # Or run separately:
   npm run server  # Server on http://localhost:5000
   npm run client  # Client on http://localhost:3000
   ```

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run Integration Tests Only
```bash
npm run test:integration
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm test -- --coverage

# View HTML coverage report
open coverage/index.html
```

## 📊 Test Coverage

Our comprehensive test suite achieves **>70% code coverage** across all layers:

### Unit Tests ✅
- **Client Components:** Button, Input, ErrorBoundary (~95% coverage)
- **Client Utilities:** Validation, Formatting (100% coverage)
- **Custom Hooks:** useForm, useLocalStorage, useFetch (~97% coverage)
- **Server Utilities:** Auth, Validation, Logger (100% coverage)
- **Server Middleware:** Authentication, Authorization (100% coverage)

### Integration Tests ✅
- **Authentication API:** Register, Login, Profile, Password Change
- **Posts API:** CRUD operations, Pagination, Filtering
- **Database Operations:** Using MongoDB Memory Server
- **Error Handling:** Validation, Authorization, Not Found

### End-to-End Tests ✅
- **Authentication Flow:** Registration, Login, Logout, Protected Routes
- **Posts Management:** Create, Read, Update, Delete
- **User Interactions:** Like posts, Add comments
- **Navigation:** Between pages and routes

## 🛠️ Debugging Features

### Server-Side Debugging
1. **Winston Logger** - Structured logging with file rotation
   - Error logs: `server/logs/error.log`
   - Combined logs: `server/logs/combined.log`
   - Exception logs: `server/logs/exceptions.log`

2. **Global Error Handler**
   - Centralized error handling
   - Custom API errors
   - Mongoose error handling
   - JWT error handling

3. **Request Logging**
   - Morgan HTTP logger
   - Request timing and status

### Client-Side Debugging
1. **Error Boundaries** - Catches React component errors
2. **Development Mode** - Detailed error stack traces
3. **Browser DevTools** - React DevTools integration

## 📖 Testing Strategy

For detailed information about our testing approach, see [TESTING_STRATEGY.md](./TESTING_STRATEGY.md).

Key highlights:
- **Testing Pyramid Approach** - Many unit tests, some integration tests, few E2E tests
- **TDD Practices** - Test-driven development where applicable
- **Mocking Strategy** - Appropriate use of mocks and stubs
- **CI/CD Ready** - All tests can run in automated pipelines

## 🏗️ Technology Stack

### Frontend
- React 18
- React Testing Library
- Cypress
- Jest

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Supertest
- MongoDB Memory Server

### Testing & Quality
- Jest (Unit & Integration)
- React Testing Library
- Cypress (E2E)
- Supertest (API Testing)
- Winston (Logging)

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/password` - Change password (protected)

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/like` - Like/unlike post (protected)
- `POST /api/posts/:id/comments` - Add comment (protected)

## 🔧 Development Scripts

```bash
# Install all dependencies
npm run install-all

# Development
npm run dev          # Run both client and server
npm run client       # Run client only
npm run server       # Run server only

# Testing
npm test             # Run all tests with coverage
npm run test:unit    # Run unit tests
npm run test:integration  # Run integration tests
npm run test:e2e     # Run E2E tests
npm run test:watch   # Run tests in watch mode

# Build
npm run build        # Build client for production

# Database
npm run setup-test-db  # Set up test database
```

## 🎓 Learning Outcomes

This project demonstrates:
1. ✅ Comprehensive unit testing with Jest
2. ✅ React component testing with Testing Library
3. ✅ Custom hooks testing with renderHook
4. ✅ API integration testing with Supertest
5. ✅ E2E testing with Cypress
6. ✅ Error handling and debugging strategies
7. ✅ Logging and monitoring implementation
8. ✅ Test-driven development practices
9. ✅ Code coverage analysis
10. ✅ CI/CD pipeline compatibility

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Winston Logger](https://github.com/winstonjs/winston)

## 🤝 Contributing

This is an educational project for Week 6 assignment. For improvements or bug fixes:
1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is part of an educational assignment.

## ✨ Assignment Completion

- [x] Task 1: Setting Up Testing Environment
- [x] Task 2: Unit Testing (>70% coverage)
- [x] Task 3: Integration Testing
- [x] Task 4: End-to-End Testing
- [x] Task 5: Debugging Techniques
- [x] Documentation and README
- [x] Code Coverage Reports

**Status:** ✅ Complete and Ready for Submission 