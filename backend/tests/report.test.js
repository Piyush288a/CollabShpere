require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Report = require('../models/Report');

const TEST_DB_URI =
  process.env.MONGODB_TEST_URI ||
  'mongodb://localhost:27017/collabsphere_test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

afterEach(async () => {
  await User.deleteMany({});
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

const someObjectId = () => new mongoose.Types.ObjectId().toString();

describe('POST /api/reports', () => {
  it('should file a report (authenticated) -> 201 PENDING, reporter from token', async () => {
    const u = await registerUser('u@u.edu');
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${u.token}`)
      .send({ targetType: 'PROJECT', targetId: someObjectId(), reason: 'Inappropriate content' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.report.status).toBe('PENDING');
    expect(res.body.data.report.reporterId).toBe(u.userId);
    expect(res.body.data.report.targetType).toBe('PROJECT');
  });

  it('should reject an invalid targetType with 400', async () => {
    const u = await registerUser('u@u.edu');
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${u.token}`)
      .send({ targetType: 'ALIEN', targetId: someObjectId(), reason: 'x y z' });
    expect(res.statusCode).toBe(400);
  });

  it('should reject a missing reason with 400', async () => {
    const u = await registerUser('u@u.edu');
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${u.token}`)
      .send({ targetType: 'USER', targetId: someObjectId() });
    expect(res.statusCode).toBe(400);
  });

  it('should return 401 without a token', async () => {
    const res = await request(app)
      .post('/api/reports')
      .send({ targetType: 'USER', targetId: someObjectId(), reason: 'spam' });
    expect(res.statusCode).toBe(401);
  });
});
