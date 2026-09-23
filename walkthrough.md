# CollabSphere — Complete Phase History & Walkthrough

This document keeps a **complete, permanent history** of every development phase for CollabSphere. As new phases are completed, new sections will be added below without erasing past history.

---

## 🟢 Phase 0: Project Foundation & Architecture

* **Completion Date**: September 18, 2026
* **Status**: **COMPLETED**

### Summary of What Was Built
1. **Created Folder Foundation**:
   * Established initial `frontend/`, `backend/`, and `docs/` directories.
   * Initialized local Git tracking.
2. **Repository Restructuring (CIVICPULSE Alignment)**:
   * Renamed `client/` → `frontend/` and `server/` → `backend/` to align with the approved project structure convention.
   * Preserved all documentation files and `.env.example` configurations.
   * Confirmed zero dependencies, application code, Mongoose schemas, or Express routes were created during restructuring.
3. **System & Database Architecture Written (`docs/architecture.md`)**:
   * Explained 3-tier MERN stack design (React Frontend ↔ Express Server ↔ MongoDB Database).
   * Documented incremental `backend/` and `frontend/` directory responsibilities for future phases.
   * Designed 7 core database collections (`Users`, `Projects`, `CollaborationRequests`, `Tasks`, `Messages`, `Showcases`, `Reports`).
   * Specified explicit domain rules: `Projects.memberIds` for team members, `Projects.bookmarkedBy` for saved projects, and status flow `OPEN` → `IN_PROGRESS` → `COMPLETED`.
4. **REST API Contract Defined (`docs/api-contract.md`)**:
   * Documented planned REST API endpoints under base URL `/api` (avoiding `/api/v1`).
   * Grouped endpoints into 10 resource groups (Auth, Profiles, Projects, Collaboration Requests, Tasks, Messages, Showcases, Bookmarks, Reports, Admin).
5. **Master 12-Phase Roadmap Written (`docs/development-roadmap.md`)**:
   * Outlined step-by-step goals for all 12 phases from foundation to final deployment.
6. **Project Context & Rules Written (`PROJECT_CONTEXT.md`)**:
   * Documented student & administrator permissions, confirmed tech stack, explicit exclusions, and project rules in simple language.
7. **Code Safety & Secret Configuration**:
   * Created root `.gitignore` to block `.env`, `node_modules/`, `dist/`, and logs from Git.
   * Created safe `backend/.env.example` template without real passwords or tokens.
8. **Phase 0 Documentation Consistency Review**:
   * Standardized database field names across all documentation (`CollaborationRequests.senderId`, `Tasks.assignedTo`, `Messages.message`, `Showcases.technologies`).
   * Verified Socket.IO and Cloudinary implementation details remain explicitly deferred to their respective feature phases (Phase 7 and Phase 8/10).

---

### Key Architectural Decisions (ADR Log)

| Decision ID | What We Decided | Why We Decided It |
| :--- | :--- | :--- |
| **ADR-001** | API base path is `/api`, not `/api/v1` | Keeps API paths clean and avoids premature version nesting for monolithic backend REST services. |
| **ADR-002** | Project lifecycle is `OPEN → IN_PROGRESS → COMPLETED` | Projects are published immediately without an admin approval/PENDING bottleneck to speed up collaboration. |
| **ADR-003** | `Projects` contains `memberIds` and `bookmarkedBy` | `memberIds` tracks accepted team members, while `bookmarkedBy` tracks users who bookmarked the project. |
| **ADR-004** | Admin is represented by `role` within `Users` | Admin is an elevated role (`role: 'admin'`) within the `Users` database model, not a separate auth system. |
| **ADR-005** | Socket.IO chat using `projectId` (Deferred to Phase 7) | Workspace instant chat rooms will be organized around `projectId` channels in Phase 7. |
| **ADR-006** | Database Field Standardizations | Standardized field names across docs: `CollaborationRequests.senderId`, `Tasks.assignedTo`, `Messages.message`, `Showcases.technologies`. |
| **ADR-007** | Directory Structure (`frontend/` & `backend/`) | Renamed `client/` → `frontend/` and `server/` → `backend/` to follow the approved CIVICPULSE repository structure convention. |

---

### Phase 0 Verification Results

* **Directory Structure**: Verified `frontend/` exists, `backend/` exists, and `client/` / `server/` directories do not exist.
* **Files & Documentation Links**: Verified 100% presence and working links across all markdown documentation files.
* **Terminology & Field Name Alignment**: Confirmed `senderId`, `assignedTo`, `message`, `technologies`, `Projects.memberIds`, `Projects.bookmarkedBy`, `teamSize`, and `OPEN → IN_PROGRESS → COMPLETED` match perfectly across `PROJECT_CONTEXT.md`, `architecture.md`, `api-contract.md`, and `README.md`.
* **Secret Exposure Audit**: Verified no passwords, API keys, database connection URIs, or tokens were committed. `backend/.env.example` contains placeholders only.
* **Git Status**: Verified untracked files list (`git status --short`) and confirmed `.gitignore` blocks `.env`.
* **Scope Boundary**: Confirmed **zero** business logic, Express routes, Mongoose schemas, or React pages were created. No npm packages installed. Phase 1 has not started.

---

*(Future phases will be appended below as they are completed)*

---

## 📋 Pre-Phase 1: Technical Decisions Finalized

