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
