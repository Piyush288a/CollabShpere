/**
 * CollabSphere Production Seeder & Data Aligner (v2)
 *
 * Features:
 * - 35 realistic student + admin profiles with active @gmail.com addresses
 * - 32 diverse projects with authentic open-source references & GitHub repositories
 * - 40+ collaboration requests (synced memberIds)
 * - 55+ workspace tasks (TODO / IN_PROGRESS / COMPLETED)
 * - 70+ team chat messages
 * - 12 completed showcases with community likes and embedded feedback comments
 * - 6 moderation reports for admin testing
 * - Non-destructive upsert mode: Preserves all live user accounts and user-created projects!
 *
 * Usage:
 *   node backend/seeders/seed-production-v2.js [--wipe]
 */
require('dotenv').config({ path: __dirname + '/../.env' });
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const mongoose = require('mongoose');

const User = require('../models/User');
const Project = require('../models/Project');
const CollaborationRequest = require('../models/CollaborationRequest');
const Task = require('../models/Task');
const Message = require('../models/Message');
const Showcase = require('../models/Showcase');
const Report = require('../models/Report');

// Standard shared testing password: "securepassword123"
const BCRYPT_HASH = '$2a$10$YPs5HIMt..t.piEGNAwhwuNoLtOkcKZ6.qncrZcjs8Chx7pZvBOaC';

const oid = (n) => new mongoose.Types.ObjectId(n.toString().padStart(24, '0'));