* **Date**: September 18, 2026
* **Status**: **COMPLETED** (Documentation update — no code changes)

### Summary of Decisions Recorded

The following technical decisions were finalized and documented across `docs/api-contract.md` and `docs/architecture.md` before Phase 1 implementation begins.

| Decision ID | What We Decided | Where Documented |
| :--- | :--- | :--- |
| **ADR-008** | All API responses use `{ success, data }` (success) or `{ success, message }` (error) envelope | `api-contract.md` §0, `architecture.md` §4 |
| **ADR-009** | Standard HTTP status codes: 200, 201, 400, 401, 403, 404, 409, 500 | `api-contract.md` §0 |
| **ADR-010** | Page-based pagination via `?page=1&limit=10`; metadata nested inside `data` as `{ results, pagination }` | `api-contract.md` §0, `architecture.md` §4 |
| **ADR-011** | `Showcases.comments` is an embedded subdocument array (`userId`, `text`, `createdAt`) — no separate collection | `architecture.md` §7, `api-contract.md` §7 |
| **ADR-012** | `Showcases.images` is an array of URL strings, defaults to `[]`; Cloudinary integration deferred to Phase 8/10 | `architecture.md` §7 |
| **ADR-013** | Testing uses Jest + Supertest starting from Phase 2; `app.js` and `server.js` separated in Phase 1 to enable this | `architecture.md` §5 |
| **ADR-014** | `GET /api/projects/:id/team` is Private — requires valid JWT to protect member profile data | `api-contract.md` §4 |

---

## 📋 Pre-Phase 2: Authentication Decisions Finalized

* **Date**: September 18, 2026
* **Status**: **COMPLETED** (Documentation update — no code changes)

### Summary of Decisions Recorded

The following decisions were finalized and documented in `docs/api-contract.md` before Phase 2 implementation begins.

| Decision ID | What We Decided | Where Documented |
| :--- | :--- | :--- |
| **ADR-015** | `POST /api/auth/register` returns a JWT token + new user object (without password) in a single response — user is automatically logged in after registering | `api-contract.md` §1 |
| **ADR-016** | `GET /api/users/profile` is included in Phase 2 (not deferred to Phase 3) — it is the primary verification that `authMiddleware` works correctly | `api-contract.md` §2 |
| **ADR-017** | JWT is signed using `JWT_SECRET` and `JWT_EXPIRES_IN` from environment variables (pre-configured in `.env.example` as `7d`) | `api-contract.md` §1 |
| **ADR-018** | Passwords are hashed with `bcryptjs` at 10 salt rounds; `password` field is excluded from all API responses | `api-contract.md` §1, §2 |
| **ADR-019** | Request and response body schemas for `POST /api/auth/register`, `POST /api/auth/login`, and `GET /api/users/profile` are fully specified | `api-contract.md` §1, §2 |

---

## 🟢 Phase 1: Backend Infrastructure

* **Completion Date**: September 18, 2026
* **Status**: **COMPLETED**

### Summary of What Was Built

1. **`backend/package.json`**:
   * Configured project as `"type": "commonjs"` (plain JavaScript with `require()`).
   * Added production dependencies with pinned versions: `express@4.19.2`, `mongoose@8.5.1`, `dotenv@16.4.5`, `cors@2.8.5`.
   * Added dev dependency: `nodemon@3.1.4`.
   * Defined `npm start` (production) and `npm run dev` (nodemon auto-restart) scripts.

2. **`backend/config/db.js`**:
   * Exports a single async `connectDB()` function.
   * Connects to MongoDB using `MONGODB_URI` from environment variables via Mongoose.
   * Logs the connected host on success.
   * Logs the error and calls `process.exit(1)` on failure — guarantees the server never starts without a working database connection.

3. **`backend/middleware/errorHandler.js`**:
   * Express 4-argument `(err, req, res, next)` centralized error handler.
   * Reads `err.statusCode` and falls back to `500` if not set.
   * Responds with the agreed error envelope: `{ success: false, message: "..." }`.
   * Logs errors to console in non-production environments only.

4. **`backend/app.js`**:
   * Creates and configures the Express app — does NOT call `app.listen()`.
   * Registers `cors` (restricted to `CLIENT_URL`), `express.json()` body parser.
   * Mounts `GET /api/health` route returning `{ success: true, data: { message: "Server is running" } }`.
   * Registers a 404 catch-all for unknown routes: `{ success: false, message: "Route not found" }`.
   * Registers `errorHandler` last.
   * Exports `app` for use by both `server.js` and future Jest/Supertest tests.

5. **`backend/server.js`**:
   * Loads `.env` via `dotenv.config()` as the very first action.
   * Calls `await connectDB()` before starting the HTTP listener.
   * Only calls `app.listen()` after a confirmed database connection.
   * Logs the running port and environment on startup.

---

### Phase 1 Verification Results

* **MongoDB connection**: Confirmed connected successfully — host logged on startup.
* **Server startup**: Express server running on port `5000`.
* **Health check**: `GET /api/health` returns `{ "success": true, "data": { "message": "Server is running" } }` with HTTP `200`.
* **Unknown route handling**: Any unregistered route returns `{ "success": false, "message": "Route not found" }` with HTTP `404`.
* **Database-first startup**: Verified `connectDB()` is awaited before `app.listen()` — server exits safely if MongoDB is unreachable.
* **Scope boundary**: No authentication, Mongoose models, or business logic routes were created. Phase 2 has not started.

