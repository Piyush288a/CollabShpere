require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/Project');
const formatProject = require('../utils/formatProject');

const TEST_DB_URI =
  process.env.MONGODB_TEST_URI ||
  'mongodb://localhost:27017/collabsphere_test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

afterEach(async () => {
  await Project.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// A valid base document used across tests. ownerId is a fresh ObjectId.
const makeValidData = (overrides = {}) => {
  const ownerId = new mongoose.Types.ObjectId();
  return {
    ownerId,
    memberIds: [ownerId],
    title: 'Campus Study Buddy',
    description: 'A platform to find study partners on campus.',
    category: 'Web Development',
    requiredSkills: ['React', 'Node.js'],
    teamSize: 4,
    deadline: new Date('2026-12-01'),
    difficulty: 'Intermediate',
    ...overrides,
  };
};

// ---------------------------------------------------------------------------
// Project model — validation, defaults, enums, URL, references, timestamps
// ---------------------------------------------------------------------------
describe('Project model', () => {
  // --- Required fields -----------------------------------------------------
  const requiredFields = ['title', 'description', 'category', 'teamSize', 'deadline', 'difficulty'];
  for (const field of requiredFields) {
    it(`should be invalid when required field "${field}" is missing`, async () => {
      const data = makeValidData();
      delete data[field];
      const project = new Project(data);
      let err;
      try {
        await project.validate();
      } catch (e) {
        err = e;
      }
      expect(err).toBeDefined();
      expect(err.errors[field]).toBeDefined();
    });
  }

  it('should be valid with all required fields present', async () => {
    const project = new Project(makeValidData());
    await expect(project.validate()).resolves.toBeUndefined();
  });

  // --- Defaults ------------------------------------------------------------
  it('should default status to OPEN', async () => {
    const project = await Project.create(makeValidData());
    expect(project.status).toBe('OPEN');
  });

  it('should default bookmarkedBy to an empty array', async () => {
    const data = makeValidData();
    delete data.bookmarkedBy;
    const project = await Project.create(data);
    expect(Array.isArray(project.bookmarkedBy)).toBe(true);
    expect(project.bookmarkedBy).toHaveLength(0);
  });

  it('should default requiredSkills to an empty array when omitted', async () => {
    const data = makeValidData();
    delete data.requiredSkills;
    const project = await Project.create(data);
    expect(Array.isArray(project.requiredSkills)).toBe(true);
    expect(project.requiredSkills).toHaveLength(0);
  });

  it('should default repositoryUrl to empty string and projectImage to null', async () => {
    const data = makeValidData();
    delete data.repositoryUrl;
    delete data.projectImage;
    const project = await Project.create(data);
    expect(project.repositoryUrl).toBe('');
    expect(project.projectImage).toBeNull();
  });

  // --- Enums ---------------------------------------------------------------
  it('should reject a difficulty outside the enum', async () => {
    const project = new Project(makeValidData({ difficulty: 'Expert' }));
    let err;
    try {
      await project.validate();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.errors.difficulty).toBeDefined();
  });

  it('should accept each valid difficulty value', async () => {
    for (const difficulty of ['Beginner', 'Intermediate', 'Advanced']) {
      const project = new Project(makeValidData({ difficulty }));
      await expect(project.validate()).resolves.toBeUndefined();
    }
  });

  it('should reject a status outside the enum', async () => {
    const project = new Project(makeValidData({ status: 'ARCHIVED' }));
    let err;
    try {
      await project.validate();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.errors.status).toBeDefined();
  });

  // --- Length / numeric bounds --------------------------------------------
  it('should reject a title shorter than 3 characters', async () => {
    const project = new Project(makeValidData({ title: 'ab' }));
    let err;
    try {
      await project.validate();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.errors.title).toBeDefined();
  });

  it('should reject a description shorter than 10 characters', async () => {
    const project = new Project(makeValidData({ description: 'too short' }));
    let err;
    try {
      await project.validate();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.errors.description).toBeDefined();
  });

  it('should reject teamSize below 1', async () => {
    const project = new Project(makeValidData({ teamSize: 0 }));
    let err;
    try {
      await project.validate();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.errors.teamSize).toBeDefined();
  });

  // --- URL validation ------------------------------------------------------
  it('should allow an empty repositoryUrl', async () => {
    const project = new Project(makeValidData({ repositoryUrl: '' }));
    await expect(project.validate()).resolves.toBeUndefined();
  });

  it('should accept a valid http(s) repositoryUrl', async () => {
    const project = new Project(makeValidData({ repositoryUrl: 'https://github.com/x/y' }));
    await expect(project.validate()).resolves.toBeUndefined();
  });

  it('should reject a non-URL repositoryUrl', async () => {
    const project = new Project(makeValidData({ repositoryUrl: 'not-a-url' }));
    let err;
    try {
      await project.validate();
    } catch (e) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.errors.repositoryUrl).toBeDefined();
  });

  // --- References ----------------------------------------------------------
  it('should store ownerId and memberIds as ObjectIds', async () => {
    const project = await Project.create(makeValidData());
    expect(project.ownerId).toBeInstanceOf(mongoose.Types.ObjectId);
    expect(project.memberIds[0]).toBeInstanceOf(mongoose.Types.ObjectId);
  });

  // --- Timestamps ----------------------------------------------------------
  it('should add createdAt and updatedAt timestamps', async () => {
    const project = await Project.create(makeValidData());
    expect(project.createdAt).toBeInstanceOf(Date);
    expect(project.updatedAt).toBeInstanceOf(Date);
  });
});

// ---------------------------------------------------------------------------
// formatProject helper
// ---------------------------------------------------------------------------
describe('formatProject helper', () => {
  it('should return exactly the documented project shape', async () => {
    const project = await Project.create(makeValidData());
    const out = formatProject(project);

    expect(out).toEqual({
      _id: project._id,
      ownerId: project.ownerId,
      memberIds: project.memberIds,
      title: project.title,
      description: project.description,
      category: project.category,
      requiredSkills: project.requiredSkills,
      teamSize: project.teamSize,
      deadline: project.deadline,
      difficulty: project.difficulty,
      repositoryUrl: project.repositoryUrl,
      projectImage: project.projectImage,
      status: project.status,
      bookmarkedBy: project.bookmarkedBy,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    });
  });
});

// ===========================================================================
// Project API endpoints (Supertest)
// ===========================================================================
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

// Registers a user and returns { token, userId }.
const registerAndLogin = async (email = 'owner@university.edu') => {
  const res = await request(app).post('/api/auth/register').send({
    name: 'Project Owner',
    email,
    password: 'securepassword123',
  });
  return { token: res.body.data.token, userId: res.body.data.user._id };
};

const validBody = (overrides = {}) => ({
  title: 'Campus Study Buddy',
  description: 'A platform to find study partners on campus.',
  category: 'Web Development',
  requiredSkills: ['React', 'Node.js'],
  teamSize: 4,
  deadline: '2026-12-01',
  difficulty: 'Intermediate',
  ...overrides,
});

const createProjectViaApi = async (token, overrides = {}) => {
  const res = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${token}`)
    .send(validBody(overrides));
  return res;
};

afterEach(async () => {
  await User.deleteMany({});
});

// --- POST /api/projects ----------------------------------------------------
describe('POST /api/projects', () => {
  it('should create a project and return 201 with owner as sole member', async () => {
    const { token, userId } = await registerAndLogin();
    const res = await createProjectViaApi(token);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.project.ownerId).toBe(userId);
    expect(res.body.data.project.memberIds).toEqual([userId]);
    expect(res.body.data.project.status).toBe('OPEN');
  });

  it('should ignore server-controlled fields in the body', async () => {
    const { token, userId } = await registerAndLogin();
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send(validBody({ status: 'COMPLETED', ownerId: '000000000000000000000000', bookmarkedBy: ['x'] }));

    expect(res.statusCode).toBe(201);
    expect(res.body.data.project.status).toBe('OPEN');
    expect(res.body.data.project.ownerId).toBe(userId);
    expect(res.body.data.project.bookmarkedBy).toEqual([]);
  });

  it('should return 400 when a required field is missing', async () => {
    const { token } = await registerAndLogin();
    const body = validBody();
    delete body.title;
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send(body);
    expect(res.statusCode).toBe(400);
  });

  it('should return 401 without a token', async () => {
    const res = await request(app).post('/api/projects').send(validBody());
    expect(res.statusCode).toBe(401);
  });
});

// --- GET /api/projects/:id -------------------------------------------------
describe('GET /api/projects/:id', () => {
  it('should return a project by id', async () => {
    const { token } = await registerAndLogin();
    const created = await createProjectViaApi(token);
    const id = created.body.data.project._id;

    const res = await request(app).get(`/api/projects/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.project._id).toBe(id);
  });

  it('should return 404 for an unknown id', async () => {
    const res = await request(app).get('/api/projects/000000000000000000000000');
    expect(res.statusCode).toBe(404);
  });

  it('should return 404 for a malformed id', async () => {
    const res = await request(app).get('/api/projects/not-an-id');
    expect(res.statusCode).toBe(404);
  });
});

