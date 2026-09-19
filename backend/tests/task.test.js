require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Project = require('../models/Project');
const CollaborationRequest = require('../models/CollaborationRequest');
const Task = require('../models/Task');

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
  await Task.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

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
      teamSize: 4,
      deadline: '2026-12-01',
      difficulty: 'Intermediate',
      ...overrides,
    });
  return res.body.data.project;
};

// Adds `member` to `project` by request + owner acceptance.
const addMember = async (ownerToken, projectId, memberToken) => {
  const created = await request(app)
    .post(`/api/projects/${projectId}/requests`)
    .set('Authorization', `Bearer ${memberToken}`)
    .send({});
  await request(app)
    .patch(`/api/requests/${created.body.data.request._id}`)
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ status: 'ACCEPTED' });
};

const createTask = (token, projectId, body = {}) =>
  request(app)
    .post(`/api/projects/${projectId}/tasks`)
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Set up repo', ...body });

// ---------------------------------------------------------------------------
// POST /api/projects/:id/tasks
// ---------------------------------------------------------------------------
describe('POST /api/projects/:id/tasks', () => {
  it('should let a team member (owner) create a task -> 201 TODO', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);

    const res = await createTask(owner.token, project._id, { description: 'init' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.task.status).toBe('TODO');
    expect(res.body.data.task.projectId).toBe(project._id);
    expect(res.body.data.task.assignedTo).toBeNull();
  });

  it('should return 403 for a non-member', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const outsider = await registerUser('out@u.edu');
    const res = await createTask(outsider.token, project._id);
    expect(res.statusCode).toBe(403);
  });

  it('should return 400 when the assignee is not a team member', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const outsider = await registerUser('out@u.edu');
    const res = await createTask(owner.token, project._id, { assignedTo: outsider.userId });
    expect(res.statusCode).toBe(400);
  });

  it('should accept an assignee who is a team member', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const member = await registerUser('member@u.edu');
    await addMember(owner.token, project._id, member.token);

    const res = await createTask(owner.token, project._id, { assignedTo: member.userId });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.task.assignedTo).toBe(member.userId);
  });

  it('should return 400 when title is missing', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const res = await request(app)
      .post(`/api/projects/${project._id}/tasks`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ description: 'no title' });
    expect(res.statusCode).toBe(400);
  });

  it('should return 401 without a token and 404 for unknown project', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    expect((await request(app).post(`/api/projects/${project._id}/tasks`).send({ title: 'x' })).statusCode).toBe(401);
    expect((await createTask(owner.token, '000000000000000000000000')).statusCode).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// GET /api/projects/:id/tasks
// ---------------------------------------------------------------------------
describe('GET /api/projects/:id/tasks', () => {
  it('should list tasks for a team member with pagination', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    await createTask(owner.token, project._id, { title: 'Task A' });
    await createTask(owner.token, project._id, { title: 'Task B' });

    const res = await request(app)
      .get(`/api/projects/${project._id}/tasks`)
      .set('Authorization', `Bearer ${owner.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.results).toHaveLength(2);
    expect(res.body.data.pagination.totalCount).toBe(2);
  });

  it('should filter by status', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const t = await createTask(owner.token, project._id);
    await request(app)
      .patch(`/api/tasks/${t.body.data.task._id}`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ status: 'IN_PROGRESS' });
    await createTask(owner.token, project._id, { title: 'Another' });

    const res = await request(app)
      .get(`/api/projects/${project._id}/tasks?status=IN_PROGRESS`)
      .set('Authorization', `Bearer ${owner.token}`);
    expect(res.body.data.results).toHaveLength(1);
  });

  it('should return 403 for a non-member', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const outsider = await registerUser('out@u.edu');
    const res = await request(app)
      .get(`/api/projects/${project._id}/tasks`)
      .set('Authorization', `Bearer ${outsider.token}`);
    expect(res.statusCode).toBe(403);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/tasks/:id
// ---------------------------------------------------------------------------
describe('PATCH /api/tasks/:id', () => {
  const setup = async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const t = await createTask(owner.token, project._id);
    return { owner, project, taskId: t.body.data.task._id };
  };

  it('should update details and follow forward status transitions', async () => {
    const { owner, taskId } = await setup();

    const r1 = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ title: 'Renamed', status: 'IN_PROGRESS' });
    expect(r1.statusCode).toBe(200);
    expect(r1.body.data.task.title).toBe('Renamed');
    expect(r1.body.data.task.status).toBe('IN_PROGRESS');

    const r2 = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ status: 'COMPLETED' });
    expect(r2.body.data.task.status).toBe('COMPLETED');
  });

  it('should reject invalid/backward/unknown status with 400', async () => {
    const { owner, taskId } = await setup();
    // skip TODO -> COMPLETED
    expect((await request(app).patch(`/api/tasks/${taskId}`).set('Authorization', `Bearer ${owner.token}`).send({ status: 'COMPLETED' })).statusCode).toBe(400);
    // unknown value
    expect((await request(app).patch(`/api/tasks/${taskId}`).set('Authorization', `Bearer ${owner.token}`).send({ status: 'DONE' })).statusCode).toBe(400);
  });

  it('should reject assigning a non-member and allow a member', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const t = await createTask(owner.token, project._id);
    const outsider = await registerUser('out@u.edu');
    const member = await registerUser('member@u.edu');
    await addMember(owner.token, project._id, member.token);

    expect((await request(app).patch(`/api/tasks/${t.body.data.task._id}`).set('Authorization', `Bearer ${owner.token}`).send({ assignedTo: outsider.userId })).statusCode).toBe(400);
    const ok = await request(app).patch(`/api/tasks/${t.body.data.task._id}`).set('Authorization', `Bearer ${owner.token}`).send({ assignedTo: member.userId });
    expect(ok.statusCode).toBe(200);
    expect(ok.body.data.task.assignedTo).toBe(member.userId);
  });

  it('should return 403 for a non-member and 404 for unknown task', async () => {
    const { owner, taskId } = await setup();
    const outsider = await registerUser('out@u.edu');
    expect((await request(app).patch(`/api/tasks/${taskId}`).set('Authorization', `Bearer ${outsider.token}`).send({ title: 'x' })).statusCode).toBe(403);
    expect((await request(app).patch('/api/tasks/000000000000000000000000').set('Authorization', `Bearer ${owner.token}`).send({ title: 'x' })).statusCode).toBe(404);
  });

  it('should return 401 without a token', async () => {
    const { taskId } = await setup();
    expect((await request(app).patch(`/api/tasks/${taskId}`).send({ title: 'x' })).statusCode).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/tasks/:id
// ---------------------------------------------------------------------------
describe('DELETE /api/tasks/:id', () => {
  it('should let a team member delete a task', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const t = await createTask(owner.token, project._id);

    const res = await request(app)
      .delete(`/api/tasks/${t.body.data.task._id}`)
      .set('Authorization', `Bearer ${owner.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.message).toBe('Task deleted');

    const list = await request(app)
      .get(`/api/projects/${project._id}/tasks`)
      .set('Authorization', `Bearer ${owner.token}`);
    expect(list.body.data.results).toHaveLength(0);
  });

  it('should return 403 for a non-member and 404 for unknown task', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const t = await createTask(owner.token, project._id);
    const outsider = await registerUser('out@u.edu');
    expect((await request(app).delete(`/api/tasks/${t.body.data.task._id}`).set('Authorization', `Bearer ${outsider.token}`)).statusCode).toBe(403);
    expect((await request(app).delete('/api/tasks/000000000000000000000000').set('Authorization', `Bearer ${owner.token}`)).statusCode).toBe(404);
  });
});