---

### Key Architectural Decisions Applied

| Decision | Applied In |
| :--- | :--- |
| ADR-008: `{ success, data }` / `{ success, message }` response envelope | `app.js` health route, 404 handler, `errorHandler.js` |
| ADR-009: HTTP status codes (200, 404, 500) | `app.js`, `errorHandler.js` |
| ADR-013: `app.js` exported separately from `server.js` for testability | `app.js`, `server.js` |

---

## 🟢 Phase 2: Authentication & Authorization

* **Completion Date**: September 18, 2026
* **Status**: **COMPLETED**

### Summary of What Was Built

1. **`backend/models/User.js`**:
   * Full Mongoose schema for the `Users` collection covering all documented fields: `name`, `email`, `password`, `role`, `avatar`, `skills`, `bio`, `githubUrl`, `linkedinUrl`, `createdAt`, `updatedAt`.
   * `password` field uses `select: false` — never returned in query results by default.
   * Pre-save hook hashes passwords with `bcryptjs` at 10 salt rounds, only when the password field is modified.
   * `matchPassword()` instance method compares plain-text passwords against the stored hash using `bcrypt.compare`.
   * Email format validated via Mongoose `match` regex (`/^\S+@\S+\.\S+$/`). Invalid formats are rejected before the document is saved.

2. **`backend/controllers/authController.js`**:
   * `register`: validates required fields, checks for duplicate email (returns `409`), creates user, returns JWT + formatted user object.
   * `login`: validates required fields, fetches user with `.select('+password')`, compares password, returns JWT + formatted user object.
   * `getProfile`: reads `req.user.userId` set by `authMiddleware`, fetches and returns the user profile.
   * `formatUser()` helper explicitly builds the response object field-by-field — password is structurally excluded regardless of `select: false`.
   * `signToken()` helper reads `JWT_SECRET` and `JWT_EXPIRES_IN` from environment variables.

3. **`backend/middleware/authMiddleware.js`**:
   * `authMiddleware`: reads `Authorization: Bearer <token>` header, verifies JWT with `jwt.verify`, attaches `{ userId, role }` to `req.user`. Returns `401` for missing, invalid, or expired tokens.
   * `adminMiddleware`: checks `req.user.role === 'admin'`. Returns `403` if not. Must follow `authMiddleware` in the middleware chain.

4. **`backend/routes/authRoutes.js`**:
   * `POST /api/auth/register` → `register` controller (public)
   * `POST /api/auth/login` → `login` controller (public)

5. **`backend/routes/userRoutes.js`**:
   * `GET /api/users/profile` → `authMiddleware` → `getProfile` controller (private)

6. **`backend/app.js`** (modified):
   * Mounted `authRoutes` at `/api/auth`.
   * Mounted `userRoutes` at `/api/users`.

7. **`backend/package.json`** (modified):
   * Added production dependencies: `bcryptjs@2.4.3`, `jsonwebtoken@9.0.2`.
   * Added dev dependencies: `jest@29.7.0`, `supertest@7.0.0`.
   * Added `"test": "jest --runInBand --forceExit"` script.

8. **`backend/middleware/errorHandler.js`** (modified — post-Phase 2 fix):
   * Added Mongoose `ValidationError` handling: detects `err.name === 'ValidationError'`, maps to `400 Bad Request`, extracts the first validation message.

9. **`backend/tests/auth.test.js`**:
   * 17 Jest + Supertest tests covering all success and error paths.
   * Uses a dedicated test database (`collabsphere_test`) — never the development database.
   * `--runInBand` ensures serial execution to avoid MongoDB connection race conditions.
   * `--forceExit` required because Mongoose keeps its connection pool open after tests, which would cause Jest to hang indefinitely.

---

### Phase 2 Verification Results

* **Registration**: `POST /api/auth/register` returns `201` with JWT + user object (no password). Duplicate email returns `409`. Missing fields return `400`. Invalid email format returns `400`.
* **Login**: `POST /api/auth/login` returns `200` with JWT + user object (no password). Wrong credentials return `401`. Missing fields return `400`.
* **Profile**: `GET /api/users/profile` returns `200` with user object (no password) when JWT is valid. Missing or invalid token returns `401`.
* **Password security**: Password never appears in any API response. Verified by dedicated test for each endpoint.
* **JWT**: Signed with `JWT_SECRET` and `JWT_EXPIRES_IN` from environment variables. Invalid tokens correctly rejected with `401`.
* **Test suite**: 17/17 tests passing on separate test database.
* **Scope boundary**: No Phase 3 profile update routes, no project models, no collaboration features created.

---

### Key Architectural Decisions Applied

| Decision | Applied In |
| :--- | :--- |
| ADR-015: Register returns JWT + user in single response | `authController.js` register handler |
| ADR-016: `GET /api/users/profile` included in Phase 2 | `userRoutes.js`, `authController.js` |
| ADR-017: JWT signed from environment variables | `authController.js` signToken helper |
| ADR-018: bcryptjs 10 salt rounds, password excluded from responses | `User.js` pre-save hook, `formatUser` helper |
| ADR-019: Full request/response schemas documented | `api-contract.md` §1, §2 |
| ADR-020: Email format validated via Mongoose match regex; ValidationError mapped to 400 | `User.js`, `errorHandler.js` |

