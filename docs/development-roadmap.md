# CollabSphere — Master Development Roadmap

This roadmap lists the 12 step-by-step phases to build **CollabSphere** from start to finish.

---

## Phase 0 — Project Foundation & Architecture `[COMPLETED]`
- **Objective**: Establish project repository structure, create plain-English documentation, plan database collections, and define API contracts.
- **Major Deliverables**:
  - Folder layout created (`frontend/`, `backend/`, `docs/`).
  - Core guides written (`PROJECT_CONTEXT.md`, `README.md`, `walkthrough.md`).
  - System design & DB collection plan written (`docs/architecture.md`).
  - Planned API endpoints listed (`docs/api-contract.md`).
  - Code safety settings configured (`.gitignore`, `backend/.env.example`).

---

## Phase 1 — Backend Infrastructure `[COMPLETED]`
- **Objective**: Build basic Node.js and Express server setup and connect to MongoDB.
- **Major Deliverables**:
  - `backend/package.json` with required dependencies (express, mongoose, dotenv, cors).
  - Basic server starter files (`app.js`, `server.js`).
  - MongoDB database connection setup.
  - Centralized error handler helper.

---

## Phase 2 — Authentication & Authorization `[COMPLETED]`
- **Objective**: Build student registration, login, password security, and JWT login tokens.
- **Major Deliverables**:
  - User model schema with password encryption (`bcryptjs`).
  - Registration, login, and current user API routes (`/api/auth`).
  - Security check middleware (`authMiddleware` and `adminMiddleware`).

---

## Phase 3 — User Profiles `[COMPLETED]`
- **Objective**: Allow students and admins to view and update user profiles and skills.
- **Major Deliverables**:
  - Profile view route (`GET /api/users/profile`) and edit route (`PUT /api/users/profile`).
  - Allowlisted profile updates (`name`, `bio`, `skills`, `githubUrl`, `linkedinUrl`, `avatar`); `email`, `password`, and `role` are protected from updates.
  - *(User search by skills deferred to Phase 4, alongside project search.)*

---

## Phase 4 — Project Management `[COMPLETED]`
- **Objective**: Allow students to post new projects, search/filter projects, change status, and bookmark projects.
- **Major Deliverables**:
  - Project database model (`memberIds`, `bookmarkedBy`, `difficulty`, optional `repositoryUrl`/`projectImage`, status `OPEN → IN_PROGRESS → COMPLETED`).
  - Project CRUD APIs with owner-only mutations.
  - Project search and filter APIs (search by title/description; filter by category, difficulty, status, skills) with pagination.
  - Forward-only status transition endpoint.
  - Bookmarking endpoints (idempotent add/remove).
  - User search by skills (`GET /api/users/search`) to support Phase 5 collaboration requests.

---

## Phase 5 — Collaboration Requests `[PLANNED]`
- **Objective**: Allow students to send requests to join open projects, and owners to accept or reject them.
- **Major Deliverables**:
  - Request database model.
  - Submit request API (prevents duplicates, checks `OPEN` status and team size).
  - Accept/Reject API (automatically adds accepted students to `Projects.memberIds`).

---

## Phase 6 — Team Workspace & Tasks `[PLANNED]`
- **Objective**: Provide task management for team members working inside a project workspace.
- **Major Deliverables**:
  - Task database model.
  - Create, assign, update (`TODO`, `IN_PROGRESS`, `COMPLETED`), and delete task APIs.

---

## Phase 7 — Chat & Real-Time Communication `[PLANNED]`
- **Objective**: Add real-time chat for project team members using Socket.IO.
- **Major Deliverables**:
  - Chat message model for persistent chat history.
  - Real-time chat messaging using Socket.IO project rooms.

---

## Phase 8 — Showcase & Social Features `[PLANNED]`
- **Objective**: Allow completed projects to publish public showcases with likes and comments.
- **Major Deliverables**:
  - Showcase database model linked to completed projects.
  - Showcase feed API, like toggle, and comment endpoints.

---

## Phase 9 — Administration `[PLANNED]`
- **Objective**: Provide admin tools to manage users, moderate projects, and review reports.
- **Major Deliverables**:
  - Content report model.
  - Admin dashboard stats, user management, and report moderation APIs.

---

## Phase 10 — Frontend Integration `[PLANNED]`
- **Objective**: Build the React.js client interface using Vite and Tailwind CSS.
- **Major Deliverables**:
  - React app structure (`frontend/`).
  - Login screens, Project Search, Project Details, Workspace, Showcase Feed, and Admin Panel.
  - Connecting React screens to Express REST API endpoints.

---

## Phase 11 — Testing, Deployment & Documentation `[PLANNED]`
- **Objective**: Perform end-to-end testing, final security checks, and deploy the application.
- **Major Deliverables**:
  - Postman API collection for testing.
  - Final deployment setup and user guide.
