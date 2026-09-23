require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Project = require('../models/Project');
const CollaborationRequest = require('../models/CollaborationRequest');
const Showcase = require('../models/Showcase');

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
  await Showcase.deleteMany({});
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
      teamSize: 3,
      deadline: '2026-12-01',
      difficulty: 'Intermediate',
    });
  return res.body.data.project;
};

// Transitions a project OPEN -> IN_PROGRESS -> COMPLETED.
const completeProject = async (token, projectId) => {
  await request(app).patch(`/api/projects/${projectId}/status`).set('Authorization', `Bearer ${token}`).send({ status: 'IN_PROGRESS' });
  await request(app).patch(`/api/projects/${projectId}/status`).set('Authorization', `Bearer ${token}`).send({ status: 'COMPLETED' });
};

const publish = (token, projectId, overrides = {}) =>
  request(app)
    .post('/api/showcases')
    .set('Authorization', `Bearer ${token}`)
    .send({ projectId, title: 'Our Showcase', description: 'What we built and how.', ...overrides });

// Publishes a showcase for a fresh completed project; returns { owner, showcase }.
const publishedShowcase = async () => {
  const owner = await registerUser(`owner${Math.random()}@u.edu`);
  const project = await createProject(owner.token);
  await completeProject(owner.token, project._id);
  const res = await publish(owner.token, project._id);
  return { owner, showcase: res.body.data.showcase };
};