---

## 🟢 Phase 3: User Profiles

* **Completion Date**: September 18, 2026
* **Status**: **COMPLETED**

### Summary of What Was Built

1. **`backend/utils/formatUser.js`** (new):
   * Extracted the shared `formatUser` helper into a dedicated utility so both `authController` and `userController` use one consistent, password-free response shape.

2. **`backend/controllers/userController.js`**:
   * `getProfile` relocated here from `authController.js` (behaviour unchanged).
   * `updateProfile` added: builds the update object from an explicit allowlist (`name`, `bio`, `skills`, `githubUrl`, `linkedinUrl`, `avatar`). `email`, `password`, and `role` are never accepted. Uses `findByIdAndUpdate` with `{ new: true, runValidators: true }`. Returns the updated user via `formatUser`.

3. **`backend/controllers/authController.js`**:
   * `getProfile` removed; exports reduced to `{ register, login }`. Imports `formatUser` from `utils/`.

4. **`backend/routes/userRoutes.js`**:
   * `GET /api/users/profile` → `authMiddleware` → `getProfile` (unchanged).
   * `PUT /api/users/profile` → `authMiddleware` → `updateProfile` (new).

5. **`backend/tests/user.test.js`** (new):
   * 9 tests: full update, partial update, password never returned, unauthorized (no token), ignore email update, ignore role update, ignore password update, empty body behaviour, and a regression test for `GET /api/users/profile`.

### Phase 3 Verification Results

* **Full update**: `PUT /api/users/profile` updates all six allowlisted fields and returns `200`.
* **Partial update**: Sending a single field leaves others unchanged.
* **Field protection**: Attempts to change `email`, `password`, or `role` are ignored — verified by re-login with the original password and unchanged email/role in the response.
* **Auth**: Missing token returns `401`.
* **Empty body**: Returns `200` with the user unchanged.
* **Regression**: `GET /api/users/profile` still works after the controller relocation.
* **Test suite**: 26/26 tests passing (17 auth + 9 user) across 2 test suites.
* **Scope boundary**: No user search (deferred to Phase 4), no project/chat/showcase features.

### Key Architectural Decisions Applied

| Decision | Applied In |
| :--- | :--- |
| ADR-021: `formatUser` extracted to a shared `utils/` module | `utils/formatUser.js` |
| ADR-022: Profile updates use an explicit field allowlist; `email`/`password`/`role` protected | `userController.js` updateProfile |
| ADR-023: User search deferred to Phase 4 (alongside project search) | roadmap Phase 3/4 |

---

## 🟢 Phase 4: Project Management

* **Completion Date**: September 18, 2026
* **Status**: **COMPLETED**

### Summary of What Was Built

1. **`backend/models/Project.js`** (new):
   * Mongoose schema for the `Projects` collection: `ownerId` (ref `User`), `memberIds` (ref `User`, default `[]`), `title` (3–120), `description` (10–5000), `category` (free-form required string), `requiredSkills` (`[String]`), `teamSize` (integer 1–50), `deadline` (Date), `difficulty` (enum `Beginner`/`Intermediate`/`Advanced`), optional `repositoryUrl` (validated `http(s)` when non-empty, default `''`), optional `projectImage` (default `null`), `status` (enum `OPEN`/`IN_PROGRESS`/`COMPLETED`, default `OPEN`), `bookmarkedBy` (ref `User`, default `[]`), plus `timestamps`.

2. **`backend/utils/formatProject.js`** (new):
   * Shared response shaper mirroring `formatUser`. Returns references as raw ObjectIds (no population in Phase 4).

3. **`backend/utils/paginate.js`** (new):
   * `parsePagination(query)` → `{ page, limit, skip }` with defaults (1/10), `limit` hard-capped at 100, and clamping of invalid values.
   * `buildPagination({ totalCount, page, limit })` → `{ currentPage, totalPages, totalCount }` (empty set → `totalPages: 0`).

4. **`backend/controllers/projectController.js`** (new):
   * `createProject` (owner = caller, `memberIds = [ownerId]`, `status = OPEN`, allowlisted body).
   * `listProjects` (search title/description, filter category/difficulty/status/skills, pagination, newest-first).
   * `getProjectById` (`isValidObjectId` guard → `404`).
   * `updateProject` (owner-only, allowlisted editable fields, `teamSize >= members` guard, `runValidators`).
   * `updateStatus` (owner-only, forward-only transition map).
   * `deleteProject` (owner-only, `200` confirmation envelope).
   * `addBookmark` / `removeBookmark` (idempotent via `$addToSet` / `$pull`).

5. **`backend/routes/projectRoutes.js`** (new) + **`backend/app.js`** (modified):
   * Public reads (`GET /`, `GET /:id`); authenticated writes (`POST /`, `PUT /:id`, `PATCH /:id/status`, `DELETE /:id`); bookmarks (`POST/DELETE /:id/bookmark`). Mounted at `/api/projects`.

6. **`backend/controllers/userController.js`** + **`backend/routes/userRoutes.js`** (modified):
   * `searchUsers` → `GET /api/users/search` (private): skill/name search, paginated, excludes the requesting user, shaped by `formatUser` (no password). Registered before any `/:id` route.

