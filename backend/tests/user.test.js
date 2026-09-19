require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

const TEST_DB_URI =
  process.env.MONGODB_TEST_URI ||
  'mongodb://localhost:27017/collabsphere_test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// Helper — registers a user and returns { token, user }
const registerUser = async () => {
  const res = await request(app).post('/api/auth/register').send({
    name: 'Jane Smith',
    email: 'jane@university.edu',
    password: 'securepassword123',
  });
  return res.body.data;
};

// ---------------------------------------------------------------------------
// PUT /api/users/profile
// ---------------------------------------------------------------------------
describe('PUT /api/users/profile', () => {
  let token;

  beforeEach(async () => {
    const data = await registerUser();
    token = data.token;
  });

  it('should update the full profile and return 200 with updated fields', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Jane Doe',
        bio: 'Full-stack developer',
        skills: ['React', 'Node.js'],
        githubUrl: 'https://github.com/janedoe',
        linkedinUrl: 'https://linkedin.com/in/janedoe',
        avatar: 'https://example.com/avatar.png',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.name).toBe('Jane Doe');
    expect(res.body.data.user.bio).toBe('Full-stack developer');
    expect(res.body.data.user.skills).toEqual(['React', 'Node.js']);
    expect(res.body.data.user.githubUrl).toBe('https://github.com/janedoe');
    expect(res.body.data.user.linkedinUrl).toBe('https://linkedin.com/in/janedoe');
    expect(res.body.data.user.avatar).toBe('https://example.com/avatar.png');
  });

  it('should allow a partial update leaving other fields unchanged', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ bio: 'Only bio changed' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.bio).toBe('Only bio changed');
    // name should remain the original registered value
    expect(res.body.data.user.name).toBe('Jane Smith');
  });

  it('should never return the password in the update response', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ bio: 'No password here' });

    expect(res.body.data.user.password).toBeUndefined();
  });

  it('should return 401 when no token is provided', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .send({ bio: 'Should not work' });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should ignore attempts to update email', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'hacker@evil.com', bio: 'changed bio' });

    expect(res.statusCode).toBe(200);
    // email must remain the original registered value
    expect(res.body.data.user.email).toBe('jane@university.edu');
    expect(res.body.data.user.bio).toBe('changed bio');
  });

  it('should ignore attempts to update role', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'admin', bio: 'still a student' });

    expect(res.statusCode).toBe(200);
    // role must remain 'student'
    expect(res.body.data.user.role).toBe('student');
  });

  it('should ignore attempts to update password', async () => {
    await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'newhackedpassword', bio: 'changed' });

    // The original password must still work for login
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'jane@university.edu',
      password: 'securepassword123',
    });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.success).toBe(true);
  });

  it('should return 200 and leave the user unchanged for an empty body', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.name).toBe('Jane Smith');
    expect(res.body.data.user.email).toBe('jane@university.edu');
  });
});

// ---------------------------------------------------------------------------
// GET /api/users/profile (regression after controller relocation)
// ---------------------------------------------------------------------------
describe('GET /api/users/profile (regression)', () => {
  let token;

  beforeEach(async () => {
    const data = await registerUser();
    token = data.token;
  });

  it('should still return the authenticated user profile with 200', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('jane@university.edu');
    expect(res.body.data.user.password).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// GET /api/users/search (skill search)
// ---------------------------------------------------------------------------
describe('GET /api/users/search', () => {
  let token;

  const registerWith = async (name, email, skills) => {
    const reg = await request(app).post('/api/auth/register').send({
      name,
      email,
      password: 'securepassword123',
    });
    // set skills via profile update
    await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${reg.body.data.token}`)
      .send({ skills });
    return reg.body.data;
  };

  beforeEach(async () => {
    const me = await registerWith('Searcher', 'searcher@university.edu', ['Python']);
    token = me.token;
    await registerWith('Alice React', 'alice@university.edu', ['React', 'Node.js']);
    await registerWith('Bob Vue', 'bob@university.edu', ['Vue']);
  });

  it('should find users by skill (case-insensitive) and paginate', async () => {
    const res = await request(app)
      .get('/api/users/search?skills=react')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.results).toHaveLength(1);
    expect(res.body.data.results[0].name).toBe('Alice React');
    expect(res.body.data.pagination.totalCount).toBe(1);
  });

  it('should match by name via the search param', async () => {
    const res = await request(app)
      .get('/api/users/search?search=bob')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.data.results).toHaveLength(1);
    expect(res.body.data.results[0].name).toBe('Bob Vue');
  });

  it('should exclude the requesting user from results', async () => {
    const res = await request(app)
      .get('/api/users/search')
      .set('Authorization', `Bearer ${token}`);
    const emails = res.body.data.results.map((u) => u.email);
    expect(emails).not.toContain('searcher@university.edu');
  });

  it('should never include the password field', async () => {
    const res = await request(app)
      .get('/api/users/search?skills=React')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.data.results[0].password).toBeUndefined();
  });

  it('should return 401 without a token', async () => {
    const res = await request(app).get('/api/users/search');
    expect(res.statusCode).toBe(401);
  });

  it('should return 200 with empty results when nothing matches', async () => {
    const res = await request(app)
      .get('/api/users/search?skills=COBOL')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.results).toEqual([]);
  });
});