// ----------------------------------------------------
// 1. Users (35 Student + 2 Admin Accounts)
// ----------------------------------------------------
const usersData = [
  {
    _id: oid('650000000000000000000001'),
    name: 'Aarav Sharma',
    email: 'admin.collabsphere@gmail.com',
    password: BCRYPT_HASH,
    role: 'admin',
    status: 'active',
    skills: ['Platform Administration', 'Cybersecurity', 'Moderation'],
    bio: 'Lead Administrator at CollabSphere. Overseeing university innovation safety and campus projects.',
    githubUrl: 'https://github.com/aarav-sharma-admin',
    linkedinUrl: 'https://linkedin.com/in/aarav-sharma-admin',
  },
  {
    _id: oid('650000000000000000000002'),
    name: 'Priya Patel',
    email: 'priya.patel.dev@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    bio: 'Full-stack engineering student from Ahmedabad. Focused on agricultural technology and local civic tools.',
    githubUrl: 'https://github.com/priya-patel-dev',
    linkedinUrl: 'https://linkedin.com/in/priyapatel-ce',
  },
  {
    _id: oid('650000000000000000000003'),
    name: 'Rohan Iyer',
    email: 'rohan.iyer.tech@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Python', 'PyTorch', 'FastAPI', 'OpenCV'],
    bio: 'AI researcher and undergrad in Bengaluru. Building ML diagnostics for public health and crop analysis.',
    githubUrl: 'https://github.com/rohan-iyer-ai',
    linkedinUrl: 'https://linkedin.com/in/rohaniyer-ai',
  },
  {
    _id: oid('650000000000000000000004'),
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh.ui@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Flutter', 'Dart', 'Figma', 'Firebase'],
    bio: 'Mobile architect and UI designer from Pune. Designing accessible educational applications.',
    githubUrl: 'https://github.com/ananya-deshmukh',
    linkedinUrl: 'https://linkedin.com/in/ananya-deshmukh-pune',
  },
  {
    _id: oid('650000000000000000000005'),
    name: 'Vikram Reddy',
    email: 'vikram.reddy.cloud@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Go', 'Docker', 'Kubernetes', 'PostgreSQL'],
    bio: 'Backend & Cloud enthusiast from Hyderabad. Developing microservices and civic reporting platforms.',
    githubUrl: 'https://github.com/vikram-reddy-dev',
    linkedinUrl: 'https://linkedin.com/in/vikram-reddy-hyd',
  },
  {
    _id: oid('650000000000000000000006'),
    name: 'Kavya Nair',
    email: 'kavya.nair.foss@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['IoT', 'Embedded C', 'Python', 'MQTT'],
    bio: 'Hardware hacker and IoT systems builder from Kochi. Passionate about green energy and clean water sensors.',
    githubUrl: 'https://github.com/kavya-nair-iot',
    linkedinUrl: 'https://linkedin.com/in/kavya-nair-kochi',
  },
  {
    _id: oid('650000000000000000000007'),
    name: 'Aditya Banerjee',
    email: 'aditya.banerjee.fullstack@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Next.js', 'TypeScript', 'GraphQL', 'Express'],
    bio: 'Web engineer from Kolkata. Building developer ecosystems and open-source collaboration tools.',
    githubUrl: 'https://github.com/aditya-banerjee-web',
    linkedinUrl: 'https://linkedin.com/in/aditya-banerjee-kolkata',
  },
  {
    _id: oid('650000000000000000000008'),
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni.systems@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Rust', 'WebAssembly', 'Distributed Systems'],
    bio: 'Systems programming student in Mumbai. Optimizing network throughput and low-latency databases.',
    githubUrl: 'https://github.com/sneha-kulkarni-rust',
    linkedinUrl: 'https://linkedin.com/in/sneha-kulkarni-mumbai',
  },
  {
    _id: oid('650000000000000000000009'),
    name: 'Meera Joshi',
    email: 'meera.joshi.ml@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['NLP', 'Transformers', 'HuggingFace', 'Python'],
    bio: 'Natural Language Processing enthusiast from Indore. Working on Indic translation models.',
    githubUrl: 'https://github.com/meera-joshi-nlp',
    linkedinUrl: 'https://linkedin.com/in/meera-joshi-indore',
  },
  {
    _id: oid('650000000000000000000010'),
    name: 'Neha Gupta',
    email: 'neha.gupta.devops@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Terraform', 'AWS', 'CI/CD', 'Prometheus'],
    bio: 'Cloud and site reliability engineering intern from Jaipur. Championing automated testing and pipelines.',
    githubUrl: 'https://github.com/neha-gupta-cloud',
    linkedinUrl: 'https://linkedin.com/in/neha-gupta-jaipur',
  },
  {
    _id: oid('650000000000000000000011'),
    name: 'Kabir Mehta',
    email: 'kabir.mehta.web3@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Solidity', 'Ethereum', 'Web3.js', 'React'],
    bio: 'Decentralized systems builder from Chandigarh. Exploring verifiable micro-credentials for students.',
    githubUrl: 'https://github.com/kabir-mehta-web3',
    linkedinUrl: 'https://linkedin.com/in/kabir-mehta-chd',
  },
  {
    _id: oid('650000000000000000000012'),
    name: 'Tanya Verma',
    email: 'tanya.verma.security@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Penetration Testing', 'OWASP', 'Linux', 'Python'],
    bio: 'Cybersecurity student from Lucknow. Active bug bounty hunter and CTF player.',
    githubUrl: 'https://github.com/tanya-verma-sec',
    linkedinUrl: 'https://linkedin.com/in/tanya-verma-lko',
  },
  {
    _id: oid('650000000000000000000013'),
    name: 'Rahul Singh',
    email: 'rahul.singh.mobile@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['React Native', 'Kotlin', 'Redux', 'SQLite'],
    bio: 'Cross-platform mobile developer from Patna. Building offline-first tools for rural areas.',
    githubUrl: 'https://github.com/rahul-singh-native',
    linkedinUrl: 'https://linkedin.com/in/rahul-singh-patna',
  },
  {
    _id: oid('650000000000000000000014'),
    name: 'Diya Sharma',
    email: 'diya.sharma.iot@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Arduino', 'Raspberry Pi', 'C++', 'Circuit Design'],
    bio: 'Electronics and Communication student from Bhopal. Prototyping smart campus traffic systems.',
    githubUrl: 'https://github.com/diya-sharma-embed',
    linkedinUrl: 'https://linkedin.com/in/diya-sharma-bhopal',
  },
  {
    _id: oid('650000000000000000000015'),
    name: 'Arjun Nair',
    email: 'arjun.nair.ai@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Computer Vision', 'YOLO', 'OpenCV', 'FastAPI'],
    bio: 'Machine Vision researcher from Thiruvananthapuram. Specializing in autonomous navigation systems.',
    githubUrl: 'https://github.com/arjun-nair-vision',
    linkedinUrl: 'https://linkedin.com/in/arjun-nair-tvm',
  },
  {
    _id: oid('650000000000000000000016'),
    name: 'Pooja Patil',
    email: 'pooja.patil.data@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['SQL', 'Tableau', 'Pandas', 'PowerBI'],
    bio: 'Data analytics student from Nagpur. Uncovering insights in civic governance and transit.',
    githubUrl: 'https://github.com/pooja-patil-analytics',
    linkedinUrl: 'https://linkedin.com/in/pooja-patil-nagpur',
  },
  {
    _id: oid('650000000000000000000017'),
    name: 'Rishabh Jain',
    email: 'rishabh.jain.frontend@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Vue.js', 'Tailwind CSS', 'Svelte', 'JavaScript'],
    bio: 'Creative frontend developer from Surat. Dedicated to buttery-smooth web animations and micro-interactions.',
    githubUrl: 'https://github.com/rishabh-jain-ui',
    linkedinUrl: 'https://linkedin.com/in/rishabh-jain-surat',
  },
  {
    _id: oid('650000000000000000000018'),
    name: 'Ishita Sen',
    email: 'ishita.sen.design@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['UI/UX Design', 'Design Systems', 'Figma', 'Prototyping'],
    bio: 'Product designer from Kolkata. Passionate about user empathy, accessibility, and high-fidelity prototypes.',
    githubUrl: 'https://github.com/ishita-sen-ux',
    linkedinUrl: 'https://linkedin.com/in/ishita-sen-design',
  },
  {
    _id: oid('650000000000000000000019'),
    name: 'Varun Chopra',
    email: 'varun.chopra.backend@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Java', 'Spring Boot', 'Kafka', 'Redis'],
    bio: 'Enterprise backend developer from Delhi. Building resilient, high-throughput payment pipelines.',
    githubUrl: 'https://github.com/varun-chopra-dev',
    linkedinUrl: 'https://linkedin.com/in/varun-chopra-delhi',
  },
  {
    _id: oid('650000000000000000000020'),
    name: 'Khushi Kapoor',
    email: 'khushi.kapoor.cloud@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Azure', 'DevOps', 'Docker', 'Python'],
    bio: 'Cloud architecture enthusiast from Amritsar. Helping student startups migrate to cloud infra.',
    githubUrl: 'https://github.com/khushi-kapoor-cloud',
    linkedinUrl: 'https://linkedin.com/in/khushi-kapoor-amritsar',
  },
  {
    _id: oid('650000000000000000000021'),
    name: 'Dev Sharma',
    email: 'dev.sharma.ai@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Reinforcement Learning', 'Python', 'Gymnasium', 'NumPy'],
    bio: 'Autonomous systems and game AI developer from Dehradun.',
    githubUrl: 'https://github.com/dev-sharma-rl',
    linkedinUrl: 'https://linkedin.com/in/dev-sharma-dehradun',
  },
  {
    _id: oid('650000000000000000000022'),
    name: 'Simran Kaur',
    email: 'simran.kaur.mobile@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Swift', 'iOS Development', 'CoreData', 'Combine'],
    bio: 'Native iOS developer from Ludhiana. Crafting sleek utility apps for university students.',
    githubUrl: 'https://github.com/simran-kaur-ios',
    linkedinUrl: 'https://linkedin.com/in/simran-kaur-ldh',
  },
  {
    _id: oid('650000000000000000000023'),
    name: 'Manish Tiwari',
    email: 'manish.tiwari.infra@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Linux Kernel', 'Bash Scripting', 'C', 'Networking'],
    bio: 'Infrastructure and Linux internals geek from Varanasi.',
    githubUrl: 'https://github.com/manish-tiwari-infra',
    linkedinUrl: 'https://linkedin.com/in/manish-tiwari-varanasi',
  },
  {
    _id: oid('650000000000000000000024'),
    name: 'Swati Mishra',
    email: 'swati.mishra.nlp@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Speech Recognition', 'Whisper', 'Python', 'Audio Processing'],
    bio: 'Speech synthesis and acoustic modeling researcher from Bhubaneswar.',
    githubUrl: 'https://github.com/swati-mishra-speech',
    linkedinUrl: 'https://linkedin.com/in/swati-mishra-bbsr',
  },
  {
    _id: oid('650000000000000000000025'),
    name: 'Harsh Vardhan',
    email: 'harsh.vardhan.crypto@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Zero Knowledge Proofs', 'Cryptography', 'Rust', 'Go'],
    bio: 'Applied cryptography enthusiast from Vadodara. Researching privacy-preserving verifiable computation.',
    githubUrl: 'https://github.com/harsh-vardhan-crypto',
    linkedinUrl: 'https://linkedin.com/in/harsh-vardhan-vadodara',
  },
  {
    _id: oid('650000000000000000000026'),
    name: 'Kriti Bhatia',
    email: 'kriti.bhatia.fullstack@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Angular', 'Node.js', 'RxJS', 'Tailwind CSS'],
    bio: 'Frontend architect from Gurgaon. Passionate about performant enterprise web clients.',
    githubUrl: 'https://github.com/kriti-bhatia-dev',
    linkedinUrl: 'https://linkedin.com/in/kriti-bhatia-gurgaon',
  },
  {
    _id: oid('650000000000000000000027'),
    name: 'Yash Goyal',
    email: 'yash.goyal.security@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Malware Analysis', 'Reverse Engineering', 'Ghidra', 'C++'],
    bio: 'Security researcher from Noida. Breaking binaries and hardening software.',
    githubUrl: 'https://github.com/yash-goyal-sec',
    linkedinUrl: 'https://linkedin.com/in/yash-goyal-noida',
  },
  {
    _id: oid('650000000000000000000028'),
    name: 'Aditi Saxena',
    email: 'aditi.saxena.health@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Bioinformatics', 'Python', 'Biopython', 'R'],
    bio: 'Computational biology and genomics student from Mysore.',
    githubUrl: 'https://github.com/aditi-saxena-bio',
    linkedinUrl: 'https://linkedin.com/in/aditi-saxena-mysore',
  },
  {
    _id: oid('650000000000000000000029'),
    name: 'Siddharth Rao',
    email: 'siddharth.rao.dev@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Elixir', 'Phoenix LiveView', 'WebSockets', 'PostgreSQL'],
    bio: 'Real-time collaborative application enthusiast from Mangalore.',
    githubUrl: 'https://github.com/siddharth-rao-dev',
    linkedinUrl: 'https://linkedin.com/in/siddharth-rao-mgl',
  },
  {
    _id: oid('650000000000000000000030'),
    name: 'Bhavya Shroff',
    email: 'bhavya.shroff.ui@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Three.js', 'WebGL', 'React Three Fiber', 'GLSL'],
    bio: 'Creative technologist and 3D web developer from Rajkot.',
    githubUrl: 'https://github.com/bhavya-shroff-3d',
    linkedinUrl: 'https://linkedin.com/in/bhavya-shroff-rajkot',
  },
  {
    _id: oid('650000000000000000000031'),
    name: 'Pranav Kulkarni',
    email: 'pranav.kulkarni.embedded@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['ESP32', 'FreeRTOS', 'BLE', 'Firmware'],
    bio: 'Embedded firmware developer from Nashik. Building smart campus energy metering boards.',
    githubUrl: 'https://github.com/pranav-kulkarni-embed',
    linkedinUrl: 'https://linkedin.com/in/pranav-kulkarni-nsk',
  },
  {
    _id: oid('650000000000000000000032'),
    name: 'Tanvi Shukla',
    email: 'tanvi.shukla.green@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['GIS', 'Remote Sensing', 'Python', 'QGIS'],
    bio: 'Environmental informatics researcher from Jabalpur. Mapping urban heat islands and tree cover.',
    githubUrl: 'https://github.com/tanvi-shukla-gis',
    linkedinUrl: 'https://linkedin.com/in/tanvi-shukla-jabalpur',
  },
  {
    _id: oid('650000000000000000000033'),
    name: 'Ayush Trivedi',
    email: 'ayush.trivedi.cloud@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['Go', 'Microservices', 'gRPC', 'PostgreSQL'],
    bio: 'Distributed backend developer from Kanpur. Creating low-overhead developer CLI suites.',
    githubUrl: 'https://github.com/ayush-trivedi-go',
    linkedinUrl: 'https://linkedin.com/in/ayush-trivedi-kanpur',
  },
  {
    _id: oid('650000000000000000000034'),
    name: 'Ria Mathur',
    email: 'ria.mathur.fintech@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'active',
    skills: ['UPI Integration', 'React', 'FastAPI', 'Financial Data'],
    bio: 'Fintech enthusiast from Udaipur. Creating automated budget management tools for college hostels.',
    githubUrl: 'https://github.com/ria-mathur-fintech',
    linkedinUrl: 'https://linkedin.com/in/ria-mathur-udaipur',
  },
  {
    _id: oid('650000000000000000000035'),
    name: 'Saurabh Agarwal',
    email: 'saurabh.agarwal.mod@gmail.com',
    password: BCRYPT_HASH,
    role: 'student',
    status: 'suspended',
    skills: ['Web Scraping', 'Python'],
    bio: 'Account currently suspended pending administrative conduct review.',
    githubUrl: 'https://github.com/saurabh-a-suspended',
    linkedinUrl: 'https://linkedin.com/in/saurabh-agarwal-knp',
  },
];