7. **Tests** (`backend/tests/project.test.js` new, `backend/tests/paginate.test.js` new, `backend/tests/user.test.js` extended):
   * Model validation/defaults/enums/URL/timestamps; pagination helper units; project CRUD; authorization (owner-only, 401/403); search/filter/pagination; status transitions; idempotent bookmarking; user skill search.

### Phase 4 Verification Results

* **Test suite**: 92/92 passing across 4 suites (auth 17, user 15, paginate 13, project 47).
* **CRUD**: create `201`, owner is sole initial member, status `OPEN`; owner-only update/delete/status enforced (`403` for non-owners).
* **Search/filter/pagination**: title/description search, category/difficulty/status/skills filters, `page`/`limit` with `{ results, pagination }`; invalid enum filter → `400`; empty set → `totalPages: 0`.
* **Status transitions**: forward-only enforced; backward/skip/no-op/unknown → `400`.
* **Bookmarking**: idempotent add/remove, always `200`.
* **User search**: matches by skill/name, excludes self, never leaks password.
* **Scope boundary**: no collaboration requests, tasks, chat, or member-management endpoints (deferred to Phase 5+). No new dependencies. Auth and shared `errorHandler` untouched.

### Key Architectural Decisions Applied

| Decision | Applied In |
| :--- | :--- |
| ADR-024: `Project` schema with `difficulty` enum + optional `repositoryUrl`/`projectImage` | `models/Project.js`, `docs/architecture.md` §7 |
| ADR-025: References returned as raw ObjectIds (no population) in Phase 4 | `utils/formatProject.js` |
| ADR-026: Shared `paginate` util; list responses use `{ results, pagination }` | `utils/paginate.js`, project list, user search |
| ADR-027: Owner-only mutations; forward-only status state machine | `controllers/projectController.js` |
| ADR-028: Idempotent bookmarking via `$addToSet` / `$pull` | `controllers/projectController.js` |
| ADR-029: Invalid ObjectId handled by controller-level guard → `404` (shared `errorHandler` untouched) | `controllers/projectController.js` |
| ADR-030: `GET /api/users/search` excludes self to seed Phase 5 collaboration requests | `controllers/userController.js` |

---

## 🟢 Phase 5: Collaboration Requests

* **Completion Date**: September 18, 2026
* **Status**: **COMPLETED**

### Summary of What Was Built

1. **`backend/models/CollaborationRequest.js`** (new):
   * Schema: `projectId` (ref `Project`), `senderId` (ref `User`), `message` (optional, max 1000), `status` (enum `PENDING`/`ACCEPTED`/`REJECTED`, default `PENDING`), timestamps. Index on `{ projectId, senderId }`.

2. **`backend/utils/formatRequest.js`** (new):
   * Response shaper for a request (raw ObjectIds, consistent with Phase 4 conventions).

3. **`backend/controllers/requestController.js`** (new):
   * `createRequest` — enforces `OPEN`-only, no self-request, not-already-a-member, and no duplicate `PENDING` request (`409`).
   * `listProjectRequests` — owner-only, paginated, optional `status` filter.
   * `decideRequest` — owner-only accept/reject; only `PENDING` decidable; on `ACCEPTED` checks `teamSize` capacity and `$addToSet`s the sender into `Projects.memberIds`; on `REJECTED` no membership change.
   * `getProjectTeam` — returns owner + members (via `formatUser`, no password).

4. **Routing** (`backend/routes/projectRoutes.js` modified, `backend/routes/requestRoutes.js` new, `backend/app.js` modified):
   * `POST /api/projects/:id/requests`, `GET /api/projects/:id/requests`, `GET /api/projects/:id/team` (all authenticated).
   * `PATCH /api/requests/:id` (authenticated, owner-only) mounted at `/api/requests`.

5. **Tests** (`backend/tests/request.test.js` new):
   * Create (success, self-request, not-OPEN, duplicate `409`, already-member, 401, 404).
   * Decide (accept + member sync, reject, non-owner `403`, already-decided `400`, invalid value `400`, capacity `400`, 401, 404).
   * List (owner paginated, non-owner `403`). Team (owner-as-sole-member, 401).

### Phase 5 Verification Results

* **Test suite**: 111/111 passing across 5 suites (auth 17, user 15, paginate 13, project 47, request 19).
* **Membership sync**: accepting a request adds the sender to `Projects.memberIds` (verified via the team endpoint); rejecting leaves membership unchanged.
* **Capacity**: acceptance is blocked with `400` when `memberIds.length >= teamSize`.
* **Rules**: `OPEN`-only, no self-request, no duplicate pending, owner-only decisions all enforced.
* **Scope boundary**: no tasks, chat, or member-removal endpoints (later phases). No new dependencies. Auth and shared `errorHandler` untouched.

### Key Architectural Decisions Applied

| Decision | Applied In |
| :--- | :--- |
| ADR-031: Single `PATCH /api/requests/:id` with `{ status }` body (not split accept/reject) | `routes/requestRoutes.js`, `controllers/requestController.js` |
| ADR-032: Duplicate active request returns `409`; other rule violations return `400` | `controllers/requestController.js` createRequest |
| ADR-033: Capacity measured as `memberIds.length` vs `teamSize` (owner counts as a member) | `controllers/requestController.js` decideRequest |
| ADR-034: Accepting syncs membership via `$addToSet` (idempotent); rejecting does not | `controllers/requestController.js` decideRequest |
| ADR-035: `GET /api/projects/:id/team` returns members as password-free user profiles | `controllers/requestController.js` getProjectTeam |

