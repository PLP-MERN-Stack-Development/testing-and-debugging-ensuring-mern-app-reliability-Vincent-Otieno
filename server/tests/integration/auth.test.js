const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const User = require('../../src/models/User');

let mongoServer;

describe('Auth API Integration Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    const validUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.username).toBe(validUser.username);
      expect(res.body.user.email).toBe(validUser.email);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should reject registration with duplicate email', async () => {
      await User.create(validUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject registration with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUser,
          email: 'invalid-email',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject registration with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUser,
          password: '123',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject registration with short username', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUser,
          username: 'ab',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject registration without required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    beforeEach(async () => {
      await User.create(userData);
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(userData.email);
    });

    it('should reject login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject login without email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject login without password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/auth/me', () => {
    let token;
    let userId;

    beforeEach(async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      userId = user._id;

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      token = loginRes.body.token;
    });

    it('should get current user profile when authenticated', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe('test@example.com');
      expect(res.body.user.username).toBe('testuser');
    });

    it('should reject request without token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject request with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/auth/password', () => {
    let token;

    beforeEach(async () => {
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'oldpassword123',
      });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'oldpassword123',
        });

      token = loginRes.body.token;
    });

    it('should change password successfully', async () => {
      const res = await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'oldpassword123',
          newPassword: 'newpassword123',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');

      // Verify can login with new password
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'newpassword123',
        });

      expect(loginRes.status).toBe(200);
    });

    it('should reject with incorrect current password', async () => {
      const res = await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject without authentication', async () => {
      const res = await request(app)
        .put('/api/auth/password')
        .send({
          currentPassword: 'oldpassword123',
          newPassword: 'newpassword123',
        });

      expect(res.status).toBe(401);
    });
  });
});
