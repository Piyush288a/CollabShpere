require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Project = require('../models/Project');
const CollaborationRequest = require('../models/CollaborationRequest');
const Message = require('../models/Message');

const TEST_DB_URI =
  process.env.MONGODB_TEST_URI ||
  'mongodb://localhost:27017/collabsphere_test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

afterEach(async () => {
  await User.deleteMany({});
  await Project.deleteMany({});
  await CollaborationRequest.deleteMany({});
  await Message.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

const registerUser = async (email) => {
  const res = await request(app).post('/api/auth/register').send({
    name: 'User',
    email,
    password: 'securepassword123',
  });
  return { token: res.body.data.token, userId: res.body.data.user._id };
};

const createProject = async (token) => {
  const res = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Campus Study Buddy',
      description: 'A platform to find study partners on campus.',
      category: 'Web Development',
      requiredSkills: ['React'],
      teamSize: 4,
      deadline: '2026-12-01',
      difficulty: 'Intermediate',
    });
  return res.body.data.project;
};

const send = (token, projectId, body) =>
  request(app)
    .post(`/api/projects/${projectId}/messages`)
    .set('Authorization', `Bearer ${token}`)
    .send(body);

// ---------------------------------------------------------------------------
// POST /api/projects/:id/messages
// ---------------------------------------------------------------------------
describe('POST /api/projects/:id/messages', () => {
  it('should let a team member send a message -> 201 and persist it', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);

    const res = await send(owner.token, project._id, { message: 'Hello team' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.message.message).toBe('Hello team');
    expect(res.body.data.message.senderId).toBe(owner.userId);

    const count = await Message.countDocuments({ projectId: project._id });
    expect(count).toBe(1);
  });

  it('should force senderId from the token, ignoring body senderId', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const res = await send(owner.token, project._id, {
      message: 'hi',
      senderId: '000000000000000000000000',
    });
    expect(res.body.data.message.senderId).toBe(owner.userId);
  });

  it('should reject an empty or whitespace message with 400', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    expect((await send(owner.token, project._id, { message: '' })).statusCode).toBe(400);
    expect((await send(owner.token, project._id, { message: '   ' })).statusCode).toBe(400);
  });

  it('should reject a message longer than 2000 chars with 400', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const res = await send(owner.token, project._id, { message: 'x'.repeat(2001) });
    expect(res.statusCode).toBe(400);
  });

  it('should return 403 for a non-member', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const outsider = await registerUser('out@u.edu');
    expect((await send(outsider.token, project._id, { message: 'hi' })).statusCode).toBe(403);
  });

  it('should return 401 without a token and 404 for unknown project', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    expect((await request(app).post(`/api/projects/${project._id}/messages`).send({ message: 'x' })).statusCode).toBe(401);
    expect((await send(owner.token, '000000000000000000000000', { message: 'x' })).statusCode).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// GET /api/projects/:id/messages
// ---------------------------------------------------------------------------
describe('GET /api/projects/:id/messages', () => {
  it('should return paginated history newest-first for a team member', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    await send(owner.token, project._id, { message: 'first' });
    await send(owner.token, project._id, { message: 'second' });

    const res = await request(app)
      .get(`/api/projects/${project._id}/messages`)
      .set('Authorization', `Bearer ${owner.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.results).toHaveLength(2);
    expect(res.body.data.results[0].message).toBe('second');
    expect(res.body.data.pagination.totalCount).toBe(2);
  });

  it('should return empty results with totalPages 0 when none exist', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const res = await request(app)
      .get(`/api/projects/${project._id}/messages`)
      .set('Authorization', `Bearer ${owner.token}`);
    expect(res.body.data.results).toEqual([]);
    expect(res.body.data.pagination.totalPages).toBe(0);
  });

  it('should return 403 for a non-member', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const outsider = await registerUser('out@u.edu');
    const res = await request(app)
      .get(`/api/projects/${project._id}/messages`)
      .set('Authorization', `Bearer ${outsider.token}`);
    expect(res.statusCode).toBe(403);
  });
});