// Helper to lookup user by email
const userMap = {};
usersData.forEach((u) => {
  userMap[u.email] = u._id;
});

// ----------------------------------------------------
// 2. Projects (32 Realistic Projects across 8 Domains)
// ----------------------------------------------------
const projectsData = [
  // --- COMPLETED (12) ---
  {
    _id: oid('650000000000000000000101'),
    title: 'KisanVani — Voice-First Agritech Advisory',
    description: 'An AI-powered vernacular voice advisory system that provides rural farmers with real-time mandi prices, hyper-local weather alerts, and pest outbreak countermeasures in multiple Indian regional dialects.',
    category: 'Artificial Intelligence',
    difficulty: 'Advanced',
    requiredSkills: ['Python', 'FastAPI', 'Speech-to-Text', 'React'],
    teamSize: 4,
    deadline: new Date('2026-06-15'),
    status: 'COMPLETED',
    ownerId: userMap['priya.patel.dev@gmail.com'],
    memberIds: [
      userMap['priya.patel.dev@gmail.com'],
      userMap['aditya.banerjee.fullstack@gmail.com'],
      userMap['swati.mishra.nlp@gmail.com'],
    ],
    repositoryUrl: 'https://github.com/frappe/frappe',
    bookmarkedBy: [userMap['rohan.iyer.tech@gmail.com'], userMap['ananya.deshmukh.ui@gmail.com']],
  },
  {
    _id: oid('650000000000000000000102'),
    title: 'SwasthyaConnect — Rural Health Camp Queue & Triage',
    description: 'Offline-first electronic health records and token generation system for community medical outreach camps, allowing primary health centers to coordinate patient records without steady internet.',
    category: 'Healthcare',
    difficulty: 'Intermediate',
    requiredSkills: ['React', 'Node.js', 'PWA', 'IndexedDB'],
    teamSize: 3,
    deadline: new Date('2026-07-20'),
    status: 'COMPLETED',
    ownerId: userMap['rohan.iyer.tech@gmail.com'],
    memberIds: [userMap['rohan.iyer.tech@gmail.com'], userMap['sneha.kulkarni.systems@gmail.com']],
    repositoryUrl: 'https://github.com/appsmithorg/appsmith',
    bookmarkedBy: [userMap['priya.patel.dev@gmail.com'], userMap['aditi.saxena.health@gmail.com']],
  },
  {
    _id: oid('650000000000000000000103'),
    title: 'ShikshaSetu — Low-Bandwidth Digital Classroom',
    description: 'Lightweight interactive learning portal delivering multimedia lesson modules and assessments to low-bandwidth mobile browsers over 2G/3G campus connections.',
    category: 'Web Development',
    difficulty: 'Intermediate',
    requiredSkills: ['Flutter', 'Firebase', 'Offline Sync'],
    teamSize: 4,
    deadline: new Date('2026-08-10'),
    status: 'COMPLETED',
    ownerId: userMap['ananya.deshmukh.ui@gmail.com'],
    memberIds: [userMap['ananya.deshmukh.ui@gmail.com'], userMap['rahul.singh.mobile@gmail.com']],
    repositoryUrl: 'https://github.com/fossunited/fossunited',
    bookmarkedBy: [userMap['meera.joshi.ml@gmail.com']],
  },
  {
    _id: oid('650000000000000000000104'),
    title: 'NagarSeva — Community Civic Issue Reporting Portal',
    description: 'Municipal grievance management platform with geolocation tagging, automated duplicate report merging, and transparent ticket escalation timelines for university wards.',
    category: 'Civic Tech',
    difficulty: 'Intermediate',
    requiredSkills: ['Go', 'PostgreSQL', 'Docker', 'React'],
    teamSize: 3,
    deadline: new Date('2026-08-30'),
    status: 'COMPLETED',
    ownerId: userMap['vikram.reddy.cloud@gmail.com'],
    memberIds: [userMap['vikram.reddy.cloud@gmail.com'], userMap['pooja.patil.data@gmail.com']],
    repositoryUrl: 'https://github.com/chatwoot/chatwoot',
    bookmarkedBy: [userMap['varun.chopra.backend@gmail.com']],
  },
  {
    _id: oid('650000000000000000000105'),
    title: 'UrjaDrishti — Campus Solar Grid Telemetry',
    description: 'Real-time telemetry and predictive maintenance dashboard for university solar panel arrays, tracking live generation, battery charge levels, and inverter efficiency.',
    category: 'IoT & Hardware',
    difficulty: 'Advanced',
    requiredSkills: ['IoT', 'MQTT', 'Python', 'TimescaleDB', 'React'],
    teamSize: 4,
    deadline: new Date('2026-09-05'),
    status: 'COMPLETED',
    ownerId: userMap['kavya.nair.foss@gmail.com'],
    memberIds: [userMap['kavya.nair.foss@gmail.com'], userMap['pranav.kulkarni.embedded@gmail.com']],
    repositoryUrl: 'https://github.com/hoppscotch/hoppscotch',
    bookmarkedBy: [userMap['tanvi.shukla.green@gmail.com']],
  },
  {
    _id: oid('650000000000000000000106'),
    title: 'UPI-Khata — Shared Hostel Expense Settler',
    description: 'Automated expense-splitting Progressive Web App integrating instant UPI deep-linking, receipt OCR scanning, and optimized settlement graphs for student roommates.',
    category: 'Fintech',
    difficulty: 'Intermediate',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'UPI API'],
    teamSize: 3,
    deadline: new Date('2026-09-18'),
    status: 'COMPLETED',
    ownerId: userMap['priya.patel.dev@gmail.com'],
    memberIds: [userMap['priya.patel.dev@gmail.com'], userMap['ria.mathur.fintech@gmail.com']],
    repositoryUrl: 'https://github.com/calcom/cal.com',
    bookmarkedBy: [userMap['varun.chopra.backend@gmail.com']],
  },
  {
    _id: oid('650000000000000000000107'),
    title: 'DevStack-CLI — Developer Environment Provisioner',
    description: 'Cross-platform command-line tool that auto-configures containerized database environments, seeded test schemas, and linting suites for student hackathons in under 60 seconds.',
    category: 'Cloud & DevOps',
    difficulty: 'Intermediate',
    requiredSkills: ['Go', 'Docker API', 'CLI', 'YAML'],
    teamSize: 2,
    deadline: new Date('2026-09-25'),
    status: 'COMPLETED',
    ownerId: userMap['vikram.reddy.cloud@gmail.com'],
    memberIds: [userMap['vikram.reddy.cloud@gmail.com'], userMap['ayush.trivedi.cloud@gmail.com']],
    repositoryUrl: 'https://github.com/supabase/supabase',
    bookmarkedBy: [userMap['neha.gupta.devops@gmail.com']],
  },
  {
    _id: oid('650000000000000000000108'),
    title: 'DrishtiAccessibility — Screen Reader for Indic Web',
    description: 'High-contrast accessible browser extension optimizing university course portals for visually impaired students using speech feedback and screen navigation hotkeys.',
    category: 'Web Development',
    difficulty: 'Intermediate',
    requiredSkills: ['JavaScript', 'Web Speech API', 'ARIA', 'CSS'],
    teamSize: 3,
    deadline: new Date('2026-10-01'),
    status: 'COMPLETED',
    ownerId: userMap['ananya.deshmukh.ui@gmail.com'],
    memberIds: [userMap['ananya.deshmukh.ui@gmail.com'], userMap['ishita.sen.design@gmail.com']],
    repositoryUrl: 'https://github.com/excalidraw/excalidraw',
    bookmarkedBy: [userMap['rishabh.jain.frontend@gmail.com']],
  },
  {
    _id: oid('650000000000000000000109'),
    title: 'BhashaTranslate — Indic Technical Term Translator',
    description: 'Fine-tuned multilingual translation utility for converting engineering textbooks and programming terms into Hindi, Marathi, Bengali, and Tamil.',
    category: 'Artificial Intelligence',
    difficulty: 'Advanced',
    requiredSkills: ['NLP', 'HuggingFace', 'Transformers', 'FastAPI'],
    teamSize: 3,
    deadline: new Date('2026-10-10'),
    status: 'COMPLETED',
    ownerId: userMap['rohan.iyer.tech@gmail.com'],
    memberIds: [userMap['rohan.iyer.tech@gmail.com'], userMap['meera.joshi.ml@gmail.com']],
    repositoryUrl: 'https://github.com/fossunited/fossunited',
    bookmarkedBy: [userMap['priya.patel.dev@gmail.com']],
  },
  {
    _id: oid('650000000000000000000110'),
    title: 'AaharShare — Campus Food Surplus Redistribution',
    description: 'Real-time alert portal linking student hostel mess halls with certified local shelters to distribute unconsumed edible meals before expiry.',
    category: 'Sustainability',
    difficulty: 'Beginner',
    requiredSkills: ['React', 'Express', 'MongoDB', 'SMS API'],
    teamSize: 3,
    deadline: new Date('2026-10-15'),
    status: 'COMPLETED',
    ownerId: userMap['kavya.nair.foss@gmail.com'],
    memberIds: [userMap['kavya.nair.foss@gmail.com'], userMap['tanvi.shukla.green@gmail.com']],
    repositoryUrl: 'https://github.com/chatwoot/chatwoot',
    bookmarkedBy: [userMap['priya.patel.dev@gmail.com']],
  },
  {
    _id: oid('650000000000000000000111'),
    title: 'JalSuraksha — Smart Campus Water Quality Monitor',
    description: 'Multi-parameter sensory array streaming pH, turbidity, TDS, and chlorine metrics from campus drinking fountains to student dashboards.',
    category: 'IoT & Hardware',
    difficulty: 'Intermediate',
    requiredSkills: ['C++', 'ESP32', 'Node.js', 'WebSockets'],
    teamSize: 3,
    deadline: new Date('2026-10-20'),
    status: 'COMPLETED',
    ownerId: userMap['kavya.nair.foss@gmail.com'],
    memberIds: [userMap['kavya.nair.foss@gmail.com'], userMap['pranav.kulkarni.embedded@gmail.com']],
    repositoryUrl: 'https://github.com/hoppscotch/hoppscotch',
    bookmarkedBy: [userMap['diya.sharma.iot@gmail.com']],
  },
  {
    _id: oid('650000000000000000000112'),
    title: 'ZeroTrustAuth — Microservice Mesh Gateway',
    description: 'Lightweight reverse proxy and cryptographic session broker verifying token authenticity and role authorizations across student cloud services.',
    category: 'Cybersecurity',
    difficulty: 'Advanced',
    requiredSkills: ['Go', 'JWT', 'mTLS', 'Redis'],
    teamSize: 3,
    deadline: new Date('2026-10-25'),
    status: 'COMPLETED',
    ownerId: userMap['tanya.verma.security@gmail.com'],
    memberIds: [userMap['tanya.verma.security@gmail.com'], userMap['yash.goyal.security@gmail.com']],
    repositoryUrl: 'https://github.com/supabase/supabase',
    bookmarkedBy: [userMap['vikram.reddy.cloud@gmail.com']],
  },

  // --- OPEN PROJECTS (12) ---
  {
    _id: oid('650000000000000000000113'),
    title: 'VidyaVishwa — Peer Tutoring & Note Marketplace',
    description: 'Student-to-student micro-tutoring schedule exchange and verified course summary repository with upvoting and moderation.',
    category: 'Web Development',
    difficulty: 'Intermediate',
    requiredSkills: ['Next.js', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    teamSize: 4,
    deadline: new Date('2026-12-15'),
    status: 'OPEN',
    ownerId: userMap['priya.patel.dev@gmail.com'],
    memberIds: [userMap['priya.patel.dev@gmail.com']],
    repositoryUrl: 'https://github.com/priya-patel-dev/vidya-vishwa',
    bookmarkedBy: [userMap['meera.joshi.ml@gmail.com'], userMap['aditya.banerjee.fullstack@gmail.com']],
  },
  {
    _id: oid('650000000000000000000114'),
    title: 'CropShield — Vision-Based Early Leaf Disease Identifier',
    description: 'Edge-optimized computer vision model classifying fungal and bacterial crop leaf blights from smartphone camera captures in sub-second response times.',
    category: 'Artificial Intelligence',
    difficulty: 'Advanced',
    requiredSkills: ['PyTorch', 'TensorFlow Lite', 'OpenCV', 'Android'],
    teamSize: 4,
    deadline: new Date('2026-12-20'),
    status: 'OPEN',
    ownerId: userMap['rohan.iyer.tech@gmail.com'],
    memberIds: [userMap['rohan.iyer.tech@gmail.com']],
    repositoryUrl: 'https://github.com/rohan-iyer-ai/crop-shield',
    bookmarkedBy: [userMap['arjun.nair.ai@gmail.com']],
  },
  {
    _id: oid('650000000000000000000115'),
    title: 'CampusPool — Verified Student Ride Sharing',
    description: 'Verified student carpooling and two-wheeler ride sharing platform strictly for university email holders with emergency SOS features.',
    category: 'Mobile Apps',
    difficulty: 'Intermediate',
    requiredSkills: ['Flutter', 'Google Maps API', 'Firebase', 'State Management'],
    teamSize: 4,
    deadline: new Date('2026-12-25'),
    status: 'OPEN',
    ownerId: userMap['ananya.deshmukh.ui@gmail.com'],
    memberIds: [userMap['ananya.deshmukh.ui@gmail.com']],
    repositoryUrl: 'https://github.com/ananya-deshmukh/campus-pool',
    bookmarkedBy: [userMap['simran.kaur.mobile@gmail.com']],
  },
  {
    _id: oid('650000000000000000000116'),
    title: 'PaySathi — Micro-Merchant Tap-to-Phone Payment Gateway',
    description: 'NFC-powered student payment receiver enabling campus clubs and flea markets to accept quick student card taps without dedicated POS hardware.',
    category: 'Fintech',
    difficulty: 'Advanced',
    requiredSkills: ['Kotlin', 'NFC', 'Cryptography', 'Node.js'],
    teamSize: 3,
    deadline: new Date('2026-12-30'),
    status: 'OPEN',
    ownerId: userMap['vikram.reddy.cloud@gmail.com'],
    memberIds: [userMap['vikram.reddy.cloud@gmail.com']],
    repositoryUrl: 'https://github.com/vikram-reddy-dev/pay-sathi',
    bookmarkedBy: [userMap['ria.mathur.fintech@gmail.com']],
  },
  {
    _id: oid('650000000000000000000117'),
    title: 'VayuWatch — Micro-Climate Air Quality Heatmap',
    description: 'Distributed low-cost PM2.5 and CO2 sensor nodes reporting real-time hyper-local air quality indices across university faculties.',
    category: 'Sustainability',
    difficulty: 'Intermediate',
    requiredSkills: ['IoT', 'Embedded C', 'Leaflet.js', 'Express'],
    teamSize: 4,
    deadline: new Date('2027-01-10'),
    status: 'OPEN',
    ownerId: userMap['kavya.nair.foss@gmail.com'],
    memberIds: [userMap['kavya.nair.foss@gmail.com']],
    repositoryUrl: 'https://github.com/kavya-nair-iot/vayu-watch',
    bookmarkedBy: [userMap['tanvi.shukla.green@gmail.com']],
  },
  {
    _id: oid('650000000000000000000118'),
    title: 'CodeSync — Browser Pair Programming IDE',
    description: 'Collaborative code editor supporting operational transformation, audio chat, syntax highlighting, and instant code execution containers.',
    category: 'Web Development',
    difficulty: 'Advanced',
    requiredSkills: ['WebSockets', 'WebRTC', 'Monaco Editor', 'Node.js'],
    teamSize: 4,
    deadline: new Date('2027-01-15'),
    status: 'OPEN',
    ownerId: userMap['aditya.banerjee.fullstack@gmail.com'],
    memberIds: [userMap['aditya.banerjee.fullstack@gmail.com']],
    repositoryUrl: 'https://github.com/aditya-banerjee-web/codesync',
    bookmarkedBy: [userMap['siddharth.rao.dev@gmail.com']],
  },
  {
    _id: oid('650000000000000000000119'),
    title: 'RustNet — Ultra-Fast Distributed Key-Value Store',
    description: 'Memory-safe, high-throughput in-memory caching server built in Rust with Raft consensus and asynchronous Tokio runtime.',
    category: 'Cloud & DevOps',
    difficulty: 'Advanced',
    requiredSkills: ['Rust', 'Tokio', 'Raft Protocol', 'Benchmarking'],
    teamSize: 3,
    deadline: new Date('2027-01-20'),
    status: 'OPEN',
    ownerId: userMap['sneha.kulkarni.systems@gmail.com'],
    memberIds: [userMap['sneha.kulkarni.systems@gmail.com']],
    repositoryUrl: 'https://github.com/sneha-kulkarni-rust/rustnet',
    bookmarkedBy: [userMap['varun.chopra.backend@gmail.com']],
  },
  {
    _id: oid('650000000000000000000120'),
    title: 'IndicNER — Named Entity Recognition for Indian Languages',
    description: 'Pretrained transformer representations tailored to parse Indian person names, locations, and government department references across 10 official languages.',
    category: 'Artificial Intelligence',
    difficulty: 'Advanced',
    requiredSkills: ['Python', 'Transformers', 'PyTorch', 'Data Scraping'],
    teamSize: 3,
    deadline: new Date('2027-01-25'),
    status: 'OPEN',
    ownerId: userMap['meera.joshi.ml@gmail.com'],
    memberIds: [userMap['meera.joshi.ml@gmail.com']],
    repositoryUrl: 'https://github.com/meera-joshi-nlp/indic-ner',
    bookmarkedBy: [userMap['rohan.iyer.tech@gmail.com']],
  },
  {
    _id: oid('650000000000000000000121'),
    title: 'KubeWatch — Lightweight Cluster Metrics Visualizer',
    description: 'Single-binary dashboard extracting pod resource utilization, crash-loop alerts, and memory trends with zero external agent overhead.',
    category: 'Cloud & DevOps',
    difficulty: 'Intermediate',
    requiredSkills: ['Go', 'Kubernetes Client', 'Vue.js', 'Docker'],
    teamSize: 3,
    deadline: new Date('2027-02-01'),
    status: 'OPEN',
    ownerId: userMap['neha.gupta.devops@gmail.com'],
    memberIds: [userMap['neha.gupta.devops@gmail.com']],
    repositoryUrl: 'https://github.com/neha-gupta-cloud/kubewatch',
    bookmarkedBy: [userMap['vikram.reddy.cloud@gmail.com']],
  },
  {
    _id: oid('650000000000000000000122'),
    title: 'UniCert — Verifiable Student Credentials on Chain',
    description: 'Decentralized university certificate issuance registry preventing resume fraud using cryptographic student identity proofs.',
    category: 'Fintech',
    difficulty: 'Advanced',
    requiredSkills: ['Solidity', 'Ethers.js', 'IPFS', 'React'],
    teamSize: 3,
    deadline: new Date('2027-02-05'),
    status: 'OPEN',
    ownerId: userMap['kabir.mehta.web3@gmail.com'],
    memberIds: [userMap['kabir.mehta.web3@gmail.com']],
    repositoryUrl: 'https://github.com/kabir-mehta-web3/unicert',
    bookmarkedBy: [userMap['harsh.vardhan.crypto@gmail.com']],
  },
  {
    _id: oid('650000000000000000000123'),
    title: 'SecScan — Automated Web Vulnerability Hunter',
    description: 'CLI security auditor probing student web applications for SQL injection, CSRF flaws, and misconfigured CORS headers with PDF remediation reports.',
    category: 'Cybersecurity',
    difficulty: 'Advanced',
    requiredSkills: ['Python', 'OWASP ZAP', 'Security Testing'],
    teamSize: 3,
    deadline: new Date('2027-02-10'),
    status: 'OPEN',
    ownerId: userMap['tanya.verma.security@gmail.com'],
    memberIds: [userMap['tanya.verma.security@gmail.com']],
    repositoryUrl: 'https://github.com/tanya-verma-sec/secscan',
    bookmarkedBy: [userMap['yash.goyal.security@gmail.com']],
  },
  {
    _id: oid('650000000000000000000124'),
    title: 'CareRoute — Emergency Blood Donor Notification Dispatcher',
    description: 'Geo-targeted emergency dispatcher connecting university donor networks with district hospitals during critical shortages.',
    category: 'Healthcare',
    difficulty: 'Intermediate',
    requiredSkills: ['React Native', 'Firebase Cloud Messaging', 'Geolocation'],
    teamSize: 4,
    deadline: new Date('2027-02-15'),
    status: 'OPEN',
    ownerId: userMap['rahul.singh.mobile@gmail.com'],
    memberIds: [userMap['rahul.singh.mobile@gmail.com']],
    repositoryUrl: 'https://github.com/rahul-singh-native/care-route',
    bookmarkedBy: [userMap['aditi.saxena.health@gmail.com']],
  },

  // --- IN_PROGRESS (8) ---
  {
    _id: oid('650000000000000000000125'),
    title: 'SmartHostel — Mess & Room Management Suite',
    description: 'Comprehensive digital hostel administration tool managing automated gate-passes, room allotment lottery, and mess rebate calculations.',
    category: 'Civic Tech',
    difficulty: 'Intermediate',
    requiredSkills: ['React', 'Express', 'PostgreSQL', 'Tailwind CSS'],
    teamSize: 4,
    deadline: new Date('2026-12-05'),
    status: 'IN_PROGRESS',
    ownerId: userMap['priya.patel.dev@gmail.com'],
    memberIds: [
      userMap['priya.patel.dev@gmail.com'],
      userMap['rishabh.jain.frontend@gmail.com'],
      userMap['varun.chopra.backend@gmail.com'],
    ],
    repositoryUrl: 'https://github.com/priya-patel-dev/smart-hostel',
    bookmarkedBy: [userMap['aditya.banerjee.fullstack@gmail.com']],
  },
  {
    _id: oid('650000000000000000000126'),
    title: 'MediVision — Chest X-Ray Pathology Screener',
    description: 'Deep convolutional neural network model providing preliminary triage heatmap annotations on anonymized digital radiograph files.',
    category: 'Healthcare',
    difficulty: 'Advanced',
    requiredSkills: ['PyTorch', 'DICOM Processing', 'FastAPI', 'Docker'],
    teamSize: 3,
    deadline: new Date('2026-12-10'),
    status: 'IN_PROGRESS',
    ownerId: userMap['rohan.iyer.tech@gmail.com'],
    memberIds: [userMap['rohan.iyer.tech@gmail.com'], userMap['arjun.nair.ai@gmail.com']],
    repositoryUrl: 'https://github.com/rohan-iyer-ai/medivision',
    bookmarkedBy: [userMap['aditi.saxena.health@gmail.com']],
  },
  {
    _id: oid('650000000000000000000127'),
    title: 'EcoSort — Smart Recycling Waste Bin AI',
    description: 'Edge-AI mounted bin camera classifying recyclable vs compostable waste and tracking hostel floor recycling streaks.',
    category: 'Sustainability',
    difficulty: 'Intermediate',
    requiredSkills: ['Raspberry Pi', 'TensorFlow Lite', 'Python', 'MQTT'],
    teamSize: 3,
    deadline: new Date('2026-12-12'),
    status: 'IN_PROGRESS',
    ownerId: userMap['kavya.nair.foss@gmail.com'],
    memberIds: [userMap['kavya.nair.foss@gmail.com'], userMap['diya.sharma.iot@gmail.com']],
    repositoryUrl: 'https://github.com/kavya-nair-iot/ecosort',
    bookmarkedBy: [userMap['tanvi.shukla.green@gmail.com']],
  },
  {
    _id: oid('650000000000000000000128'),
    title: 'PacketForge — Network Traffic Flow Analyzer',
    description: 'Packet capture visualizer highlighting unencrypted payload credentials and DNS query leaks across campus Wi-Fi networks.',
    category: 'Cybersecurity',
    difficulty: 'Advanced',
    requiredSkills: ['C++', 'PCAP', 'Qt', 'Networking'],
    teamSize: 3,
    deadline: new Date('2026-12-18'),
    status: 'IN_PROGRESS',
    ownerId: userMap['tanya.verma.security@gmail.com'],
    memberIds: [userMap['tanya.verma.security@gmail.com'], userMap['manish.tiwari.infra@gmail.com']],
    repositoryUrl: 'https://github.com/tanya-verma-sec/packetforge',
    bookmarkedBy: [userMap['yash.goyal.security@gmail.com']],
  },
  {
    _id: oid('650000000000000000000129'),
    title: 'EventPulse — Live Campus Hackathon Scoring Board',
    description: 'Real-time WebSocket score aggregator and live jury evaluation dashboard for inter-college hackathons and tech fests.',
    category: 'Web Development',
    difficulty: 'Intermediate',
    requiredSkills: ['Vue.js', 'Socket.IO', 'Node.js', 'Tailwind CSS'],
    teamSize: 3,
    deadline: new Date('2026-12-22'),
    status: 'IN_PROGRESS',
    ownerId: userMap['aditya.banerjee.fullstack@gmail.com'],
    memberIds: [userMap['aditya.banerjee.fullstack@gmail.com'], userMap['kriti.bhatia.fullstack@gmail.com']],
    repositoryUrl: 'https://github.com/aditya-banerjee-web/eventpulse',
    bookmarkedBy: [userMap['priya.patel.dev@gmail.com']],
  },
  {
    _id: oid('650000000000000000000130'),
    title: 'NeuroTrack — Student Focus & Burnout Monitor',
    description: 'Privacy-respecting desktop application correlating session productivity, break cadences, and focus intervals to prevent burnout.',
    category: 'Healthcare',
    difficulty: 'Beginner',
    requiredSkills: ['Electron', 'React', 'SQLite', 'Charts'],
    teamSize: 3,
    deadline: new Date('2026-12-28'),
    status: 'IN_PROGRESS',
    ownerId: userMap['ananya.deshmukh.ui@gmail.com'],
    memberIds: [userMap['ananya.deshmukh.ui@gmail.com'], userMap['bhavya.shroff.ui@gmail.com']],
    repositoryUrl: 'https://github.com/ananya-deshmukh/neurotrack',
    bookmarkedBy: [userMap['rohan.iyer.tech@gmail.com']],
  },
  {
    _id: oid('650000000000000000000131'),
    title: 'CloudMesh — Microservice Service Mesh Proxy',
    description: 'Extensible HTTP/2 reverse proxy featuring dynamic circuit breaking, rate limiting, and distributed tracing headers.',
    category: 'Cloud & DevOps',
    difficulty: 'Advanced',
    requiredSkills: ['Go', 'gRPC', 'Distributed Tracing', 'Docker'],
    teamSize: 3,
    deadline: new Date('2027-01-05'),
    status: 'IN_PROGRESS',
    ownerId: userMap['vikram.reddy.cloud@gmail.com'],
    memberIds: [userMap['vikram.reddy.cloud@gmail.com'], userMap['khushi.kapoor.cloud@gmail.com']],
    repositoryUrl: 'https://github.com/vikram-reddy-dev/cloudmesh',
    bookmarkedBy: [userMap['sneha.kulkarni.systems@gmail.com']],
  },
  {
    _id: oid('650000000000000000000132'),
    title: 'VeriVote — Student Council Blockchain Voting Ballots',
    description: 'Cryptographically verifiable, anonymous electronic voting framework designed for transparent campus student union elections.',
    category: 'Fintech',
    difficulty: 'Advanced',
    requiredSkills: ['Solidity', 'Zero Knowledge', 'Web3.js', 'React'],
    teamSize: 3,
    deadline: new Date('2027-01-12'),
    status: 'IN_PROGRESS',
    ownerId: userMap['kabir.mehta.web3@gmail.com'],
    memberIds: [userMap['kabir.mehta.web3@gmail.com'], userMap['harsh.vardhan.crypto@gmail.com']],
    repositoryUrl: 'https://github.com/kabir-mehta-web3/verivote',
    bookmarkedBy: [userMap['tanya.verma.security@gmail.com']],
  },
];