// --- GET /api/projects (list, search, filter, pagination) ------------------
describe('GET /api/projects', () => {
  it('should return empty results with totalPages 0 when none exist', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.results).toEqual([]);
    expect(res.body.data.pagination).toEqual({ currentPage: 1, totalPages: 0, totalCount: 0 });
  });

  it('should list projects newest first with pagination metadata', async () => {
    const { token } = await registerAndLogin();
    await createProjectViaApi(token, { title: 'First Project' });
    await createProjectViaApi(token, { title: 'Second Project' });

    const res = await request(app).get('/api/projects');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.results).toHaveLength(2);
    expect(res.body.data.pagination.totalCount).toBe(2);
    expect(res.body.data.results[0].title).toBe('Second Project');
  });

  it('should search by title or description (case-insensitive)', async () => {
    const { token } = await registerAndLogin();
    await createProjectViaApi(token, { title: 'AI Chatbot', description: 'Uses machine learning models.' });
    await createProjectViaApi(token, { title: 'Recipe App', description: 'A cooking companion.' });

    const res = await request(app).get('/api/projects?search=chatbot');
    expect(res.body.data.results).toHaveLength(1);
    expect(res.body.data.results[0].title).toBe('AI Chatbot');
  });

  it('should filter by category, difficulty, status, and skills', async () => {
    const { token } = await registerAndLogin();
    await createProjectViaApi(token, { category: 'Mobile', difficulty: 'Beginner', requiredSkills: ['Flutter'] });
    await createProjectViaApi(token, { category: 'Web Development', difficulty: 'Advanced', requiredSkills: ['React'] });

    expect((await request(app).get('/api/projects?category=Mobile')).body.data.results).toHaveLength(1);
    expect((await request(app).get('/api/projects?difficulty=Advanced')).body.data.results).toHaveLength(1);
    expect((await request(app).get('/api/projects?status=OPEN')).body.data.results).toHaveLength(2);
    expect((await request(app).get('/api/projects?skills=React')).body.data.results).toHaveLength(1);
  });

  it('should return 400 for an invalid difficulty or status filter', async () => {
    expect((await request(app).get('/api/projects?difficulty=Expert')).statusCode).toBe(400);
    expect((await request(app).get('/api/projects?status=ARCHIVED')).statusCode).toBe(400);
  });

  it('should paginate with page and limit', async () => {
    const { token } = await registerAndLogin();
    for (let i = 0; i < 3; i += 1) await createProjectViaApi(token, { title: `Project ${i}` });

    const res = await request(app).get('/api/projects?page=1&limit=2');
    expect(res.body.data.results).toHaveLength(2);
    expect(res.body.data.pagination).toEqual({ currentPage: 1, totalPages: 2, totalCount: 3 });
  });
});

