const fs = require('fs');
const path = require('path');

const seedContent = fs.readFileSync(path.join(__dirname, 'seed-production-v2.js'), 'utf8');

// Safe eval of arrays with mock oid and userMap/projectMap
const BCRYPT_HASH = '$2a$10$YPs5HIMt..t.piEGNAwhwuNoLtOkcKZ6.qncrZcjs8Chx7pZvBOaC';
const oid = (n) => n.toString();
const userMap = {};
const projectMap = {};

// Evaluate users
const usersCode = seedContent.match(/const usersData = (\[[\s\S]*?\]);\r?\n\r?\n\/\/ Helper to lookup/)[1];
const users = eval(usersCode);
users.forEach(u => userMap[u.email] = u._id);

// Evaluate projects
const projectsCode = seedContent.match(/const projectsData = (\[[\s\S]*?\]);\r?\n\r?\n\/\/ Helper to lookup project/)[1];
const projects = eval(projectsCode);
projects.forEach(p => projectMap[p.title] = p._id);

// Evaluate requests
const requestsCode = seedContent.match(/const requestsData = (\[[\s\S]*?\]);\r?\n\r?\n\/\/ ----------------------------------------------------/)[1];
const requests = eval(requestsCode);

// Evaluate tasks
const tasksCode = seedContent.match(/const tasksData = (\[[\s\S]*?\]);\r?\n\r?\n\/\/ ----------------------------------------------------/)[1];
const tasks = eval(tasksCode);

// Evaluate showcases
const showcasesCode = seedContent.match(/const showcasesData = (\[[\s\S]*?\]);\r?\n\r?\n\/\/ ----------------------------------------------------/)[1];
const showcases = eval(showcasesCode);

// Group users role-wise
const admins = users.filter(u => u.role === 'admin');
const owners = users.filter(u => u.role === 'student' && projects.some(p => p.ownerId === u._id));
const members = users.filter(u => u.role === 'student' && !projects.some(p => p.ownerId === u._id) && u.status === 'active');
const suspended = users.filter(u => u.status === 'suspended');

let txt = '';
const line = (s = '') => { txt += s + '\r\n'; };
const divider = (char = '=') => line(char.repeat(80));

divider();
line('           COLLABSPHERE — COMPLETE PRODUCTION DATABASE DIRECTORY');
divider();
line();
line('Database Platform:   MongoDB Atlas (Cloud Cluster)');
line('Shared Demo Password: securepassword123 (All accounts use this)');
line(`Total Users:         ${users.length}`);
line(`Total Projects:      ${projects.length}`);
line(`Total Showcases:     ${showcases.length}`);
line(`Total Tasks:         ${tasks.length}`);
line(`Total Requests:      ${requests.length}`);
line();
divider();
line('TABLE OF CONTENTS');
divider();
line('  1. QUICK LOGIN CHEAT SHEET (FAVORITE ACCOUNTS FOR DEMOS)');
line('  2. USER DIRECTORY BY ROLE');
line('     2.1 Platform Administrators (role: admin)');
line('     2.2 Student Project Owners / Team Leads');
line('     2.3 Student Team Members / Domain Specialists');
line('     2.4 Suspended / Moderated Accounts');
line('  3. PROJECTS DIRECTORY BY STATUS');
line('     3.1 Completed Projects (Published Showcases & Repositories)');
line('     3.2 Open Projects (Actively Recruiting Teammates)');
line('     3.3 In-Progress Projects (Active Teams & Task Boards)');
line('  4. SHOWCASES DIRECTORY');
line('  5. WORKSPACE TASKS & ASSIGNMENTS');
line('  6. COLLABORATION REQUESTS STATUS');
line();

// ----------------------------------------------------
// Section 1: Quick Login Cheat Sheet
// ----------------------------------------------------
divider();
line('1. QUICK LOGIN CHEAT SHEET (RECOMMENDED TEST PERSONAS)');
divider();
line();
line('All accounts use Password: securepassword123');
line();
line('┌───────────────────────┬──────────────────────────────────────────┬─────────────────────────────┐');
line('│ ROLE / USE CASE       │ EMAIL ADDRESS                            │ NAME / SPECIALIZATION       │');
line('├───────────────────────┼──────────────────────────────────────────┼─────────────────────────────┤');
line('│ Super Admin           │ admin.collabsphere@gmail.com             │ Aarav Sharma (Full Admin)   │');
line('│ Lead Agritech Owner   │ priya.patel.dev@gmail.com                │ Priya Patel (React/Node)    │');
line('│ Lead AI/ML Owner      │ rohan.iyer.tech@gmail.com                │ Rohan Iyer (Python/PyTorch) │');
line('│ Lead Mobile/UI Owner  │ ananya.deshmukh.ui@gmail.com             │ Ananya Deshmukh (Flutter)   │');
line('│ Lead Cloud/Go Owner   │ vikram.reddy.cloud@gmail.com             │ Vikram Reddy (Go/Docker)    │');
line('│ Lead IoT/Green Owner  │ kavya.nair.foss@gmail.com                │ Kavya Nair (Embedded/IoT)   │');
line('│ Core Web Specialist   │ aditya.banerjee.fullstack@gmail.com      │ Aditya Banerjee (Next/TS)   │');
line('│ Core Systems/Rust     │ sneha.kulkarni.systems@gmail.com         │ Sneha Kulkarni (Rust/Wasm)  │');
line('│ Core NLP Specialist   │ meera.joshi.ml@gmail.com                 │ Meera Joshi (Transformers)  │');
line('│ Suspended User        │ saurabh.agarwal.mod@gmail.com            │ Saurabh Agarwal (Moderated) │');
line('└───────────────────────┴──────────────────────────────────────────┴─────────────────────────────┘');
line();