---

## 🟢 Phase 6: Team Workspace & Tasks

* **Completion Date**: September 18, 2026
* **Status**: **COMPLETED**

### Summary of What Was Built

1. **`backend/models/Task.js`** (new):
   * Schema: `projectId` (ref `Project`), `title` (3–120), `description` (optional, max 5000), `assignedTo` (ref `User`, nullable, default `null`), `status` (enum `TODO`/`IN_PROGRESS`/`COMPLETED`, default `TODO`), `dueDate` (nullable), timestamps. Index on `projectId`.

2. **`backend/utils/formatTask.js`** (new):
   * Response shaper for a task (raw ObjectIds).

3. **`backend/controllers/taskController.js`** (new):
   * Shared `isTeamMember(project, userId)` helper (owner or in `memberIds`).
   * `createTask` — team-only; validates assignee is a team member; defaults `assignedTo`/`dueDate` to `null`; status `TODO`.
   * `listTasks` — team-only, paginated, optional `status` filter, newest-first.
   * `updateTask` — team-only; forward-only status transitions; assignee must be a team member; allowlisted editable fields (`title`, `description`, `assignedTo`, `dueDate`).
   * `deleteTask` — team-only; `200` confirmation envelope.

4. **Routing** (`backend/routes/projectRoutes.js` modified, `backend/routes/taskRoutes.js` new, `backend/app.js` modified):
   * `POST /api/projects/:id/tasks`, `GET /api/projects/:id/tasks` (team-only).
   * `PATCH /api/tasks/:id`, `DELETE /api/tasks/:id` (team-only) mounted at `/api/tasks`.

5. **Tests** (`backend/tests/task.test.js` new):
   * Create (member 201, non-member 403, non-member assignee 400, member assignee 201, missing title 400, 401, 404).
   * List (paginated, status filter, non-member 403).
   * Update (forward status, invalid/backward/unknown 400, assignee validation, non-member 403, 404, 401).
   * Delete (member 200 + list emptied, non-member 403, 404).

### Phase 6 Verification Results

* **Test suite**: 127/127 passing across 6 suites (auth 17, user 15, paginate 13, project 47, request 19, task 16).
* **Authorization**: all task operations restricted to team members (owner or `memberIds`); non-members receive `403`.
* **Assignee validation**: assigning a non-member returns `400` on both create and update.
* **Status**: forward-only `TODO → IN_PROGRESS → COMPLETED`; backward/skip/unknown → `400`.
* **Scope boundary**: no chat/messages, no showcases. No new dependencies. Auth and shared `errorHandler` untouched.

### Key Architectural Decisions Applied

| Decision | Applied In |
| :--- | :--- |
| ADR-036: Any project team member (owner or `memberIds`) may create/edit/delete tasks | `controllers/taskController.js` |
| ADR-037: `DELETE /api/tasks/:id` included (roadmap deliverable) and documented in api-contract | `routes/taskRoutes.js`, `docs/api-contract.md` |
| ADR-038: `assignedTo` optional (default `null`); if set, must be a current team member | `models/Task.js`, `controllers/taskController.js` |
| ADR-039: Task status is forward-only `TODO → IN_PROGRESS → COMPLETED` (mirrors project-status convention) | `controllers/taskController.js` |

---

## 🟢 Phase 7: Chat & Real-Time Communication

* **Completion Date**: September 18, 2026
* **Status**: **COMPLETED**

### Summary of What Was Built

1. **`backend/models/Message.js`** (new):
   * Schema: `projectId` (ref `Project`), `senderId` (ref `User`), `message` (required, 1–2000), timestamps. Index `{ projectId: 1, createdAt: -1 }`.

2. **`backend/utils/formatMessage.js`** (new): response/broadcast shaper (raw ObjectIds).

3. **`backend/utils/teamAccess.js`** (new): shared `isTeamMember(project, userId)` helper — extracted verbatim from the Phase 6 task controller and reused by task, message, and socket layers. Phase 6 behavior unchanged (verified by the existing 16 task tests staying green).