// --- PUT /api/projects/:id -------------------------------------------------
describe('PUT /api/projects/:id', () => {
  it('should let the owner update editable fields', async () => {
    const { token } = await registerAndLogin();
    const id = (await createProjectViaApi(token)).body.data.project._id;

    const res = await request(app)
      .put(`/api/projects/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Renamed Project', teamSize: 6 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.project.title).toBe('Renamed Project');
    expect(res.body.data.project.teamSize).toBe(6);
  });

  it('should return 403 for a non-owner', async () => {
    const owner = await registerAndLogin('owner@university.edu');
    const id = (await createProjectViaApi(owner.token)).body.data.project._id;
    const other = await registerAndLogin('other@university.edu');

    const res = await request(app)
      .put(`/api/projects/${id}`)
      .set('Authorization', `Bearer ${other.token}`)
      .send({ title: 'Hijacked' });

    expect(res.statusCode).toBe(403);
  });

  it('should return 400 when teamSize drops below current members', async () => {
    const { token } = await registerAndLogin();
    const id = (await createProjectViaApi(token)).body.data.project._id;

    // owner is 1 member; teamSize 0 is below and also fails schema, but the guard triggers first for < members
    const res = await request(app)
      .put(`/api/projects/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ teamSize: 0 });

    expect(res.statusCode).toBe(400);
  });

  it('should return 401 without a token', async () => {
    const { token } = await registerAndLogin();
    const id = (await createProjectViaApi(token)).body.data.project._id;
    const res = await request(app).put(`/api/projects/${id}`).send({ title: 'x' });
    expect(res.statusCode).toBe(401);
  });
});