// ---------------------------------------------------------------------------
// POST /api/showcases
// ---------------------------------------------------------------------------
describe('POST /api/showcases', () => {
  it('should let the owner publish a showcase for a COMPLETED project -> 201', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    await completeProject(owner.token, project._id);

    const res = await publish(owner.token, project._id, { technologies: ['React', 'Node'] });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.showcase.projectId).toBe(project._id);
    expect(res.body.data.showcase.likesCount).toBe(0);
    expect(res.body.data.showcase.likedBy).toEqual([]);
    expect(res.body.data.showcase.comments).toEqual([]);
  });

  it('should reject publishing when the project is not COMPLETED -> 400', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const res = await publish(owner.token, project._id);
    expect(res.statusCode).toBe(400);
  });

  it('should reject a non-owner -> 403', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    await completeProject(owner.token, project._id);
    const other = await registerUser('other@u.edu');
    const res = await publish(other.token, project._id);
    expect(res.statusCode).toBe(403);
  });

  it('should reject a duplicate showcase for the same project -> 409', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    await completeProject(owner.token, project._id);
    await publish(owner.token, project._id);
    const res = await publish(owner.token, project._id);
    expect(res.statusCode).toBe(409);
  });

  it('should ignore server-controlled fields in the body', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    await completeProject(owner.token, project._id);
    const res = await publish(owner.token, project._id, { likesCount: 99, likedBy: ['x'], comments: [{ text: 'hi' }] });
    expect(res.body.data.showcase.likesCount).toBe(0);
    expect(res.body.data.showcase.likedBy).toEqual([]);
    expect(res.body.data.showcase.comments).toEqual([]);
  });

  it('should validate required fields, unknown project, and auth', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    await completeProject(owner.token, project._id);
    expect((await request(app).post('/api/showcases').set('Authorization', `Bearer ${owner.token}`).send({ projectId: project._id, description: 'no title here please' })).statusCode).toBe(400);
    expect((await request(app).post('/api/showcases').set('Authorization', `Bearer ${owner.token}`).send({ projectId: '000000000000000000000000', title: 'X', description: 'valid description' })).statusCode).toBe(404);
    expect((await request(app).post('/api/showcases').send({ projectId: project._id, title: 'X', description: 'valid description' })).statusCode).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// GET /api/showcases  &  GET /api/showcases/:id  (public)
// ---------------------------------------------------------------------------
describe('GET /api/showcases (public feed)', () => {
  it('should return empty results with totalPages 0 when none exist', async () => {
    const res = await request(app).get('/api/showcases');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.results).toEqual([]);
    expect(res.body.data.pagination.totalPages).toBe(0);
  });

  it('should list showcases publicly (no token) with pagination', async () => {
    await publishedShowcase();
    const res = await request(app).get('/api/showcases?page=1&limit=10');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.results).toHaveLength(1);
    expect(res.body.data.pagination.totalCount).toBe(1);
  });

  it('should return a single showcase by id publicly and 404 for unknown', async () => {
    const { showcase } = await publishedShowcase();
    expect((await request(app).get(`/api/showcases/${showcase._id}`)).statusCode).toBe(200);
    expect((await request(app).get('/api/showcases/000000000000000000000000')).statusCode).toBe(404);
    expect((await request(app).get('/api/showcases/not-an-id')).statusCode).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// Likes (idempotent)
// ---------------------------------------------------------------------------
describe('Showcase likes', () => {
  it('should like/unlike idempotently and keep likesCount in sync', async () => {
    const { showcase } = await publishedShowcase();
    const liker = await registerUser('liker@u.edu');

    const like1 = await request(app).post(`/api/showcases/${showcase._id}/like`).set('Authorization', `Bearer ${liker.token}`);
    expect(like1.statusCode).toBe(200);
    expect(like1.body.data.showcase.likesCount).toBe(1);
    expect(like1.body.data.showcase.likedBy).toContain(liker.userId);

    // repeat like -> still 1
    const like2 = await request(app).post(`/api/showcases/${showcase._id}/like`).set('Authorization', `Bearer ${liker.token}`);
    expect(like2.body.data.showcase.likesCount).toBe(1);

    const unlike1 = await request(app).delete(`/api/showcases/${showcase._id}/like`).set('Authorization', `Bearer ${liker.token}`);
    expect(unlike1.body.data.showcase.likesCount).toBe(0);

    // repeat unlike -> still 200, 0
    const unlike2 = await request(app).delete(`/api/showcases/${showcase._id}/like`).set('Authorization', `Bearer ${liker.token}`);
    expect(unlike2.statusCode).toBe(200);
    expect(unlike2.body.data.showcase.likesCount).toBe(0);
  });

  it('should return 401 without a token', async () => {
    const { showcase } = await publishedShowcase();
    expect((await request(app).post(`/api/showcases/${showcase._id}/like`)).statusCode).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------
describe('Showcase comments', () => {
  it('should add a comment (authenticated), userId from token', async () => {
    const { showcase } = await publishedShowcase();
    const commenter = await registerUser('commenter@u.edu');
    const res = await request(app)
      .post(`/api/showcases/${showcase._id}/comments`)
      .set('Authorization', `Bearer ${commenter.token}`)
      .send({ text: 'Great work!', userId: '000000000000000000000000' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.comment.text).toBe('Great work!');
    expect(res.body.data.comment.userId).toBe(commenter.userId);
  });

  it('should reject empty and too-long comments with 400, and require auth', async () => {
    const { showcase } = await publishedShowcase();
    const c = await registerUser('c@u.edu');
    expect((await request(app).post(`/api/showcases/${showcase._id}/comments`).set('Authorization', `Bearer ${c.token}`).send({ text: '' })).statusCode).toBe(400);
    expect((await request(app).post(`/api/showcases/${showcase._id}/comments`).set('Authorization', `Bearer ${c.token}`).send({ text: 'x'.repeat(1001) })).statusCode).toBe(400);
    expect((await request(app).post(`/api/showcases/${showcase._id}/comments`).send({ text: 'hi' })).statusCode).toBe(401);
  });

  it('should list comments publicly, newest-first, paginated', async () => {
    const { owner, showcase } = await publishedShowcase();
    await request(app).post(`/api/showcases/${showcase._id}/comments`).set('Authorization', `Bearer ${owner.token}`).send({ text: 'first' });
    await request(app).post(`/api/showcases/${showcase._id}/comments`).set('Authorization', `Bearer ${owner.token}`).send({ text: 'second' });

    const res = await request(app).get(`/api/showcases/${showcase._id}/comments?page=1&limit=1`);
    expect(res.statusCode).toBe(200); // public, no token
    expect(res.body.data.results).toHaveLength(1);
    expect(res.body.data.results[0].text).toBe('second'); // newest-first
    expect(res.body.data.pagination.totalCount).toBe(2);
    expect(res.body.data.pagination.totalPages).toBe(2);
  });
});
