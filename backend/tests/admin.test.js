require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Message = require('../models/Message');
const CollaborationRequest = require('../models/CollaborationRequest');
const Showcase = require('../models/Showcase');
const Report = require('../models/Report');

const TEST_DB_URI =
  process.env.MONGODB_TEST_URI ||
  'mongodb://localhost:27017/collabsphere_test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

afterEach(async () => {
  await User.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});
  await Message.deleteMany({});
  await CollaborationRequest.deleteMany({});
  await Showcase.deleteMany({});
  await Report.deleteMany({});
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

// Registers a user then elevates it to admin directly in the DB (register can't set role).
const registerAdmin = async (email) => {
  const u = await registerUser(email);
  await User.findByIdAndUpdate(u.userId, { role: 'admin' });
  // Re-login so the JWT carries role: 'admin'.
  const res = await request(app).post('/api/auth/login').send({ email, password: 'securepassword123' });
  return { token: res.body.data.token, userId: u.userId };
};

const createProject = async (token) => {
  const res = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Cascade Project',
      description: 'A project to test the delete cascade.',
      category: 'Web Development',
      requiredSkills: ['React'],
      teamSize: 3,
      deadline: '2026-12-01',
      difficulty: 'Intermediate',
    });
  return res.body.data.project;
};

// ---------------------------------------------------------------------------
// Admin authorization
// ---------------------------------------------------------------------------
describe('Admin authorization', () => {
  const adminRoutes = [
    ['get', '/api/admin/users'],
    ['get', '/api/admin/projects'],
    ['get', '/api/admin/reports'],
    ['get', '/api/admin/statistics'],
  ];

  it('should return 401 without a token on every admin route', async () => {
    for (const [method, path] of adminRoutes) {
      const res = await request(app)[method](path);
      expect(res.statusCode).toBe(401);
    }
  });

  it('should return 403 for a non-admin (student) on every admin route', async () => {
    const student = await registerUser('student@u.edu');
    for (const [method, path] of adminRoutes) {
      const res = await request(app)[method](path).set('Authorization', `Bearer ${student.token}`);
      expect(res.statusCode).toBe(403);
    }
  });

  it('should allow an admin', async () => {
    const admin = await registerAdmin('admin@u.edu');
    const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${admin.token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.results)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// User management
// ---------------------------------------------------------------------------
describe('Admin user management', () => {
  it('should suspend and restore a user', async () => {
    const admin = await registerAdmin('admin@u.edu');
    const target = await registerUser('target@u.edu');

    const susp = await request(app)
      .patch(`/api/admin/users/${target.userId}/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'suspended' });
    expect(susp.statusCode).toBe(200);
    expect(susp.body.data.user.status).toBe('suspended');

    const restore = await request(app)
      .patch(`/api/admin/users/${target.userId}/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'active' });
    expect(restore.body.data.user.status).toBe('active');
  });

  it('should prevent an admin from suspending their own account -> 400', async () => {
    const admin = await registerAdmin('admin@u.edu');
    const res = await request(app)
      .patch(`/api/admin/users/${admin.userId}/status`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'suspended' });
    expect(res.statusCode).toBe(400);
  });

  it('should reject an invalid status value (400) and unknown id (404)', async () => {
    const admin = await registerAdmin('admin@u.edu');
    const target = await registerUser('target@u.edu');
    expect((await request(app).patch(`/api/admin/users/${target.userId}/status`).set('Authorization', `Bearer ${admin.token}`).send({ status: 'frozen' })).statusCode).toBe(400);
    expect((await request(app).patch('/api/admin/users/000000000000000000000000/status').set('Authorization', `Bearer ${admin.token}`).send({ status: 'active' })).statusCode).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// Suspended-user auth (critical regression)
// ---------------------------------------------------------------------------
describe('Suspended-user authentication', () => {
  it('should block a suspended user from logging in with 403', async () => {
    const admin = await registerAdmin('admin@u.edu');
    const target = await registerUser('target@u.edu');
    await request(app).patch(`/api/admin/users/${target.userId}/status`).set('Authorization', `Bearer ${admin.token}`).send({ status: 'suspended' });

    const res = await request(app).post('/api/auth/login').send({ email: 'target@u.edu', password: 'securepassword123' });
    expect(res.statusCode).toBe(403);
  });

  it('should reject a previously issued JWT after the user is suspended', async () => {
    const admin = await registerAdmin('admin@u.edu');
    const target = await registerUser('target@u.edu'); // token captured BEFORE suspension

    // token works before suspension
    expect((await request(app).get('/api/users/profile').set('Authorization', `Bearer ${target.token}`)).statusCode).toBe(200);

    await request(app).patch(`/api/admin/users/${target.userId}/status`).set('Authorization', `Bearer ${admin.token}`).send({ status: 'suspended' });

    // same token now rejected
    const res = await request(app).get('/api/users/profile').set('Authorization', `Bearer ${target.token}`);
    expect(res.statusCode).toBe(401);
  });

  it('should let a restored user log in again', async () => {
    const admin = await registerAdmin('admin@u.edu');
    const target = await registerUser('target@u.edu');
    await request(app).patch(`/api/admin/users/${target.userId}/status`).set('Authorization', `Bearer ${admin.token}`).send({ status: 'suspended' });
    await request(app).patch(`/api/admin/users/${target.userId}/status`).set('Authorization', `Bearer ${admin.token}`).send({ status: 'active' });
    const res = await request(app).post('/api/auth/login').send({ email: 'target@u.edu', password: 'securepassword123' });
    expect(res.statusCode).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// Project delete cascade
// ---------------------------------------------------------------------------
describe('Admin project delete cascade', () => {
  it('should delete the project and all dependent documents', async () => {
    const admin = await registerAdmin('admin@u.edu');
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const projectId = project._id;

    // task + message (owner is a team member)
    await request(app).post(`/api/projects/${projectId}/tasks`).set('Authorization', `Bearer ${owner.token}`).send({ title: 'A task' });
    await request(app).post(`/api/projects/${projectId}/messages`).set('Authorization', `Bearer ${owner.token}`).send({ message: 'hello' });
    // collaboration request from another user
    const requester = await registerUser('req@u.edu');
    await request(app).post(`/api/projects/${projectId}/requests`).set('Authorization', `Bearer ${requester.token}`).send({});
    // showcase after completing
    await request(app).patch(`/api/projects/${projectId}/status`).set('Authorization', `Bearer ${owner.token}`).send({ status: 'IN_PROGRESS' });
    await request(app).patch(`/api/projects/${projectId}/status`).set('Authorization', `Bearer ${owner.token}`).send({ status: 'COMPLETED' });
    await request(app).post('/api/showcases').set('Authorization', `Bearer ${owner.token}`).send({ projectId, title: 'Showcase title', description: 'Showcase description here.' });

    const del = await request(app).delete(`/api/admin/projects/${projectId}`).set('Authorization', `Bearer ${admin.token}`);
    expect(del.statusCode).toBe(200);

    expect(await Project.countDocuments({ _id: projectId })).toBe(0);
    expect(await Task.countDocuments({ projectId })).toBe(0);
    expect(await Message.countDocuments({ projectId })).toBe(0);
    expect(await CollaborationRequest.countDocuments({ projectId })).toBe(0);
    expect(await Showcase.countDocuments({ projectId })).toBe(0);
  });

  it('should return 404 for an unknown project', async () => {
    const admin = await registerAdmin('admin@u.edu');
    const res = await request(app).delete('/api/admin/projects/000000000000000000000000').set('Authorization', `Bearer ${admin.token}`);
    expect(res.statusCode).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// Report moderation
// ---------------------------------------------------------------------------
describe('Admin report moderation', () => {
  const fileReport = async (token) =>
    request(app).post('/api/reports').set('Authorization', `Bearer ${token}`).send({
      targetType: 'PROJECT',
      targetId: new mongoose.Types.ObjectId().toString(),
      reason: 'Needs review',
    });

  it('should list reports (paginated) and resolve/dismiss them', async () => {
    const admin = await registerAdmin('admin@u.edu');
    const u = await registerUser('u@u.edu');
    const created = await fileReport(u.token);

    const list = await request(app).get('/api/admin/reports').set('Authorization', `Bearer ${admin.token}`);
    expect(list.statusCode).toBe(200);
    expect(list.body.data.pagination.totalCount).toBe(1);

    const resolve = await request(app).patch(`/api/admin/reports/${created.body.data.report._id}`).set('Authorization', `Bearer ${admin.token}`).send({ status: 'RESOLVED' });
    expect(resolve.body.data.report.status).toBe('RESOLVED');
  });

  it('should reject an invalid report status (400) and unknown id (404)', async () => {
    const admin = await registerAdmin('admin@u.edu');
    const u = await registerUser('u@u.edu');
    const created = await fileReport(u.token);
    expect((await request(app).patch(`/api/admin/reports/${created.body.data.report._id}`).set('Authorization', `Bearer ${admin.token}`).send({ status: 'PENDING' })).statusCode).toBe(400);
    expect((await request(app).patch('/api/admin/reports/000000000000000000000000').set('Authorization', `Bearer ${admin.token}`).send({ status: 'RESOLVED' })).statusCode).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------
describe('Admin statistics', () => {
  it('should return counts by role/status, projects, showcases, reports', async () => {
    const admin = await registerAdmin('admin@u.edu');
    const owner = await registerUser('owner@u.edu');
    await createProject(owner.token);

    const res = await request(app).get('/api/admin/statistics').set('Authorization', `Bearer ${admin.token}`);
    expect(res.statusCode).toBe(200);
    const s = res.body.data.statistics;
    expect(s.users.total).toBe(2);
    expect(s.users.byRole.admin).toBe(1);
    expect(s.users.byRole.student).toBe(1);
    expect(s.users.byStatus.active).toBe(2);
    expect(s.projects.total).toBe(1);
    expect(s.projects.byStatus.OPEN).toBe(1);
    expect(s.showcases.total).toBe(0);
    expect(s.reports.total).toBe(0);
  });
});