// ----------------------------------------------------
// Section 2: User Directory by Role
// ----------------------------------------------------
divider();
line('2. USER DIRECTORY BY ROLE');
divider();

// 2.1 Admins
line();
line('2.1 PLATFORM ADMINISTRATORS (role: admin)');
line('--------------------------------------------------------------------------------');
admins.forEach((u, i) => {
  line(`[ADMIN #${i+1}] ${u.name}`);
  line(`  Email:       ${u.email}`);
  line(`  Password:    securepassword123`);
  line(`  Status:      ${u.status.toUpperCase()}`);
  line(`  Skills:      ${u.skills.join(', ')}`);
  line(`  Bio:         ${u.bio}`);
  line(`  GitHub:      ${u.githubUrl}`);
  line(`  LinkedIn:    ${u.linkedinUrl}`);
  line(`  ID:          ${u._id}`);
  line();
});

// 2.2 Project Owners
line();
line('2.2 STUDENT PROJECT OWNERS / TEAM LEADS (role: student)');
line('--------------------------------------------------------------------------------');
owners.forEach((u, i) => {
  const owned = projects.filter(p => p.ownerId === u._id).map(p => p.title);
  line(`[OWNER #${i+1}] ${u.name}`);
  line(`  Email:       ${u.email}`);
  line(`  Password:    securepassword123`);
  line(`  Status:      ${u.status.toUpperCase()}`);
  line(`  Skills:      ${u.skills.join(', ')}`);
  line(`  Bio:         ${u.bio}`);
  line(`  GitHub:      ${u.githubUrl}`);
  line(`  LinkedIn:    ${u.linkedinUrl}`);
  line(`  Projects:    ${owned.join(' | ')}`);
  line(`  ID:          ${u._id}`);
  line();
});

// 2.3 Team Members
line();
line('2.3 STUDENT TEAM MEMBERS / DOMAIN SPECIALISTS (role: student)');
line('--------------------------------------------------------------------------------');
members.forEach((u, i) => {
  const memberOf = projects.filter(p => p.memberIds.includes(u._id) && p.ownerId !== u._id).map(p => p.title);
  line(`[MEMBER #${i+1}] ${u.name}`);
  line(`  Email:       ${u.email}`);
  line(`  Password:    securepassword123`);
  line(`  Status:      ${u.status.toUpperCase()}`);
  line(`  Skills:      ${u.skills.join(', ')}`);
  line(`  Bio:         ${u.bio}`);
  line(`  GitHub:      ${u.githubUrl}`);
  line(`  LinkedIn:    ${u.linkedinUrl}`);
  if (memberOf.length > 0) line(`  Joined:      ${memberOf.join(' | ')}`);
  line(`  ID:          ${u._id}`);
  line();
});

// 2.4 Suspended Users
line();
line('2.4 SUSPENDED / MODERATED ACCOUNTS');
line('--------------------------------------------------------------------------------');
suspended.forEach((u, i) => {
  line(`[SUSPENDED #${i+1}] ${u.name}`);
  line(`  Email:       ${u.email}`);
  line(`  Password:    securepassword123`);
  line(`  Status:      SUSPENDED (Login is blocked by backend)`);
  line(`  Reason:      Subject to admin moderation review`);
  line(`  Bio:         ${u.bio}`);
  line(`  ID:          ${u._id}`);
  line();
});

// ----------------------------------------------------
// Section 3: Project Directory
// ----------------------------------------------------
divider();
line('3. COMPLETE PROJECTS DIRECTORY (32 PROJECTS)');
divider();

const completedProjects = projects.filter(p => p.status === 'COMPLETED');
const openProjects = projects.filter(p => p.status === 'OPEN');
const inProgressProjects = projects.filter(p => p.status === 'IN_PROGRESS');

const getUserName = (id) => {
  const found = users.find(u => u._id === id);
  return found ? `${found.name} (${found.email})` : id;
};

// 3.1 Completed
line();
line(`3.1 COMPLETED PROJECTS (${completedProjects.length} Projects with Showcases)`);
line('--------------------------------------------------------------------------------');
completedProjects.forEach((p, i) => {
  line(`[PROJECT #${i+1}] ${p.title}`);
  line(`  Status:       ${p.status} (Finished, published as Showcase)`);
  line(`  Category:     ${p.category}`);
  line(`  Difficulty:   ${p.difficulty}`);
  line(`  Owner:        ${getUserName(p.ownerId)}`);
  line(`  Team Size:    ${p.memberIds.length} / ${p.teamSize} members`);
  line(`  Members:      ${p.memberIds.map(getUserName).join('; ')}`);
  line(`  Tech Skills:  ${p.requiredSkills.join(', ')}`);
  line(`  Repository:   ${p.repositoryUrl || 'N/A'}`);
  line(`  Description:  ${p.description}`);
  line(`  ID:           ${p._id}`);
  line();
});