// --- PATCH /api/projects/:id/status ----------------------------------------
describe('PATCH /api/projects/:id/status', () => {
  it('should allow forward transitions OPEN -> IN_PROGRESS -> COMPLETED', async () => {
    const { token } = await registerAndLogin();
    const id = (await createProjectViaApi(token)).body.data.project._id;

    const r1 = await request(app)
      .patch(`/api/projects/${id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'IN_PROGRESS' });
    expect(r1.statusCode).toBe(200);
    expect(r1.body.data.project.status).toBe('IN_PROGRESS');

    const r2 = await request(app)
      .patch(`/api/projects/${id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'COMPLETED' });
    expect(r2.statusCode).toBe(200);
    expect(r2.body.data.project.status).toBe('COMPLETED');
  });

  it('should reject invalid transitions and unknown values with 400', async () => {
    const { token } = await registerAndLogin();
    const id = (await createProjectViaApi(token)).body.data.project._id;

    // skip
    expect((await request(app).patch(`/api/projects/${id}/status`).set('Authorization', `Bearer ${token}`).send({ status: 'COMPLETED' })).statusCode).toBe(400);
    // unknown value
    expect((await request(app).patch(`/api/projects/${id}/status`).set('Authorization', `Bearer ${token}`).send({ status: 'ARCHIVED' })).statusCode).toBe(400);
    // no-op
    expect((await request(app).patch(`/api/projects/${id}/status`).set('Authorization', `Bearer ${token}`).send({ status: 'OPEN' })).statusCode).toBe(400);
  });

  it('should return 403 for a non-owner', async () => {
    const owner = await registerAndLogin('owner@university.edu');
    const id = (await createProjectViaApi(owner.token)).body.data.project._id;
    const other = await registerAndLogin('other@university.edu');
    const res = await request(app)
      .patch(`/api/projects/${id}/status`)
      .set('Authorization', `Bearer ${other.token}`)
      .send({ status: 'IN_PROGRESS' });
    expect(res.statusCode).toBe(403);
  });
});

// --- Bookmarks -------------------------------------------------------------
describe('Bookmarks', () => {
  it('should add and remove a bookmark idempotently', async () => {
    const { token, userId } = await registerAndLogin();
    const id = (await createProjectViaApi(token)).body.data.project._id;

    const add1 = await request(app).post(`/api/projects/${id}/bookmark`).set('Authorization', `Bearer ${token}`);
    expect(add1.statusCode).toBe(200);
    expect(add1.body.data.project.bookmarkedBy).toContain(userId);

    // repeat add — no duplicate
    const add2 = await request(app).post(`/api/projects/${id}/bookmark`).set('Authorization', `Bearer ${token}`);
    expect(add2.body.data.project.bookmarkedBy.filter((u) => u === userId)).toHaveLength(1);

    const del1 = await request(app).delete(`/api/projects/${id}/bookmark`).set('Authorization', `Bearer ${token}`);
    expect(del1.statusCode).toBe(200);
    expect(del1.body.data.project.bookmarkedBy).not.toContain(userId);

    // repeat remove — still 200
    const del2 = await request(app).delete(`/api/projects/${id}/bookmark`).set('Authorization', `Bearer ${token}`);
    expect(del2.statusCode).toBe(200);
  });

  it('should return 401 without a token', async () => {
    const { token } = await registerAndLogin();
    const id = (await createProjectViaApi(token)).body.data.project._id;
    expect((await request(app).post(`/api/projects/${id}/bookmark`)).statusCode).toBe(401);
  });
});

// --- DELETE /api/projects/:id ----------------------------------------------
describe('DELETE /api/projects/:id', () => {
  it('should let the owner delete and return 200 with confirmation', async () => {
    const { token } = await registerAndLogin();
    const id = (await createProjectViaApi(token)).body.data.project._id;

    const res = await request(app).delete(`/api/projects/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.message).toBe('Project deleted');
    expect(res.body.data.id).toBe(id);

    expect((await request(app).get(`/api/projects/${id}`)).statusCode).toBe(404);
  });

  it('should return 403 for a non-owner', async () => {
    const owner = await registerAndLogin('owner@university.edu');
    const id = (await createProjectViaApi(owner.token)).body.data.project._id;
    const other = await registerAndLogin('other@university.edu');
    const res = await request(app).delete(`/api/projects/${id}`).set('Authorization', `Bearer ${other.token}`);
    expect(res.statusCode).toBe(403);
  });
});