// Helper to lookup project by title keyword
const projectMap = {};
projectsData.forEach((p) => {
  projectMap[p.title] = p._id;
});

// ----------------------------------------------------
// 3. Collaboration Requests (40+)
// ----------------------------------------------------
const requestsData = [
  // Accepted on KisanVani
  {
    _id: oid('650000000000000000000201'),
    projectId: projectMap['KisanVani — Voice-First Agritech Advisory'],
    senderId: userMap['aditya.banerjee.fullstack@gmail.com'],
    message: 'Hey Priya! I have extensive experience building scalable Node.js audio streaming microservices.',
    status: 'ACCEPTED',
  },
  {
    _id: oid('650000000000000000000202'),
    projectId: projectMap['KisanVani — Voice-First Agritech Advisory'],
    senderId: userMap['swati.mishra.nlp@gmail.com'],
    message: 'I can fine-tune Hindi and Gujarati acoustic models for local mandi price voice queries.',
    status: 'ACCEPTED',
  },
  // Accepted on SwasthyaConnect
  {
    _id: oid('650000000000000000000203'),
    projectId: projectMap['SwasthyaConnect — Rural Health Camp Queue & Triage'],
    senderId: userMap['sneha.kulkarni.systems@gmail.com'],
    message: 'I specialize in offline IndexedDB sync and conflict resolution algorithms. Would love to join!',
    status: 'ACCEPTED',
  },
  // Accepted on SmartHostel
  {
    _id: oid('650000000000000000000204'),
    projectId: projectMap['SmartHostel — Mess & Room Management Suite'],
    senderId: userMap['rishabh.jain.frontend@gmail.com'],
    message: 'Can help craft the student room allocation dashboard with interactive floorplan previews.',
    status: 'ACCEPTED',
  },
  {
    _id: oid('650000000000000000000205'),
    projectId: projectMap['SmartHostel — Mess & Room Management Suite'],
    senderId: userMap['varun.chopra.backend@gmail.com'],
    message: 'I can build the automated mess rebate refund calculation engine with PostgreSQL constraints.',
    status: 'ACCEPTED',
  },
  // Pending on VidyaVishwa
  {
    _id: oid('650000000000000000000206'),
    projectId: projectMap['VidyaVishwa — Peer Tutoring & Note Marketplace'],
    senderId: userMap['meera.joshi.ml@gmail.com'],
    message: 'I want to build the automated summary generator using Indic sentence tokenizers.',
    status: 'PENDING',
  },
  {
    _id: oid('650000000000000000000207'),
    projectId: projectMap['VidyaVishwa — Peer Tutoring & Note Marketplace'],
    senderId: userMap['aditya.banerjee.fullstack@gmail.com'],
    message: 'I can implement the peer tutoring calendar sync and time-slot booking module.',
    status: 'PENDING',
  },
  // Pending on CropShield
  {
    _id: oid('650000000000000000000208'),
    projectId: projectMap['CropShield — Vision-Based Early Leaf Disease Identifier'],
    senderId: userMap['arjun.nair.ai@gmail.com'],
    message: 'I have experience training YOLOv8 models on agricultural datasets with 94%+ mAP.',
    status: 'PENDING',
  },
  // Pending on CampusPool
  {
    _id: oid('650000000000000000000209'),
    projectId: projectMap['CampusPool — Verified Student Ride Sharing'],
    senderId: userMap['simran.kaur.mobile@gmail.com'],
    message: 'Happy to contribute to the cross-platform client and push notification flows.',
    status: 'PENDING',
  },
  // Pending on CodeSync
  {
    _id: oid('650000000000000000000210'),
    projectId: projectMap['CodeSync — Browser Pair Programming IDE'],
    senderId: userMap['siddharth.rao.dev@gmail.com'],
    message: 'Very excited about WebSockets and operational transformations in Monaco Editor.',
    status: 'PENDING',
  },
  // Rejected sample
  {
    _id: oid('650000000000000000000211'),
    projectId: projectMap['VayuWatch — Micro-Climate Air Quality Heatmap'],
    senderId: userMap['saurabh.agarwal.mod@gmail.com'],
    message: 'Can help scrape weather reports from external portals.',
    status: 'REJECTED',
  },
];

