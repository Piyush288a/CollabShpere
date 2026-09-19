require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Project = require('../models/Project');
const CollaborationRequest = require('../models/CollaborationRequest');

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
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// Registers a user, returns { token, userId }.
const registerUser = async (email, name = 'User') => {
  const res = await request(app).post('/api/auth/register').send({
    name,
    email,
    password: 'securepassword123',
  });
  return { token: res.body.data.token, userId: res.body.data.user._id };
};

const createProject = async (token, overrides = {}) => {
  const res = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Campus Study Buddy',
      description: 'A platform to find study partners on campus.',
      category: 'Web Development',
      requiredSkills: ['React'],
      teamSize: 3,
      deadline: '2026-12-01',
      difficulty: 'Intermediate',
      ...overrides,
    });
  return res.body.data.project;
};

// ---------------------------------------------------------------------------
// POST /api/projects/:id/requests
// ---------------------------------------------------------------------------
describe('POST /api/projects/:id/requests', () => {
  it('should let a non-owner create a request and return 201 PENDING', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const sender = await registerUser('sender@u.edu');

    const res = await request(app)
      .post(`/api/projects/${project._id}/requests`)
      .set('Authorization', `Bearer ${sender.token}`)
      .send({ message: 'I would love to join!' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.request.status).toBe('PENDING');
    expect(res.body.data.request.senderId).toBe(sender.userId);
    expect(res.body.data.request.projectId).toBe(project._id);
  });

  it('should reject a self-request with 400', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);

    const res = await request(app)
      .post(`/api/projects/${project._id}/requests`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });

  it('should reject a request when the project is not OPEN', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    await request(app)
      .patch(`/api/projects/${project._id}/status`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ status: 'IN_PROGRESS' });

    const sender = await registerUser('sender@u.edu');
    const res = await request(app)
      .post(`/api/projects/${project._id}/requests`)
      .set('Authorization', `Bearer ${sender.token}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });

  it('should reject a duplicate pending request with 409', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const sender = await registerUser('sender@u.edu');

    await request(app)
      .post(`/api/projects/${project._id}/requests`)
      .set('Authorization', `Bearer ${sender.token}`)
      .send({});
    const res = await request(app)
      .post(`/api/projects/${project._id}/requests`)
      .set('Authorization', `Bearer ${sender.token}`)
      .send({});

    expect(res.statusCode).toBe(409);
  });

  it('should reject a request from an existing member with 400', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const sender = await registerUser('sender@u.edu');

    // sender requests, owner accepts -> now a member
    const created = await request(app)
      .post(`/api/projects/${project._id}/requests`)
      .set('Authorization', `Bearer ${sender.token}`)
      .send({});
    await request(app)
      .patch(`/api/requests/${created.body.data.request._id}`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ status: 'ACCEPTED' });

    // second request should now be rejected (already a member)
    const res = await request(app)
      .post(`/api/projects/${project._id}/requests`)
      .set('Authorization', `Bearer ${sender.token}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it('should return 401 without a token', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const res = await request(app).post(`/api/projects/${project._id}/requests`).send({});
    expect(res.statusCode).toBe(401);
  });

  it('should return 404 for an unknown project', async () => {
    const sender = await registerUser('sender@u.edu');
    const res = await request(app)
      .post('/api/projects/000000000000000000000000/requests')
      .set('Authorization', `Bearer ${sender.token}`)
      .send({});
    expect(res.statusCode).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/requests/:id
// ---------------------------------------------------------------------------
describe('PATCH /api/requests/:id', () => {
  const setup = async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const sender = await registerUser('sender@u.edu');
    const created = await request(app)
      .post(`/api/projects/${project._id}/requests`)
      .set('Authorization', `Bearer ${sender.token}`)
      .send({});
    return { owner, project, sender, requestId: created.body.data.request._id };
  };

  it('should let the owner accept and sync the member into the project', async () => {
    const { owner, project, sender, requestId } = await setup();

    const res = await request(app)
      .patch(`/api/requests/${requestId}`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ status: 'ACCEPTED' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.request.status).toBe('ACCEPTED');

    // sender is now in memberIds
    const teamRes = await request(app)
      .get(`/api/projects/${project._id}/team`)
      .set('Authorization', `Bearer ${owner.token}`);
    const memberIds = teamRes.body.data.members.map((m) => m._id);
    expect(memberIds).toContain(sender.userId);
  });

  it('should let the owner reject without adding a member', async () => {
    const { owner, project, sender, requestId } = await setup();

    const res = await request(app)
      .patch(`/api/requests/${requestId}`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ status: 'REJECTED' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.request.status).toBe('REJECTED');

    const project2 = await Project.findById(project._id);
    expect(project2.memberIds.map(String)).not.toContain(sender.userId);
  });

  it('should return 403 when a non-owner tries to decide', async () => {
    const { requestId } = await setup();
    const other = await registerUser('other@u.edu');
    const res = await request(app)
      .patch(`/api/requests/${requestId}`)
      .set('Authorization', `Bearer ${other.token}`)
      .send({ status: 'ACCEPTED' });
    expect(res.statusCode).toBe(403);
  });

  it('should return 400 when deciding an already-decided request', async () => {
    const { owner, requestId } = await setup();
    await request(app)
      .patch(`/api/requests/${requestId}`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ status: 'ACCEPTED' });
    const res = await request(app)
      .patch(`/api/requests/${requestId}`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ status: 'REJECTED' });
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for an invalid status value', async () => {
    const { owner, requestId } = await setup();
    const res = await request(app)
      .patch(`/api/requests/${requestId}`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ status: 'MAYBE' });
    expect(res.statusCode).toBe(400);
  });

  it('should reject acceptance when the team is at capacity', async () => {
    // teamSize 1 => only the owner fits; no room for new members
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token, { teamSize: 1 });
    const sender = await registerUser('sender@u.edu');
    const created = await request(app)
      .post(`/api/projects/${project._id}/requests`)
      .set('Authorization', `Bearer ${sender.token}`)
      .send({});

    const res = await request(app)
      .patch(`/api/requests/${created.body.data.request._id}`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ status: 'ACCEPTED' });

    expect(res.statusCode).toBe(400);
  });

  it('should return 401 without a token', async () => {
    const { requestId } = await setup();
    const res = await request(app).patch(`/api/requests/${requestId}`).send({ status: 'ACCEPTED' });
    expect(res.statusCode).toBe(401);
  });

  it('should return 404 for an unknown request id', async () => {
    const owner = await registerUser('owner@u.edu');
    const res = await request(app)
      .patch('/api/requests/000000000000000000000000')
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ status: 'ACCEPTED' });
    expect(res.statusCode).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// GET /api/projects/:id/requests
