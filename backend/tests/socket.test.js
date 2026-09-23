require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const { io: Client } = require('socket.io-client');
const request = require('supertest');
const app = require('../app');
const { initSocket } = require('../socket');
const User = require('../models/User');
const Project = require('../models/Project');
const CollaborationRequest = require('../models/CollaborationRequest');
const Message = require('../models/Message');

const TEST_DB_URI =
  process.env.MONGODB_TEST_URI ||
  'mongodb://localhost:27017/collabsphere_test';

let server;
let port;

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
  server = http.createServer(app);
  initSocket(server);
  await new Promise((resolve) => server.listen(0, resolve));
  port = server.address().port;
});

afterEach(async () => {
  await User.deleteMany({});
  await Project.deleteMany({});
  await CollaborationRequest.deleteMany({});
  await Message.deleteMany({});
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
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

const connect = (token) =>
  new Promise((resolve, reject) => {
    const socket = Client(`http://localhost:${port}`, {
      auth: { token },
      transports: ['websocket'],
      forceNew: true,
    });
    socket.on('connect', () => resolve(socket));
    socket.on('connect_error', (err) => reject(err));
  });

describe('Socket.IO messaging', () => {
  it('should reject a connection without a valid token', async () => {
    await expect(connect('bad.token.here')).rejects.toBeTruthy();
  });

  it('should let a team member join and receive message:new', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const socket = await connect(owner.token);

    const joinAck = await new Promise((resolve) =>
      socket.emit('join_project', { projectId: project._id }, resolve)
    );
    expect(joinAck.ok).toBe(true);

    const received = new Promise((resolve) => socket.on('message:new', resolve));

    // Drive a real message through the REST write path (shared io instance broadcasts).
    await request(app)
      .post(`/api/projects/${project._id}/messages`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ message: 'realtime hello' });

    const payload = await received;
    expect(payload.message).toBe('realtime hello');
    socket.disconnect();
  });

  it('should reject join for a non-member', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const outsider = await registerUser('out@u.edu');
    const socket = await connect(outsider.token);

    const ack = await new Promise((resolve) =>
      socket.emit('join_project', { projectId: project._id }, resolve)
    );
    expect(ack.ok).toBe(false);
    socket.disconnect();
  });

  it('should not deliver a message to a socket in a different project room', async () => {
    const owner = await registerUser('owner@u.edu');
    const projectA = await createProject(owner.token);
    const projectB = await createProject(owner.token);
    const socket = await connect(owner.token);

    await new Promise((resolve) => socket.emit('join_project', { projectId: projectB._id }, resolve));

    let leaked = false;
    socket.on('message:new', () => {
      leaked = true;
    });

    await request(app)
      .post(`/api/projects/${projectA._id}/messages`)
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ message: 'only for A' });

    // Give any (incorrect) broadcast a moment to arrive.
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(leaked).toBe(false);
    socket.disconnect();
  });
});

describe('Socket.IO suspended-user authorization', () => {
  it('should reject join_project for a user suspended after connecting', async () => {
    const owner = await registerUser('owner@u.edu');
    const project = await createProject(owner.token);
    const socket = await connect(owner.token);

    // Suspend the user directly (simulating an admin action) after the socket connected.
    await User.findByIdAndUpdate(owner.userId, { status: 'suspended' });

    const ack = await new Promise((resolve) =>
      socket.emit('join_project', { projectId: project._id }, resolve)
    );
    expect(ack.ok).toBe(false);
    socket.disconnect();
  });
});