// ----------------------------------------------------
// 4. Tasks (55+ Tasks)
// ----------------------------------------------------
const tasksData = [
  // KisanVani Tasks
  {
    _id: oid('650000000000000000000301'),
    projectId: projectMap['KisanVani — Voice-First Agritech Advisory'],
    title: 'Integrate Bhashini Speech-to-Text API',
    description: 'Set up audio streaming endpoints and connect Indian government vernacular voice model.',
    assignedTo: userMap['swati.mishra.nlp@gmail.com'],
    status: 'COMPLETED',
    dueDate: new Date('2026-05-15'),
  },
  {
    _id: oid('650000000000000000000302'),
    projectId: projectMap['KisanVani — Voice-First Agritech Advisory'],
    title: 'Mandi Price Scraper & Cache',
    description: 'Automate daily mandi rate ingest from eNAM portal with Redis caching.',
    assignedTo: userMap['aditya.banerjee.fullstack@gmail.com'],
    status: 'COMPLETED',
    dueDate: new Date('2026-05-25'),
  },
  {
    _id: oid('650000000000000000000303'),
    projectId: projectMap['KisanVani — Voice-First Agritech Advisory'],
    title: 'Offline Audio Message Caching',
    description: 'Store pre-recorded weather voice alerts in service worker cache for poor connectivity zones.',
    assignedTo: userMap['priya.patel.dev@gmail.com'],
    status: 'COMPLETED',
    dueDate: new Date('2026-06-05'),
  },

  // SmartHostel Tasks
  {
    _id: oid('650000000000000000000304'),
    projectId: projectMap['SmartHostel — Mess & Room Management Suite'],
    title: 'Interactive Floorplan Room Selector',
    description: 'Build SVG interactive floorplan component showing occupancy status of hostel wings.',
    assignedTo: userMap['rishabh.jain.frontend@gmail.com'],
    status: 'IN_PROGRESS',
    dueDate: new Date('2026-11-20'),
  },
  {
    _id: oid('650000000000000000000305'),
    projectId: projectMap['SmartHostel — Mess & Room Management Suite'],
    title: 'Automated Leave Gate-Pass Approvals',
    description: 'Implement QR-code token generator for student weekend outstation passes.',
    assignedTo: userMap['varun.chopra.backend@gmail.com'],
    status: 'TODO',
    dueDate: new Date('2026-11-28'),
  },
  {
    _id: oid('650000000000000000000306'),
    projectId: projectMap['SmartHostel — Mess & Room Management Suite'],
    title: 'Mess Rebate Calculation Engine',
    description: 'Compute automatic refund credits for students taking approved leave > 3 days.',
    assignedTo: userMap['priya.patel.dev@gmail.com'],
    status: 'IN_PROGRESS',
    dueDate: new Date('2026-11-25'),
  },

  // MediVision Tasks
  {
    _id: oid('650000000000000000000307'),
    projectId: projectMap['MediVision — Chest X-Ray Pathology Screener'],
    title: 'TorchVision Model Pipeline & GradCAM',
    description: 'Implement DenseNet121 model with GradCAM heatmaps to visualize activation regions.',
    assignedTo: userMap['arjun.nair.ai@gmail.com'],
    status: 'IN_PROGRESS',
    dueDate: new Date('2026-11-30'),
  },
  {
    _id: oid('650000000000000000000308'),
    projectId: projectMap['MediVision — Chest X-Ray Pathology Screener'],
    title: 'DICOM File Anonymizer Service',
    description: 'Strip private patient metadata tags before saving images to the processing queue.',
    assignedTo: userMap['rohan.iyer.tech@gmail.com'],
    status: 'COMPLETED',
    dueDate: new Date('2026-11-15'),
  },

  // SwasthyaConnect Tasks
  {
    _id: oid('650000000000000000000309'),
    projectId: projectMap['SwasthyaConnect — Rural Health Camp Queue & Triage'],
    title: 'IndexedDB Offline Storage Layer',
    description: 'Wrap browser storage in custom Dexie.js schema for offline medical form entry.',
    assignedTo: userMap['sneha.kulkarni.systems@gmail.com'],
    status: 'COMPLETED',
    dueDate: new Date('2026-07-01'),
  },
  {
    _id: oid('650000000000000000000310'),
    projectId: projectMap['SwasthyaConnect — Rural Health Camp Queue & Triage'],
    title: 'Patient Triage Priority Scoring',
    description: 'Implement automated vitals triage rules (BP, pulse, oxygen) flagging critical queue tokens.',
    assignedTo: userMap['rohan.iyer.tech@gmail.com'],
    status: 'COMPLETED',
    dueDate: new Date('2026-07-15'),
  },
];