// ---------------------------------------------------------------------------
describe('GET /api/projects/:id/requests', () => {
  it('should let the owner list incoming requests with pagination', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const s1 = await registerUser('s1@u.edu');
    const s2 = await registerUser('s2@u.edu');
    await request(app).post(`/api/projects/${project._id}/requests`).set('Authorization', `Bearer ${s1.token}`).send({});
    await request(app).post(`/api/projects/${project._id}/requests`).set('Authorization', `Bearer ${s2.token}`).send({});

    const res = await request(app)
      .get(`/api/projects/${project._id}/requests`)
      .set('Authorization', `Bearer ${owner.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.results).toHaveLength(2);
    expect(res.body.data.pagination.totalCount).toBe(2);
  });

  it('should return 403 for a non-owner', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const other = await registerUser('other@u.edu');
    const res = await request(app)
      .get(`/api/projects/${project._id}/requests`)
      .set('Authorization', `Bearer ${other.token}`);
    expect(res.statusCode).toBe(403);
  });
});

// ---------------------------------------------------------------------------
// GET /api/projects/:id/team
// ---------------------------------------------------------------------------
describe('GET /api/projects/:id/team', () => {
  it('should return the owner as the initial sole member', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);

    const res = await request(app)
      .get(`/api/projects/${project._id}/team`)
      .set('Authorization', `Bearer ${owner.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.members).toHaveLength(1);
    expect(res.body.data.members[0]._id).toBe(owner.userId);
    expect(res.body.data.members[0].password).toBeUndefined();
  });

  it('should return 401 without a token', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const res = await request(app).get(`/api/projects/${project._id}/team`);
    expect(res.statusCode).toBe(401);
  });
});
