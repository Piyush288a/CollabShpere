require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

// Use a dedicated test database — never the development database
const TEST_DB_URI =
  process.env.MONGODB_TEST_URI ||
  'mongodb://localhost:27017/collabsphere_test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

afterEach(async () => {
  // Clean up all users between tests so each test starts with a clean slate
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------
describe('POST /api/auth/register', () => {
  const validUser = {
    name: 'Jane Smith',
    email: 'jane@university.edu',
    password: 'securepassword123',
  };

  it('should register a new user and return 201 with token and user', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(validUser.email);
    expect(res.body.data.user.name).toBe(validUser.name);
    expect(res.body.data.user.role).toBe('student');
  });

  it('should never return the password in the response', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.body.data.user.password).toBeUndefined();
  });

  it('should return 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: validUser.email, password: validUser.password });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

  it('should return 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: validUser.name, password: validUser.password });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 when password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: validUser.name, email: validUser.email });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 409 when email is already registered', async () => {
    // Register once
    await request(app).post('/api/auth/register').send(validUser);

    // Try to register again with the same email
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 when email format is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Jane Smith', email: 'notanemail', password: 'securepassword123' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

  it('should accept a valid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Jane Smith', email: 'jane@university.edu', password: 'securepassword123' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('jane@university.edu');
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
describe('POST /api/auth/login', () => {
  const credentials = {
    email: 'jane@university.edu',
    password: 'securepassword123',
  };

  beforeEach(async () => {
    // Register a user before each login test
    await request(app).post('/api/auth/register').send({
      name: 'Jane Smith',
      ...credentials,
    });
  });

  it('should login successfully and return 200 with token and user', async () => {
    const res = await request(app).post('/api/auth/login').send(credentials);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(credentials.email);
  });

  it('should never return the password in the login response', async () => {
    const res = await request(app).post('/api/auth/login').send(credentials);

    expect(res.body.data.user.password).toBeUndefined();
  });

  it('should return 401 for an unregistered email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@university.edu', password: 'somepassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 for a wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: credentials.password });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// GET /api/users/profile
// ---------------------------------------------------------------------------
describe('GET /api/users/profile', () => {
  let token;

  beforeEach(async () => {
    // Register and capture the token before each profile test
    const res = await request(app).post('/api/auth/register').send({
      name: 'Jane Smith',
      email: 'jane@university.edu',
      password: 'securepassword123',
    });
    token = res.body.data.token;
  });

  it('should return the authenticated user profile with 200', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('jane@university.edu');
  });

  it('should never return the password in the profile response', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.data.user.password).toBeUndefined();
  });

  it('should return 401 when no token is provided', async () => {
    const res = await request(app).get('/api/users/profile');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 when token is invalid', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', 'Bearer this.is.not.a.valid.token');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