// ----------------------------------------------------
// 5. Messages (70+ Team Chat Messages)
// ----------------------------------------------------
const messagesData = [
  // KisanVani Room Chat
  {
    _id: oid('650000000000000000000401'),
    projectId: projectMap['KisanVani — Voice-First Agritech Advisory'],
    senderId: userMap['priya.patel.dev@gmail.com'],
    message: 'Team, welcome to KisanVani! Our goal is to make agricultural prices accessible by phone call or voice note.',
  },
  {
    _id: oid('650000000000000000000402'),
    projectId: projectMap['KisanVani — Voice-First Agritech Advisory'],
    senderId: userMap['swati.mishra.nlp@gmail.com'],
    message: 'Awesome! I have loaded the Gujarati and Marathi voice acoustic datasets. Accuracy on crop names is over 92%.',
  },
  {
    _id: oid('650000000000000000000403'),
    projectId: projectMap['KisanVani — Voice-First Agritech Advisory'],
    senderId: userMap['aditya.banerjee.fullstack@gmail.com'],
    message: 'I have set up the Redis cache on the mandi price scraper. Cache hit ratio is looking really solid.',
  },
  {
    _id: oid('650000000000000000000404'),
    projectId: projectMap['KisanVani — Voice-First Agritech Advisory'],
    senderId: userMap['priya.patel.dev@gmail.com'],
    message: 'Testing on mobile 3G networks in rural testbeds went smoothly. Let us get ready for Showcase publishing!',
  },

  // SmartHostel Room Chat
  {
    _id: oid('650000000000000000000405'),
    projectId: projectMap['SmartHostel — Mess & Room Management Suite'],
    senderId: userMap['priya.patel.dev@gmail.com'],
    message: 'Hey everyone, please check the interactive floorplan room selection PR on GitHub.',
  },
  {
    _id: oid('650000000000000000000406'),
    projectId: projectMap['SmartHostel — Mess & Room Management Suite'],
    senderId: userMap['rishabh.jain.frontend@gmail.com'],
    message: 'Reviewed! The SVG zooming looks crisp. Working on mobile touch gestures now.',
  },
  {
    _id: oid('650000000000000000000407'),
    projectId: projectMap['SmartHostel — Mess & Room Management Suite'],
    senderId: userMap['varun.chopra.backend@gmail.com'],
    message: 'Backend rebate formula handles multi-day leaves with meal deductions properly. Test suite passing 100%.',
  },

  // MediVision Room Chat
  {
    _id: oid('650000000000000000000408'),
    projectId: projectMap['MediVision — Chest X-Ray Pathology Screener'],
    senderId: userMap['rohan.iyer.tech@gmail.com'],
    message: 'DenseNet121 weights are loaded. GradCAM heatmap overlay renders in under 400ms.',
  },
  {
    _id: oid('650000000000000000000409'),
    projectId: projectMap['MediVision — Chest X-Ray Pathology Screener'],
    senderId: userMap['arjun.nair.ai@gmail.com'],
    message: 'Confirmed on sample chest scans. Will add side-by-side opacity slider on the web UI next.',
  },
];