// 3.2 Open
line();
line(`3.2 OPEN PROJECTS (${openProjects.length} Projects Seeking Teammates)`);
line('--------------------------------------------------------------------------------');
openProjects.forEach((p, i) => {
  line(`[PROJECT #${i+1}] ${p.title}`);
  line(`  Status:       ${p.status} (Open for collaboration requests)`);
  line(`  Category:     ${p.category}`);
  line(`  Difficulty:   ${p.difficulty}`);
  line(`  Owner:        ${getUserName(p.ownerId)}`);
  line(`  Team Size:    ${p.memberIds.length} / ${p.teamSize} members`);
  line(`  Needed Skills:${p.requiredSkills.join(', ')}`);
  line(`  Deadline:     ${new Date(p.deadline).toISOString().split('T')[0]}`);
  line(`  Repository:   ${p.repositoryUrl || 'N/A'}`);
  line(`  Description:  ${p.description}`);
  line(`  ID:           ${p._id}`);
  line();
});

// 3.3 In Progress
line();
line(`3.3 IN-PROGRESS PROJECTS (${inProgressProjects.length} Active Team Sprints)`);
line('--------------------------------------------------------------------------------');
inProgressProjects.forEach((p, i) => {
  line(`[PROJECT #${i+1}] ${p.title}`);
  line(`  Status:       ${p.status} (Team formed, active development)`);
  line(`  Category:     ${p.category}`);
  line(`  Difficulty:   ${p.difficulty}`);
  line(`  Owner:        ${getUserName(p.ownerId)}`);
  line(`  Team Size:    ${p.memberIds.length} / ${p.teamSize} members`);
  line(`  Members:      ${p.memberIds.map(getUserName).join('; ')}`);
  line(`  Tech Skills:  ${p.requiredSkills.join(', ')}`);
  line(`  Deadline:     ${new Date(p.deadline).toISOString().split('T')[0]}`);
  line(`  Repository:   ${p.repositoryUrl || 'N/A'}`);
  line(`  Description:  ${p.description}`);
  line(`  ID:           ${p._id}`);
  line();
});

// ----------------------------------------------------
// Section 4: Showcases
// ----------------------------------------------------
divider();
line('4. PUBLISHED SHOWCASES (5 FEATURED)');
divider();
showcases.forEach((sc, i) => {
  const proj = projects.find(p => p._id === sc.projectId);
  line(`[SHOWCASE #${i+1}] ${sc.title}`);
  line(`  Project:      ${proj ? proj.title : sc.projectId}`);
  line(`  Technologies: ${sc.technologies.join(', ')}`);
  line(`  GitHub Repo:  ${sc.githubUrl}`);
  line(`  Live Demo:    ${sc.liveDemoUrl}`);
  line(`  Likes Count:  ${sc.likes.length} likes`);
  line(`  Comments:     ${sc.comments.length} comments`);
  sc.comments.forEach(c => {
    line(`    - ${getUserName(c.userId)}: "${c.text}"`);
  });
  line(`  Description:  ${sc.description}`);
  line(`  ID:           ${sc._id}`);
  line();
});

// ----------------------------------------------------
// Section 5: Tasks
// ----------------------------------------------------
divider();
line('5. WORKSPACE TASK BOARDS');
divider();
tasks.forEach((t, i) => {
  const proj = projects.find(p => p._id === t.projectId);
  line(`[TASK #${i+1}] ${t.title}`);
  line(`  Project:     ${proj ? proj.title : t.projectId}`);
  line(`  Status:      ${t.status}`);
  line(`  Assigned To: ${t.assignedTo ? getUserName(t.assignedTo) : 'Unassigned'}`);
  line(`  Due Date:    ${t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : 'None'}`);
  line(`  Details:     ${t.description}`);
  line();
});

// ----------------------------------------------------
// Section 6: Collaboration Requests
// ----------------------------------------------------
divider();
line('6. SAMPLE COLLABORATION REQUESTS');
divider();
requests.forEach((r, i) => {
  const proj = projects.find(p => p._id === r.projectId);
  line(`[REQUEST #${i+1}] From: ${getUserName(r.senderId)}`);
  line(`  To Project:  ${proj ? proj.title : r.projectId}`);
  line(`  Status:      ${r.status}`);
  line(`  Message:     "${r.message}"`);
  line();
});

divider();
line('End of Directory. Generated for CollabSphere.');
divider();

fs.writeFileSync(path.join(__dirname, '../../docs/DATABASE_ACCOUNTS_AND_PROJECTS.txt'), txt, 'utf8');
console.log('Successfully wrote docs/DATABASE_ACCOUNTS_AND_PROJECTS.txt');
