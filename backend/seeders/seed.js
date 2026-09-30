/*
 * CollabSphere demo seeder.
 *
 * Populates the database configured in MONGODB_URI (default: collabsphere)
 * with a realistic, connected dataset for demos / faculty presentation:
 *   - 3 users (an admin, a project owner, a teammate) + one suspended user
 *   - 2 projects (one COMPLETED with a published showcase, one OPEN)
 *   - an accepted collaboration request (teammate added to the team)
 *   - a pending collaboration request on the open project
 *   - tasks in various statuses
 *   - workspace messages
 *   - a showcase with a like and a comment
 *   - a report for the admin to moderate
 *
 * Uses the real Mongoose models, so passwords are hashed and all schema
 * validators run exactly as they do through the API.
 *
 * Usage (from backend/):   npm run seed
 * WARNING: this WIPES the target database's app collections first.
 */
require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const Project = require('../models/Project');
const CollaborationRequest = require('../models/CollaborationRequest');
const Task = require('../models/Task');
const Message = require('../models/Message');
const Showcase = require('../models/Showcase');
const Report = require('../models/Report');

const PASSWORD = 'securepassword123';

const run = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/collabsphere';
  await mongoose.connect(uri);
  console.log(`Connected to "${mongoose.connection.name}". Seeding...`);

  // --- Clean slate (app collections only) ---
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    CollaborationRequest.deleteMany({}),
    Task.deleteMany({}),
    Message.deleteMany({}),
    Showcase.deleteMany({}),
    Report.deleteMany({}),
  ]);

  // --- Users (create individually so the pre-save hook hashes passwords) ---
  const admin = await User.create({
    name: 'Carol Admin',
    email: 'admin@university.edu',
    password: PASSWORD,
    role: 'admin',
    bio: 'Platform administrator.',
    skills: ['Moderation'],
  });

  const alice = await User.create({
    name: 'Alice Owner',
    email: 'alice@university.edu',
    password: PASSWORD,
    bio: 'Full-stack developer and team lead.',
    skills: ['React', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com/alice',
  });

  const bob = await User.create({
    name: 'Bob Member',
    email: 'bob@university.edu',
    password: PASSWORD,
    bio: 'Backend enthusiast.',
    skills: ['Node.js', 'Express', 'Docker'],
  });

  const dave = await User.create({
    name: 'Dave Applicant',
    email: 'dave@university.edu',
    password: PASSWORD,
    bio: 'Frontend developer looking to collaborate.',
    skills: ['React', 'CSS', 'UI/UX'],
  });

  const suspended = await User.create({
    name: 'Sam Suspended',
    email: 'sam@university.edu',
    password: PASSWORD,
    status: 'suspended',
    skills: ['JavaScript'],
  });

  // --- Project 1: COMPLETED, Alice owns, Bob is an accepted member ---
  const completedProject = await Project.create({
    ownerId: alice._id,
    memberIds: [alice._id, bob._id],
    title: 'Campus Study Buddy',
    description: 'A platform that helps students find study partners by course and availability.',
    category: 'Web Development',
    requiredSkills: ['React', 'Node.js', 'MongoDB'],
    teamSize: 4,
    deadline: new Date('2026-12-01'),
    difficulty: 'Intermediate',
    repositoryUrl: 'https://github.com/alice/campus-study-buddy',
    status: 'COMPLETED',
    bookmarkedBy: [dave._id],
  });

  // Accepted request that put Bob on the team
  await CollaborationRequest.create({
    projectId: completedProject._id,
    senderId: bob._id,
    message: 'I would love to help build the backend.',
    status: 'ACCEPTED',
  });

  // --- Project 2: OPEN, Alice owns, Dave has a pending request ---
  const openProject = await Project.create({
    ownerId: alice._id,
    memberIds: [alice._id],
    title: 'EcoTrack Mobile App',
    description: 'A mobile app to track and reduce a student household carbon footprint.',
    category: 'Mobile',
    requiredSkills: ['React Native', 'Firebase'],
    teamSize: 3,
    deadline: new Date('2027-03-15'),
    difficulty: 'Advanced',
    status: 'OPEN',
  });

  await CollaborationRequest.create({
    projectId: openProject._id,
    senderId: dave._id,
    message: 'I can design and build the UI.',
    status: 'PENDING',
  });

  // --- Tasks in the completed project's workspace ---
  await Task.create([
    {
      projectId: completedProject._id,
      title: 'Set up the repository and CI',
      description: 'Initialize the repo, add linting and the test runner.',
      assignedTo: bob._id,
      status: 'COMPLETED',
      dueDate: new Date('2026-10-01'),
    },
    {
      projectId: completedProject._id,
      title: 'Build the matching algorithm',
      description: 'Match students by shared courses and free time.',
      assignedTo: alice._id,
      status: 'IN_PROGRESS',
    },
    {
      projectId: completedProject._id,
      title: 'Write the user guide',
      status: 'TODO',
    },
  ]);

  // --- Workspace chat messages ---
  await Message.create([
    { projectId: completedProject._id, senderId: alice._id, message: 'Welcome to the team, Bob!' },
    { projectId: completedProject._id, senderId: bob._id, message: 'Thanks! Excited to get started.' },
    { projectId: completedProject._id, senderId: alice._id, message: 'Kickoff call at 5pm today.' },
  ]);

  // --- Showcase for the completed project (with a like + comment) ---
  await Showcase.create({
    projectId: completedProject._id,
    title: 'Campus Study Buddy — Final Release',
    description: 'A finished platform that pairs students for study sessions. Built with the MERN stack.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    githubUrl: 'https://github.com/alice/campus-study-buddy',
    demoUrl: 'https://campus-study-buddy.example.com',
    likesCount: 1,
    likedBy: [dave._id],
    comments: [
      { userId: dave._id, text: 'This is really useful — great work!' },
    ],
  });

  // --- A report for the admin to review ---
  await Report.create({
    reporterId: bob._id,
    targetType: 'PROJECT',
    targetId: openProject._id,
    reason: 'Possible duplicate of an existing project — please review.',
    status: 'PENDING',
  });

  // --- Summary ---
  const counts = {
    users: await User.countDocuments(),
    projects: await Project.countDocuments(),
    collaborationrequests: await CollaborationRequest.countDocuments(),
    tasks: await Task.countDocuments(),
    messages: await Message.countDocuments(),
    showcases: await Showcase.countDocuments(),
    reports: await Report.countDocuments(),
  };

  console.log('Seed complete. Document counts:');
  console.table(counts);
  console.log('\nDemo logins (all use password: ' + PASSWORD + ')');
  console.table([
    { role: 'admin', email: 'admin@university.edu' },
    { role: 'owner', email: 'alice@university.edu' },
    { role: 'member', email: 'bob@university.edu' },
    { role: 'applicant', email: 'dave@university.edu' },
    { role: 'suspended', email: 'sam@university.edu' },
  ]);

  await mongoose.connection.close();
};

run().catch(async (err) => {
  console.error('Seed failed:', err.message);
  try { await mongoose.connection.close(); } catch (_) {}
  process.exit(1);
});
