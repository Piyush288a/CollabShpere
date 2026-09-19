# CollabSphere — Student Collaboration & Project Management Platform

Welcome to **CollabSphere**! 

CollabSphere is a university collaboration platform where students can post project ideas, find skilled teammates, manage tasks, chat with team members, and showcase finished projects.

---

## 📚 Easy Documentation Index

Here is a guide to all documentation files in this project:

- 📌 **[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)**: Simple overview of what CollabSphere is, user roles (Student vs Admin), technology choices, and project rules.
- 🏗️ **[docs/architecture.md](docs/architecture.md)**: Easy-to-read technical design explaining how the frontend, backend, and MongoDB database work together.
- 🗺️ **[docs/development-roadmap.md](docs/development-roadmap.md)**: 12-phase step-by-step roadmap showing how the project will be built.
- 📑 **[docs/api-contract.md](docs/api-contract.md)**: Planned web API endpoints specification under `/api`.
- 📜 **[walkthrough.md](walkthrough.md)**: Complete cumulative development log recording the history of every phase.

---

## 🛠️ Tools & Technologies Used

* **Frontend**: React.js, Vite, Tailwind CSS
* **Backend**: Node.js, Express.js, Socket.IO (future phase)
* **Database**: MongoDB, Mongoose
* **Security**: JWT Login Tokens, Password Hashing (`bcryptjs`)

---

## 📁 Repository Folders

```text
CollabSphere/
├── backend/                     # Express backend API server folder
│   ├── config/                  # Database connection configuration
│   ├── controllers/             # Request handlers and business logic
│   ├── middleware/              # Auth, admin, and error handler middleware
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # API route definitions
│   ├── tests/                   # Jest + Supertest test suite
│   ├── .env.example             # Safe settings example file
│   ├── app.js                   # Express app setup (routes, middleware)
│   ├── package.json             # Backend dependencies and scripts
│   ├── server.js                # Server entry point (starts HTTP listener)
│   └── README.md                # Backend architecture guide
├── frontend/                    # React frontend web app folder
│   └── README.md                # Frontend architecture guide
├── docs/                        # Project design & API guides
│   ├── api-contract.md          # Web API contract (/api)
│   ├── architecture.md          # System design & DB collection plans
│   └── development-roadmap.md   # 12-phase master build roadmap
├── PROJECT_CONTEXT.md           # Project rules, goals, and user roles
├── walkthrough.md               # Cumulative phase-by-phase history log
├── README.md                    # Main project overview (this file)
└── .gitignore                   # Files ignored by Git (like .env and node_modules)
```

---

## 🚦 Cumulative Phase Status History

* **🟢 Phase 0: Project Foundation & Architecture** — **COMPLETED** (Set up `frontend/` & `backend/` folders, plain-English documentation, DB plans, and API contracts).
* **🟢 Phase 1: Backend Infrastructure** — **COMPLETED** (Express server, MongoDB connection, health check, 404 handler, centralized error handler, `app.js`/`server.js` separation).
* **🟢 Phase 2: Authentication & Authorization** — **COMPLETED** (User model, registration, login, bcryptjs hashing, JWT middleware, `authMiddleware`, `adminMiddleware`, email validation, 17/17 tests passing).
* **🟢 Phase 3: User Profiles** — **COMPLETED** (Profile view & update endpoints, allowlisted field updates, protected email/password/role, `userController` separation, 26/26 tests passing).
* **🟢 Phase 4: Project Management** — **COMPLETED** (Project model, full CRUD with owner-only mutations, search/filter/pagination, forward-only status transitions, idempotent bookmarking, user search by skills, 92/92 tests passing).
* **🟢 Phase 5: Collaboration Requests** — **COMPLETED** (Request model, send/list/accept/reject with `OPEN`-only + no-duplicate + `teamSize` rules, member sync into `Projects.memberIds`, team endpoint, 111/111 tests passing).
* **⏳ Phase 6: Team Workspace & Tasks** — **UPCOMING** (Task model, create/assign/update/delete tasks for team members).
