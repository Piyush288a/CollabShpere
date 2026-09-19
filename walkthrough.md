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