4. **`backend/controllers/messageController.js`** (new):
   * `sendMessage` — team-only; `senderId` taken from JWT; persists then broadcasts `message:new` to `project:<id>` via `getIo()` (no-op when sockets aren't initialized, e.g. REST tests). Single write path.
   * `listMessages` — team-only, paginated, newest-first.

5. **`backend/socket/index.js`** (new):
   * `initSocket(httpServer)` creates the Socket.IO server (CORS from `CLIENT_URL`); `io.use` verifies the JWT at the handshake and attaches `socket.user`.
   * `join_project`/`leave_project` events; join re-checks team membership before `socket.join`. `getIo()` accessor for the controller. The socket layer never writes to the DB.

6. **Routing & bootstrap** (`backend/routes/projectRoutes.js`, `backend/server.js` modified):
   * `POST /api/projects/:id/messages`, `GET /api/projects/:id/messages` (team-only).
   * `server.js` now wraps the Express app in `http.createServer` and calls `initSocket(server)`; `app.js` stays a pure Express app so REST tests need no socket server.

7. **Dependencies**: added `socket.io@4.7.5` (dependency) and `socket.io-client@4.7.5` (devDependency, for socket integration tests), pinned exactly.

8. **Tests** (`backend/tests/message.test.js`, `backend/tests/socket.test.js` new):
   * REST: send `201` + persistence, senderId forced from token, empty/whitespace/too-long `400`, non-member `403`, unknown project `404`, no token `401`; paginated newest-first history, empty history, non-member `403`.
   * Socket: bad token rejected at handshake; team member joins and receives `message:new`; non-member join rejected; room isolation (message to project A not delivered to a socket in project B).

### Phase 7 Verification Results

* **Test suite**: 140/140 passing across 8 suites (auth 17, user 15, paginate 13, project 47, request 19, task 16, message 9, socket 4).
* **No duplicate persistence**: messages are written only by the REST endpoint; the socket layer only broadcasts. Verified by the `Message.countDocuments` assertion (exactly 1 after a send).
* **Phase 6 unchanged**: task tests remain green after the `isTeamMember` extraction.
* **Auth**: REST endpoints team-only; socket connections require a valid JWT and membership-checked room joins.
* **Scope boundary**: no message edit/delete, no typing/read receipts, no direct messaging, no Redis adapter. Auth and shared `errorHandler` untouched.

### Key Architectural Decisions Applied

| Decision | Applied In |
| :--- | :--- |
| ADR-040: Socket.IO added (`socket.io` + `socket.io-client` dev), attached to the same HTTP server | `server.js`, `socket/index.js`, `package.json` |
| ADR-041: REST send is the single write path; socket only broadcasts (no duplicate persistence) | `controllers/messageController.js` |
| ADR-042: Socket connections authenticate via JWT handshake; room joins re-check team membership | `socket/index.js` |
| ADR-043: `isTeamMember` extracted to `utils/teamAccess.js`, shared across task/message/socket | `utils/teamAccess.js`, `controllers/taskController.js` |
| ADR-044: Message history is newest-first paginated (`{ results, pagination }` convention) | `controllers/messageController.js` |
| ADR-045: Single-process in-memory Socket.IO; Redis adapter deferred (scaling) | `socket/index.js` |

---

## 🟢 Phase 8: Showcase & Social Features

* **Completion Date**: September 18, 2026
* **Status**: **COMPLETED**

### Summary of What Was Built

1. **`backend/models/Showcase.js`** (new):
   * Schema: `projectId` (ref `Project`, **unique**), `title` (3–120), `description` (10–5000), `technologies` (`[String]`), `githubUrl`/`demoUrl` (optional `http(s)` URLs), `images` (`[String]`, default `[]`), `likesCount` (default 0, min 0), `likedBy` (ref `User`, default `[]`), `comments` (embedded subdocs), timestamps. Indexes: unique `projectId`, `{ createdAt: -1 }`.
   * Embedded comment subschema (`_id`, `userId` ref `User`, `text` 1–1000, `createdAt`) — no separate collection.

2. **`backend/utils/formatShowcase.js`** (new): `formatShowcase` + `formatComment` — raw ObjectIds only, so no user/project profile fields (emails, passwords) are ever exposed.

3. **`backend/controllers/showcaseController.js`** (new):
   * `publishShowcase` — owner-only + `COMPLETED`-project gate; allowlisted publish fields; duplicate `projectId` (`error.code === 11000`) → `409`.
   * `listShowcases` / `getShowcaseById` — public, paginated feed + single detail.
   * `likeShowcase` / `unlikeShowcase` — idempotent (`$addToSet` / `$pull`); `syncLikes` keeps `likesCount === likedBy.length`.
   * `listComments` — public, paginated over the embedded array, newest-first.
   * `addComment` — authenticated; `userId` from JWT (never body).

4. **Routing** (`backend/routes/showcaseRoutes.js` new, `backend/app.js` modified): public reads (`/`, `/:id`, `/:id/comments`); authenticated writes (`POST /`, `POST/DELETE /:id/like`, `POST /:id/comments`) mounted at `/api/showcases`.

5. **Tests** (`backend/tests/showcase.test.js` new):
   * Publish (owner+COMPLETED 201, not-COMPLETED 400, non-owner 403, duplicate 409, server-controlled fields ignored, validation/unknown/auth).
   * Public feed + detail (empty, paginated, unknown 404).
   * Idempotent likes with accurate `likesCount`; 401 without token.
   * Comments (authenticated create with userId from token, empty/too-long 400, auth; public paginated newest-first list).

6. **Docs cleanup**: removed the pre-existing duplicate `[PLANNED]` Bookmarks block from `api-contract.md` §8 (bookmarks were implemented in Phase 4 and documented under §3 Projects). No bookmark functionality changed.

### Phase 8 Verification Results

* **Test suite**: 154/154 passing across 9 suites (auth 17, user 15, paginate 13, project 47, request 19, task 16, message 9, socket 4, showcase 14).
* **One showcase per project**: enforced by a unique `projectId` index; duplicate publish → `409`.
* **Completion gate**: publishing a non-`COMPLETED` project → `400`; succeeds after `COMPLETED`.
* **Likes**: idempotent; `likesCount` always equals `likedBy.length`.
* **Access**: feed/detail/comment reads public; like/unlike/comment authenticated with actor id from JWT.
* **Scope boundary**: no comment/showcase edit or delete, no reporting (Phase 9), no Cloudinary upload (deferred). Auth and shared `errorHandler` untouched; no new dependencies.

### Key Architectural Decisions Applied

| Decision | Applied In |
| :--- | :--- |
| ADR-046: One showcase per project via unique `projectId` index; duplicate → `409` | `models/Showcase.js`, `controllers/showcaseController.js` |
| ADR-047: Publish gated on project owner + `COMPLETED` status | `controllers/showcaseController.js` |
| ADR-048: `likedBy` is source of truth; `likesCount` synced on each toggle | `controllers/showcaseController.js` |
| ADR-049: Comments embedded; reads paginated over the array, newest-first | `models/Showcase.js`, `controllers/showcaseController.js` |
| ADR-050: Formatter exposes only IDs (no user/project profile data) | `utils/formatShowcase.js` |
| ADR-051: Removed duplicate `[PLANNED]` Bookmarks doc entry (Phase 4 already implemented) | `docs/api-contract.md` |

---

## 🟢 Phase 9: Administration

* **Completion Date**: September 18, 2026
* **Status**: **COMPLETED**

### Summary of What Was Built

1. **`backend/models/Report.js`** (new): `reporterId` (ref `User`), `targetType` (enum USER/PROJECT/SHOWCASE/COMMENT), `targetId` (any valid ObjectId), `reason` (3–1000), `status` (enum PENDING/RESOLVED/DISMISSED, default PENDING), timestamps. Index `{ status: 1, createdAt: -1 }`. `utils/formatReport.js` added.

2. **`backend/models/User.js`** (modified): added `status` (`active`/`suspended`, default `active`); `utils/formatUser.js` now returns `status`.

3. **Authentication-path changes** (the highest-risk item):
   * `authController.login` — suspended user → `403` (no token issued).
   * `authMiddleware` — now async; after `jwt.verify` it loads the account (`.select('status')`) and rejects a missing or suspended user with `401`, so previously issued JWTs stop working immediately. `req.user` shape unchanged (`{ userId, role }`).
   * `socket/index.js` — `join_project` re-checks account status and rejects suspended users. Forced disconnect of already-connected sockets is deferred (documented).

4. **`backend/controllers/reportController.js` + `routes/reportRoutes.js`** (new): `POST /api/reports` (authenticated; `reporterId` from JWT).

5. **`backend/controllers/adminController.js` + `routes/adminRoutes.js`** (new; first use of `adminMiddleware`):
   * `GET /api/admin/users` (paginated), `PATCH /api/admin/users/:id/status` (suspend/restore; self-suspension → `400`).
   * `GET /api/admin/projects` (paginated), `DELETE /api/admin/projects/:id` (application-level cascade: Tasks → Messages → CollaborationRequests → Showcase → Project).
   * `GET /api/admin/reports` (paginated), `PATCH /api/admin/reports/:id` (RESOLVED/DISMISSED).
   * `GET /api/admin/statistics` (users by role/status, projects by status, showcases, reports by status).

6. **`backend/app.js`** (modified): mounted `/api/reports` and `/api/admin`.

7. **Tests** (`backend/tests/report.test.js`, `backend/tests/admin.test.js` new; `backend/tests/socket.test.js` extended):
   * Reports: create 201 + reporter from token, invalid targetType/missing reason → 400, 401.
   * Admin authz: 401 without token and 403 for students on every admin route; 200 for a seeded admin (elevated in the DB then re-logged in).
   * Suspended-user auth (critical regression): suspended login → 403; a token issued before suspension → 401 afterwards; restored user can log in again.
   * User management: suspend/restore, self-suspension → 400, invalid status → 400, unknown id → 404.
   * Project delete cascade: seed task+message+request+showcase → delete → all dependent collections emptied + project gone; unknown → 404.
   * Report moderation: list paginated, resolve/dismiss, invalid value → 400, unknown → 404.
   * Statistics: bucket counts verified.
   * Suspended socket: a user suspended after connecting is rejected on `join_project`.

### Phase 9 Verification Results

* **Test suite**: 173/173 passing across 11 suites (auth 17, user 15, paginate 13, project 47, request 19, task 16, message 9, socket 5, showcase 14, report 4, admin 14).
* **Auth-path regression**: all 154 prior tests remain green after `authMiddleware` became async with a per-request status lookup; `req.user` shape preserved.
* **Cascade**: verified all dependent documents are removed for a deleted project.
* **Self-protection**: admins cannot suspend their own account.

### Key Architectural Decisions Applied

| Decision | Applied In |
| :--- | :--- |
| ADR-052: `User.status` (`active`/`suspended`); suspended users blocked at login (`403`) | `models/User.js`, `authController.js` |
| ADR-053: `authMiddleware` re-checks status per request → previously issued JWTs rejected (`401`) | `middleware/authMiddleware.js` |
| ADR-054: Suspended users blocked from protected socket actions; forced disconnect deferred | `socket/index.js` |
| ADR-055: First use of `adminMiddleware` — all `/api/admin/*` gated by role | `routes/adminRoutes.js` |
| ADR-056: Admins cannot suspend their own account | `controllers/adminController.js` |
| ADR-057: Admin project delete uses ordered application-level cascade (no transaction) | `controllers/adminController.js` |
| ADR-058: Reports accept any valid ObjectId target; existence not verified | `models/Report.js`, `controllers/reportController.js` |
| ADR-059: Statistics shape — users by role/status, projects by status, showcases, reports by status | `controllers/adminController.js` |