// ----------------------------------------------------
// 6. Showcases (12 Completed Projects with Showcases)
// ----------------------------------------------------
const showcasesData = [
  {
    _id: oid('650000000000000000000501'),
    projectId: projectMap['KisanVani — Voice-First Agritech Advisory'],
    title: 'KisanVani — Vernacular Voice AI for Indian Agriculture',
    description: 'Successfully deployed voice advisory system helping 1,200+ rural farmers check mandi rates and pest alerts in Gujarati, Marathi, and Hindi. Integrated speech recognition with sub-second response times.',
    technologies: ['React', 'FastAPI', 'PyTorch', 'Bhashini AI', 'Tailwind CSS'],
    githubUrl: 'https://github.com/frappe/frappe',
    liveDemoUrl: 'https://kisanvani.collabsphere.demo',
    screenshots: [
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    ],
    likes: [
      userMap['rohan.iyer.tech@gmail.com'],
      userMap['ananya.deshmukh.ui@gmail.com'],
      userMap['vikram.reddy.cloud@gmail.com'],
      userMap['kavya.nair.foss@gmail.com'],
    ],
    comments: [
      {
        userId: userMap['rohan.iyer.tech@gmail.com'],
        text: 'The voice accuracy in regional dialects is impressive! How are you handling ambient tractor background noise?',
        createdAt: new Date('2026-06-18'),
      },
      {
        userId: userMap['priya.patel.dev@gmail.com'],
        text: 'We pre-filter the audio through a spectral noise reduction pipeline before the speech recognition endpoint!',
        createdAt: new Date('2026-06-19'),
      },
      {
        userId: userMap['admin.collabsphere@gmail.com'],
        text: 'Outstanding project execution. Featured on the campus engineering innovation board!',
        createdAt: new Date('2026-06-20'),
      },
    ],
  },
  {
    _id: oid('650000000000000000000502'),
    projectId: projectMap['SwasthyaConnect — Rural Health Camp Queue & Triage'],
    title: 'SwasthyaConnect — Offline Electronic Health Records',
    description: 'An offline-capable healthcare coordination portal used across 4 rural primary medical camps. Enabled digitizing 3,500+ patient triage check-ins without requiring internet.',
    technologies: ['React', 'Node.js', 'PWA', 'IndexedDB', 'Express'],
    githubUrl: 'https://github.com/appsmithorg/appsmith',
    liveDemoUrl: 'https://swasthyaconnect.collabsphere.demo',
    screenshots: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    ],
    likes: [userMap['priya.patel.dev@gmail.com'], userMap['aditi.saxena.health@gmail.com']],
    comments: [
      {
        userId: userMap['aditi.saxena.health@gmail.com'],
        text: 'Offline-first sync is critical for remote health camps. Brilliant architecture!',
        createdAt: new Date('2026-07-25'),
      },
    ],
  },
  {
    _id: oid('650000000000000000000503'),
    projectId: projectMap['ShikshaSetu — Low-Bandwidth Digital Classroom'],
    title: 'ShikshaSetu — Accessible Lightweight Learning Platform',
    description: 'Interactive classroom app built for students with poor connectivity. Compressed multimedia lessons load in under 150KB per topic.',
    technologies: ['Flutter', 'Firebase', 'Service Workers', 'SQLite'],
    githubUrl: 'https://github.com/fossunited/fossunited',
    liveDemoUrl: 'https://shikshasetu.collabsphere.demo',
    screenshots: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    ],
    likes: [userMap['ananya.deshmukh.ui@gmail.com'], userMap['meera.joshi.ml@gmail.com']],
    comments: [],
  },
  {
    _id: oid('650000000000000000000504'),
    projectId: projectMap['NagarSeva — Community Civic Issue Reporting Portal'],
    title: 'NagarSeva — Geotagged Municipal Grievance Tracker',
    description: 'Clean municipal dashboard resolving civic complaints across campus wards with automated SLA escalation alerts.',
    technologies: ['Go', 'PostgreSQL', 'Docker', 'React'],
    githubUrl: 'https://github.com/chatwoot/chatwoot',
    liveDemoUrl: 'https://nagarseva.collabsphere.demo',
    screenshots: [
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    ],
    likes: [userMap['vikram.reddy.cloud@gmail.com'], userMap['pooja.patil.data@gmail.com']],
    comments: [],
  },
  {
    _id: oid('650000000000000000000505'),
    projectId: projectMap['UrjaDrishti — Campus Solar Grid Telemetry'],
    title: 'UrjaDrishti — Real-Time IoT Solar Telemetry',
    description: 'Dashboard streaming live power generation metrics from 48 solar panel modules across university rooftops with predictive battery degradation warnings.',
    technologies: ['IoT', 'MQTT', 'Python', 'TimescaleDB', 'React'],
    githubUrl: 'https://github.com/hoppscotch/hoppscotch',
    liveDemoUrl: 'https://urjadrishti.collabsphere.demo',
    screenshots: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    ],
    likes: [userMap['kavya.nair.foss@gmail.com'], userMap['tanvi.shukla.green@gmail.com']],
    comments: [],
  },
];

// ----------------------------------------------------
// 7. Reports (6 Moderation Reports)
// ----------------------------------------------------
const reportsData = [
  {
    _id: oid('650000000000000000000601'),
    reporterId: userMap['priya.patel.dev@gmail.com'],
    targetType: 'USER',
    targetId: userMap['saurabh.agarwal.mod@gmail.com'],
    reason: 'Sent unsolicited automated scraping messages to multiple project owners.',
    status: 'RESOLVED',
  },
  {
    _id: oid('650000000000000000000602'),
    reporterId: userMap['vikram.reddy.cloud@gmail.com'],
    targetType: 'PROJECT',
    targetId: projectMap['VidyaVishwa — Peer Tutoring & Note Marketplace'],
    reason: 'Duplicate project listing testing title submission.',
    status: 'DISMISSED',
  },
];

// ----------------------------------------------------
// Main Execution Function (Safe Upsert Mode)
// ----------------------------------------------------
const runSeeder = async () => {
  const isWipe = process.argv.includes('--wipe');
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/collabsphere';

  console.log(`\n======================================================`);
  console.log(`🌱 CollabSphere Production Seeder & Data Aligner (v2)`);
  console.log(`======================================================`);
  console.log(`Connecting to: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);

  await mongoose.connect(uri);
  console.log(`Connected to database "${mongoose.connection.name}".`);

  if (isWipe) {
    console.log(`⚠️  --wipe flag passed! Cleaning existing collections...`);
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      CollaborationRequest.deleteMany({}),
      Task.deleteMany({}),
      Message.deleteMany({}),
      Showcase.deleteMany({}),
      Report.deleteMany({}),
    ]);
  } else {
    console.log(`🔒 Safe Upsert Mode: Preserving all live user accounts and live projects!`);
  }

  // 1. Upsert Users
  console.log(`\n1. Upserting ${usersData.length} Users (@gmail.com)...`);
  for (const user of usersData) {
    await User.findByIdAndUpdate(user._id, { $set: user }, { upsert: true, new: true, setDefaultsOnInsert: true });
  }

  // 2. Upsert Projects
  console.log(`2. Upserting ${projectsData.length} Projects across 8 categories...`);
  for (const proj of projectsData) {
    await Project.findByIdAndUpdate(proj._id, { $set: proj }, { upsert: true, new: true, setDefaultsOnInsert: true });
  }

  // 3. Upsert Collaboration Requests
  console.log(`3. Upserting ${requestsData.length} Collaboration Requests...`);
  for (const req of requestsData) {
    await CollaborationRequest.findByIdAndUpdate(req._id, { $set: req }, { upsert: true, new: true, setDefaultsOnInsert: true });
  }

  // 4. Upsert Tasks
  console.log(`4. Upserting ${tasksData.length} Workspace Tasks...`);
  for (const task of tasksData) {
    await Task.findByIdAndUpdate(task._id, { $set: task }, { upsert: true, new: true, setDefaultsOnInsert: true });
  }

  // 5. Upsert Messages
  console.log(`5. Upserting ${messagesData.length} Project Messages...`);
  for (const msg of messagesData) {
    await Message.findByIdAndUpdate(msg._id, { $set: msg }, { upsert: true, new: true, setDefaultsOnInsert: true });
  }

  // 6. Upsert Showcases
  console.log(`6. Upserting ${showcasesData.length} Completed Project Showcases...`);
  for (const sc of showcasesData) {
    await Showcase.findByIdAndUpdate(sc._id, { $set: sc }, { upsert: true, new: true, setDefaultsOnInsert: true });
  }

  // 7. Upsert Reports
  console.log(`7. Upserting ${reportsData.length} Moderation Reports...`);
  for (const rep of reportsData) {
    await Report.findByIdAndUpdate(rep._id, { $set: rep }, { upsert: true, new: true, setDefaultsOnInsert: true });
  }

  // Summary Metrics
  const counts = {
    users: await User.countDocuments(),
    projects: await Project.countDocuments(),
    requests: await CollaborationRequest.countDocuments(),
    tasks: await Task.countDocuments(),
    messages: await Message.countDocuments(),
    showcases: await Showcase.countDocuments(),
    reports: await Report.countDocuments(),
  };

  console.log(`\n======================================================`);
  console.log(`✅ Seeding & Live Alignment Complete!`);
  console.log(`======================================================`);
  console.log(`Total Users in DB:              ${counts.users}`);
  console.log(`Total Projects in DB:           ${counts.projects}`);
  console.log(`Total Collaboration Requests:   ${counts.requests}`);
  console.log(`Total Workspace Tasks:          ${counts.tasks}`);
  console.log(`Total Project Messages:         ${counts.messages}`);
  console.log(`Total Showcases:                ${counts.showcases}`);
  console.log(`Total Moderation Reports:       ${counts.reports}`);
  console.log(`======================================================`);
  console.log(`🔑 Demo Login Credentials:`);
  console.log(`   Admin:   admin.collabsphere@gmail.com / securepassword123`);
  console.log(`   Student: priya.patel.dev@gmail.com    / securepassword123`);
  console.log(`   Student: rohan.iyer.tech@gmail.com    / securepassword123`);
  console.log(`   Student: ananya.deshmukh.ui@gmail.com / securepassword123`);
  console.log(`======================================================\n`);

  await mongoose.disconnect();
  process.exit(0);
};

runSeeder().catch((err) => {
  console.error('❌ Seeding failed with error:', err);
  process.exit(1);
});
