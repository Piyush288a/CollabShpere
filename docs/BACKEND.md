# CollabSphere — Backend (Authoritative Reference)

This is the single authoritative reference for the CollabSphere backend. It describes the system **as actually implemented** (verified against the route, controller, model, middleware, and socket files), not the roadmap. Everything documented here is live; there are no planned/unimplemented endpoints in this document.

- **Base URL**: `http://localhost:5000`
- **API base path**: `/api`
- **Current backend scope**: Phases 0–9 complete (auth, profiles, projects, collaboration requests, tasks, messaging + Socket.IO, showcases/social, administration/moderation).
- **Automated tests**: 176 passing across 12 Jest/Supertest suites.

---

## 1. Backend Overview

**Purpose.** CollabSphere is a university collaboration platform. The backend is a REST API (with a Socket.IO real-time layer) that manages users, projects, team formation, workspace tasks, chat, public showcases, and admin moderation.

**Technology stack.**
- Node.js + Express 4 (REST)
- MongoDB + Mongoose 8 (persistence)
- JSON Web Tokens (`jsonwebtoken`) for auth; `bcryptjs` for password hashing
- Socket.IO 4 for real-time chat (shares the HTTP server)
- `cors`, `dotenv`
- Jest + Supertest (+ `socket.io-client`) for testing

**Architecture responsibilities.** The Express app (`app.js`) wires global middleware, feature routers, a 404 handler, and a centralized error handler. `server.js` wraps the app in an HTTP server, attaches Socket.IO, connects to MongoDB, and listens. Controllers hold business logic; models define schemas + validation; utilities provide shared response shaping and pagination.

---

## 2. Project Structure

```
backend/
├── app.js                 # Express app: middleware, routes, 404, error handler (exported, no listen)
├── server.js              # HTTP server + Socket.IO + DB connect + listen (entry point)
├── config/
│   └── db.js              # connectDB(): Mongoose connection, exits process on failure
├── middleware/
│   ├── authMiddleware.js  # authMiddleware (JWT + suspension re-check), adminMiddleware (role)
│   └── errorHandler.js    # centralized error handler + Mongoose ValidationError -> 400
├── models/
│   ├── User.js            # Users (auth, profile, role, status)
│   ├── Project.js         # Projects (lifecycle, team, bookmarks)
│   ├── CollaborationRequest.js
│   ├── Task.js
│   ├── Message.js
│   ├── Showcase.js        # includes embedded comment subschema
│   └── Report.js
├── controllers/
│   ├── authController.js  # register, login
│   ├── userController.js  # getProfile, updateProfile, searchUsers
│   ├── projectController.js
│   ├── requestController.js  # createRequest, listProjectRequests, decideRequest, getProjectTeam
│   ├── taskController.js
│   ├── messageController.js
│   ├── showcaseController.js
│   ├── reportController.js
│   └── adminController.js
├── routes/
│   ├── authRoutes.js      # /api/auth
│   ├── userRoutes.js      # /api/users
│   ├── projectRoutes.js   # /api/projects (+ nested requests/team/tasks/messages)
│   ├── requestRoutes.js   # /api/requests
│   ├── taskRoutes.js      # /api/tasks
│   ├── showcaseRoutes.js  # /api/showcases
│   ├── reportRoutes.js    # /api/reports
│   └── adminRoutes.js     # /api/admin (authMiddleware + adminMiddleware)
├── socket/
│   └── index.js           # initSocket, getIo, roomName; JWT handshake, join/leave rooms
├── utils/
│   ├── formatUser.js      # password-free user shape
│   ├── formatProject.js
│   ├── formatRequest.js
│   ├── formatTask.js
│   ├── formatMessage.js
│   ├── formatShowcase.js  # formatShowcase + formatComment
│   ├── formatReport.js
│   ├── paginate.js        # parsePagination, buildPagination
│   └── teamAccess.js      # isTeamMember(project, userId)
└── tests/                 # Jest + Supertest suites (12 files)
```

---

## 3. Architecture

**REST request flow:**
```
Client
  -> Express (app.js): cors -> express.json()
  -> Router (routes/*.js)
  -> Middleware (authMiddleware / adminMiddleware where applicable)
  -> Controller (controllers/*.js)  -- business logic + validation
  -> Model (models/*.js)            -- Mongoose schema + validators
  -> MongoDB
  <- Controller builds { success, data } via a format* helper
  <- errorHandler catches next(err) -> { success:false, message }
```

**Real-time flow:**
```
Client
  -> Socket.IO (socket/index.js), JWT verified at handshake (io.use)
  -> join_project { projectId } -> membership re-checked -> socket joins room "project:<id>"
  -> On REST POST /api/projects/:id/messages, the controller persists the message
     then emits "message:new" to room "project:<id>"
  <- All sockets currently in that room receive the message
```

The REST message endpoint is the **single database write path**; the socket layer only broadcasts.

---

## 4. Database (7 Collections)

All schemas use `{ timestamps: true }` (adding `createdAt` / `updatedAt`) unless noted.

### 4.1 Users (`User.js`)
- **Purpose**: student & admin accounts (auth + profile).
- **Fields**: `name` (req), `email` (req, unique, lowercase, regex-validated), `password` (req, min 6, `select:false`), `role` (`student`|`admin`, default `student`), `status` (`active`|`suspended`, default `active`), `avatar` (default `null`), `skills` (`[String]`), `bio`, `githubUrl`, `linkedinUrl`.
- **Behavior**: pre-save hook hashes the password with bcrypt (10 rounds) when modified; `matchPassword()` compares. `password` is never returned (both `select:false` and excluded by `formatUser`).
- **Lifecycle**: `active` <-> `suspended` via admin. Suspended users cannot log in and their tokens are rejected.

### 4.2 Projects (`Project.js`)
- **Purpose**: collaboration projects.
- **Fields**: `ownerId` (ref User, req), `memberIds` ([ref User], default `[]` — set to `[ownerId]` on create), `title` (3–120), `description` (10–5000), `category` (req string), `requiredSkills` (`[String]`), `teamSize` (int 1–50), `deadline` (Date, req), `difficulty` (`Beginner`|`Intermediate`|`Advanced`, req), `repositoryUrl` (optional, `http(s)` when set), `projectImage` (default `null`), `status` (`OPEN`|`IN_PROGRESS`|`COMPLETED`, default `OPEN`), `bookmarkedBy` ([ref User]).
- **Lifecycle**: forward-only `OPEN -> IN_PROGRESS -> COMPLETED`.

### 4.3 CollaborationRequests (`CollaborationRequest.js`)
- **Purpose**: requests to join a project.
- **Fields**: `projectId` (ref Project, req), `senderId` (ref User, req), `message` (<=1000, default `''`), `status` (`PENDING`|`ACCEPTED`|`REJECTED`, default `PENDING`).
- **Index**: `{ projectId, senderId }`.

### 4.4 Tasks (`Task.js`)
- **Purpose**: workspace tasks.
- **Fields**: `projectId` (ref Project, req), `title` (3–120), `description` (<=5000, default `''`), `assignedTo` (ref User, nullable, default `null`), `status` (`TODO`|`IN_PROGRESS`|`COMPLETED`, default `TODO`), `dueDate` (Date, nullable).
- **Index**: `{ projectId }`. **Lifecycle**: forward-only `TODO -> IN_PROGRESS -> COMPLETED`.

### 4.5 Messages (`Message.js`)
- **Purpose**: workspace chat history.
- **Fields**: `projectId` (ref Project, req), `senderId` (ref User, req), `message` (req, 1–2000).
- **Index**: `{ projectId, createdAt: -1 }`.

### 4.6 Showcases (`Showcase.js`)
- **Purpose**: public showcase for a completed project.
- **Fields**: `projectId` (ref Project, req, **unique**), `title` (3–120), `description` (10–5000), `technologies` (`[String]`), `githubUrl`/`demoUrl` (optional `http(s)`), `images` (`[String]`), `likesCount` (default 0, min 0), `likedBy` ([ref User]), `comments` (embedded subdocs).
- **Embedded comment**: `{ _id, userId (ref User, req), text (1–1000, req), createdAt }`.
- **Indexes**: unique `projectId`, `{ createdAt: -1 }`. **Rule**: one showcase per project.

### 4.7 Reports (`Report.js`)
- **Purpose**: moderation reports.
- **Fields**: `reporterId` (ref User, req), `targetType` (`USER`|`PROJECT`|`SHOWCASE`|`COMMENT`, req), `targetId` (ObjectId, req — existence not verified), `reason` (3–1000, req), `status` (`PENDING`|`RESOLVED`|`DISMISSED`, default `PENDING`).
- **Index**: `{ status, createdAt: -1 }`.

---

## 5. Authentication

- **Registration** (`POST /api/auth/register`): validates required fields, rejects duplicate email (`409`), creates the user (password hashed by the pre-save hook), returns a JWT + password-free user. `role` cannot be set here (defaults to `student`).
- **Login** (`POST /api/auth/login`): verifies password with bcrypt; **suspended users are rejected with `403` and receive no token**; otherwise returns a JWT + user.
- **JWT**: signed with `JWT_SECRET`, expiry `JWT_EXPIRES_IN` (default `7d`), payload `{ userId, role }`.
- **authMiddleware**: requires `Authorization: Bearer <token>`; verifies the JWT; then **re-loads the account and rejects it with `401` if missing or `status === 'suspended'`** (so previously issued tokens stop working immediately after suspension). Attaches `req.user = { userId, role }`.
- **adminMiddleware**: must run after `authMiddleware`; requires `role === 'admin'`, else `403`.

There is no server-side logout endpoint; JWTs are stateless and simply expire (or are rejected once the account is suspended).

---

## 6. Authorization Model

- **Public**: `GET /api/health`, project feed/detail (`GET /api/projects`, `GET /api/projects/:id`), showcase feed/detail/comments (`GET /api/showcases`, `/:id`, `/:id/comments`).
- **Authenticated (any user)**: profile read/update, user search, project create, bookmarks, collaboration request creation, showcase like/unlike & comment, report creation.
- **Owner-only**: project update/delete/status; collaboration request decisions (accept/reject); showcase publish. Checked via `String(project.ownerId) === req.user.userId` -> else `403`.
- **Team member (owner or in `memberIds`)**: tasks (create/list/update/delete), messages (send/list), team view, and socket room join. Checked via `isTeamMember(project, userId)`.
- **Admin-only**: everything under `/api/admin/*`.
- **Suspended users**: blocked at login (`403`), on every authenticated REST request (`401`), and on protected socket actions (`join_project` rejected).

Examples: User B cannot edit User A's project (`403`); a non-member cannot read a project's tasks or messages (`403`); a student cannot call any admin route (`403`).

---

## 7. Complete API Reference

Envelope: success `{ "success": true, "data": ... }`; error `{ "success": false, "message": "..." }`. Lists use `data: { results, pagination: { currentPage, totalPages, totalCount } }`.

### Health
**GET `/api/health`** — Public. `200` `{ success:true, data:{ message:"Server is running" } }`.

### Authentication
**POST `/api/auth/register`** — Public. Body `{ name, email, password }`. `201` `{ data:{ token, user } }`. Errors: missing fields `400`, invalid email `400`, duplicate `409`.

**POST `/api/auth/login`** — Public. Body `{ email, password }`. `200` `{ data:{ token, user } }`. Errors: missing fields `400`, bad credentials `401`, suspended `403`.

### Users
**GET `/api/users/profile`** — Private. `200` `{ data:{ user } }`. No token `401`.

**PUT `/api/users/profile`** — Private. Body (any subset) `{ name, bio, skills, githubUrl, linkedinUrl, avatar }`. `email`/`password`/`role`/`status` are ignored (allowlist). Validation `400`; no token `401`.

**GET `/api/users/search`** — Private. Query `skills` (CSV, ANY match), `search` (name), `page`, `limit`. Excludes the caller. `200` `{ data:{ results, pagination } }` (password-free). No token `401`.

### Projects
**POST `/api/projects`** — Private. Body `{ title, description, category, requiredSkills?, teamSize, deadline, difficulty, repositoryUrl?, projectImage? }`. Server-controlled fields ignored; `ownerId` = caller, `memberIds` = `[ownerId]`, `status` = `OPEN`. `201`. Validation `400`; no token `401`.

**GET `/api/projects`** — Public. Query `search` (title/description), `category`, `difficulty`, `status`, `skills` (CSV ANY), `page`, `limit`. Newest-first. `200` `{ data:{ results, pagination } }`. Invalid `difficulty`/`status` filter `400`.

**GET `/api/projects/:id`** — Public. `200` `{ data:{ project } }`. Unknown/malformed id `404`.

**PUT `/api/projects/:id`** — Private, owner. Editable: `title, description, category, requiredSkills, teamSize, deadline, difficulty, repositoryUrl, projectImage`. `teamSize` below current member count `400`. Non-owner `403`; unknown id `404`.

**PATCH `/api/projects/:id/status`** — Private, owner. Body `{ status }`. Forward-only; invalid value or transition `400`; non-owner `403`; unknown id `404`.

**DELETE `/api/projects/:id`** — Private, owner. `200` `{ data:{ message:"Project deleted", id } }`. Non-owner `403`; unknown id `404`. (This is the owner delete; the admin delete cascades — see §10.)

**POST `/api/projects/:id/bookmark`** — Private. Idempotent add (`$addToSet`). `200` `{ data:{ project } }`. No token `401`; unknown id `404`.

**DELETE `/api/projects/:id/bookmark`** — Private. Idempotent remove (`$pull`). `200`. No token `401`; unknown id `404`.

### Collaboration Requests
**POST `/api/projects/:id/requests`** — Private. Body `{ message? }`. Rules: project must be `OPEN` (`400`), no self-request (`400`), not already a member (`400`), no duplicate `PENDING` (`409`). `201` `{ data:{ request } }`. Unknown project `404`; no token `401`.

**GET `/api/projects/:id/requests`** — Private, owner. Query `status?` (`PENDING`/`ACCEPTED`/`REJECTED`), `page`, `limit`. `200` `{ data:{ results, pagination } }`. Non-owner `403`; invalid status filter `400`.

**PATCH `/api/requests/:id`** — Private, owner. Body `{ status: "ACCEPTED" | "REJECTED" }`. Only `PENDING` decidable (else `400`). Accept adds sender to `memberIds` if `memberIds.length < teamSize` (else `400` full). Invalid value `400`; non-owner `403`; unknown id `404`.

**GET `/api/projects/:id/team`** — Private. `200` `{ data:{ projectId, ownerId, members:[user...] } }` (password-free). No token `401`; unknown id `404`.

### Tasks (team members only)
**POST `/api/projects/:id/tasks`** — Body `{ title, description?, assignedTo?, dueDate? }`. `assignedTo`, if set, must be a team member (`400`). `201`. Non-member `403`; missing title `400`; unknown project `404`; no token `401`.

**GET `/api/projects/:id/tasks`** — Query `status?`, `page`, `limit`. `200` `{ data:{ results, pagination } }`. Non-member `403`; invalid status filter `400`.

**PATCH `/api/tasks/:id`** — Body any of `{ title, description, assignedTo, dueDate, status }`. Forward-only status (`400` on backward/skip/unknown). Assignee must be a team member (`400`). Non-member `403`; unknown id `404`.

**DELETE `/api/tasks/:id`** — Team member. `200` `{ data:{ message:"Task deleted", id } }`. Non-member `403`; unknown id `404`.

### Messages (team members only)
**POST `/api/projects/:id/messages`** — Body `{ message }` (1–2000). `senderId` from JWT. Persists then broadcasts `message:new`. `201` `{ data:{ message } }`. Empty/too-long `400`; non-member `403`; unknown project `404`; no token `401`.

**GET `/api/projects/:id/messages`** — Query `page`, `limit`. Newest-first. `200` `{ data:{ results, pagination } }`. Non-member `403`.

### Showcases
**POST `/api/showcases`** — Private, owner + project `COMPLETED`. Body `{ projectId, title, description, technologies?, githubUrl?, demoUrl?, images? }`. Server-controlled `likesCount`/`likedBy`/`comments` ignored. `201`. Not completed `400`; non-owner `403`; duplicate `409`; unknown project `404`; no token `401`.

**GET `/api/showcases`** — Public. Query `page`, `limit`. Newest-first. `200` `{ data:{ results, pagination } }`.

**GET `/api/showcases/:id`** — Public. `200` `{ data:{ showcase } }` (with embedded comments). Unknown id `404`.

**POST `/api/showcases/:id/like`** — Private. Idempotent (`$addToSet`); `likesCount` synced to `likedBy.length`. `200`. No token `401`; unknown id `404`.

**DELETE `/api/showcases/:id/like`** — Private. Idempotent (`$pull`); count synced. `200`.

**GET `/api/showcases/:id/comments`** — Public. Query `page`, `limit`. Newest-first over the embedded array. `200` `{ data:{ results, pagination } }`. Unknown id `404`.

**POST `/api/showcases/:id/comments`** — Private. Body `{ text }` (1–1000). `userId` from JWT. `201` `{ data:{ comment } }`. Empty/too-long `400`; no token `401`; unknown id `404`.

### Reports
**POST `/api/reports`** — Private. Body `{ targetType, targetId, reason }`. `reporterId` from JWT; `status` defaults `PENDING`. `targetId` must be a valid ObjectId (existence not verified). `201`. Invalid enum/missing reason `400`; no token `401`.

### Administration (all require admin)
**GET `/api/admin/users`** — Query `page`, `limit`. `200` `{ data:{ results, pagination } }` (password-free).

**PATCH `/api/admin/users/:id/status`** — Body `{ status: "active" | "suspended" }`. An admin cannot suspend their own account (`400`). Invalid value `400`; unknown id `404`.

**GET `/api/admin/projects`** — Query `page`, `limit`. `200` `{ data:{ results, pagination } }`.

**DELETE `/api/admin/projects/:id`** — Cascades (see §9). `200` `{ data:{ message:"Project and related data deleted", id } }`. Unknown id `404`.

**GET `/api/admin/reports`** — Query `page`, `limit`. Newest-first. `200` `{ data:{ results, pagination } }`.

**PATCH `/api/admin/reports/:id`** — Body `{ status: "RESOLVED" | "DISMISSED" }`. Other value `400`; unknown id `404`.

**GET `/api/admin/statistics`** — `200` `{ data:{ statistics:{ users:{ total, byRole:{student,admin}, byStatus:{active,suspended} }, projects:{ total, byStatus:{OPEN,IN_PROGRESS,COMPLETED} }, showcases:{ total }, reports:{ total, byStatus:{PENDING,RESOLVED,DISMISSED} } } } }`.

**Example request/response** (`POST /api/projects`):
```
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json
{ "title":"Campus Study Buddy", "description":"Find study partners.", "category":"Web Development",
  "requiredSkills":["React"], "teamSize":4, "deadline":"2026-12-01", "difficulty":"Intermediate" }

201 Created
{ "success": true, "data": { "project": { "_id":"...", "ownerId":"...", "memberIds":["..."],
  "status":"OPEN", "teamSize":4, "difficulty":"Intermediate", ... } } }
```

---

## 8. Socket.IO

- **Connection**: client connects to the same origin as the HTTP server, providing the JWT via `socket.handshake.auth.token` (or `Authorization: Bearer` header).
- **Authentication**: `io.use` verifies the JWT; missing/invalid → connection rejected (`connect_error`). `socket.user = { userId, role }`.
- **Rooms**: one per project, named `project:<projectId>`.

**Events:**
| Direction | Event | Payload |
| :-- | :-- | :-- |
| C→S | `join_project` | `{ projectId }`; ack `{ ok:true }` or `{ ok:false, message }`. Re-checks account status (suspended → rejected) and team membership. |
| C→S | `leave_project` | `{ projectId }` |
| S→C | `message:new` | the message object (same shape as REST) |
| S→C | `error_event` | `{ message }` |

**Message flow:**
```
REST POST /api/projects/:id/messages  (single DB write)
  -> Message.create(...)
  -> getIo().to("project:<id>").emit("message:new", payload)
  -> connected project-room members receive it
```
Malformed socket events (missing/invalid `projectId`) are answered with an ack `{ ok:false }` and do not crash the server. Disconnects are handled by Socket.IO's built-in room cleanup.

**Suspension behavior**: a user suspended after connecting is rejected the next time they attempt `join_project`. Forced disconnection of an already-open socket is **not** implemented (see §15).

---

## 9. Business Rules

- **Project lifecycle**: forward-only `OPEN -> IN_PROGRESS -> COMPLETED`.
- **Task lifecycle**: forward-only `TODO -> IN_PROGRESS -> COMPLETED`.
- **Membership**: owner is always in `memberIds`; members are added only by accepting a collaboration request.
- **Collaboration requests**: `OPEN` projects only; no self-request; no duplicate `PENDING`; not-already-a-member; accept respects `teamSize`; owner-only decisions.
- **Bookmarks**: idempotent; any authenticated user (incl. owner).
- **Likes**: idempotent; `likedBy` is the source of truth, `likesCount` synced on each toggle.
- **Showcases**: one per project (unique `projectId`), owner-only, project must be `COMPLETED`.
- **Comments**: embedded; public read (paginated, newest-first); authenticated create; `userId` from JWT.
- **Reports**: any authenticated user; target existence not verified.
- **Moderation**: admins resolve/dismiss reports and suspend/restore users.
- **Suspension**: blocks login, authenticated REST, and protected socket actions.
- **Admin privileges**: user/project/report management + statistics; cannot self-suspend.
- **Deletion cascade** (admin): Tasks → Messages → CollaborationRequests → Showcase → Project.

---

## 10. Error Handling

Centralized in `middleware/errorHandler.js`:
- Reads `err.statusCode` (default `500`).
- Mongoose `ValidationError` → `400` with the first validation message.
- Logs to console only when `NODE_ENV !== 'production'` (no stack traces in production responses).
- Always responds `{ success:false, message }`.

Status codes used: `200` success; `201` created; `400` validation/bad input; `401` unauthenticated/invalid or suspended token; `403` forbidden (non-owner/non-member/non-admin/suspended login); `404` not found (incl. malformed ObjectId); `409` conflict (duplicate email / pending request / showcase); `500` unexpected. Unknown routes return `404 { message:"Route not found" }`. Malformed JSON bodies are surfaced as `400` with the standard envelope (no stack leak).

---

## 11. Pagination

Convention (via `utils/paginate.js`):
- Query params `page` (default `1`) and `limit` (default `10`, hard cap `100`); invalid/negative values are clamped.
- `skip = (page - 1) * limit`.
- Response: `data: { results: [...], pagination: { currentPage, totalPages, totalCount } }`.
- Empty result: `results: []`, `totalPages: 0`.

Applies to: project list, user search, project requests, tasks, messages, showcase feed, showcase comments, admin users/projects/reports.

Example: `GET /api/projects?page=2&limit=5`.

---

## 12. Security

**Implemented (verified):**
- Passwords hashed with bcrypt (10 rounds); `select:false`; never returned by any formatter.
- JWT verification on every protected route; **per-request suspension re-check** rejects revoked/suspended tokens.
- Authorization boundaries: owner-only, team-member, admin-only — enforced and tested.
- Mass-assignment protection via field allowlists (project create/update, showcase publish, profile update); server-controlled fields ignored.
- IDOR mitigation: `mongoose.isValidObjectId` guards → `404`; ownership/membership checks before mutation.
- Actor identity (`senderId`, `reporterId`, comment `userId`, bookmark/like user) always taken from the JWT, never the request body.
- CORS restricted to `CLIENT_URL`.
- Error handler avoids leaking stack traces in production; secrets live in `.env` (git-ignored; only `.env.example` placeholders are committed).

**Intentionally deferred (NOT implemented — recorded, not silently added):**
- Rate limiting.
- Helmet / security headers.
- Distributed Socket.IO adapter (e.g. Redis) for multi-process scaling.
- Forced disconnection of already-connected suspended sockets.
- Report `targetId` existence validation.

---

## 13. Testing Architecture

- **Framework**: Jest; **HTTP**: Supertest; **sockets**: `socket.io-client`.
- **Command**: `npm test` (runs `jest --runInBand --forceExit`).
- **Test DB**: a dedicated database via `MONGODB_TEST_URI` (default `mongodb://localhost:27017/collabsphere_test`) — never the dev database. Each suite connects in `beforeAll`, cleans collections in `afterEach`, and drops the DB + closes in `afterAll`.
- **Organization** (12 suites): `app` (health/404/malformed JSON), `auth`, `user`, `project`, `paginate`, `request`, `task`, `message`, `socket`, `showcase`, `report`, `admin`.
- **Categories covered**: model validation/defaults/enums, CRUD, authorization (401/403), search/filter/pagination, status transitions, idempotent bookmarking/likes, membership sync, capacity, cascade deletion, suspended-user auth (login + revoked token + socket), statistics.
- **Total**: 176 tests passing.

Run: from `backend/`, `npm test`.

---

## 14. Complete API Testing With Postman

Files: `docs/postman/CollabSphere-Backend.postman_collection.json` and `docs/postman/CollabSphere-Backend.postman_environment.json`.

### Setup
1. **MongoDB**: ensure a local MongoDB is running (or set `MONGODB_URI`).
2. **Env vars** (`backend/.env`, from `.env.example`): `PORT=5000`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN=7d`, `CLIENT_URL`.
3. **Start the server**: from `backend/`, `npm install` then `npm run dev` (or `npm start`). Confirm `GET http://localhost:5000/api/health` returns `200`.
4. **Postman**: import both JSON files; select the "CollabSphere Backend (Local)" environment. `baseUrl` defaults to `http://localhost:5000`.

### Request order (end-to-end)
Run the folders top to bottom (the Collection Runner works, with two manual admin steps noted):
1. **0. Health** — sanity check.
2. **1. Authentication** — registers User A, User B, and an Admin user; logs in. Test scripts store `userAToken`, `userBToken`, `userAId`, `userBId`.
   - **Manual step**: elevate the admin account to `role:'admin'` in MongoDB: `db.users.updateOne({ email:'carol@university.edu' }, { $set:{ role:'admin' } })`, then run **POST login - Admin** to capture `adminToken`.
3. **2. Users** — profile read/update (verifies email/role are ignored), user search.
4. **3. Projects** — create (stores `projectId`), feed, filters, get, update, bookmarks.
5. **4. Collaboration Requests** — User B requests (stores `requestId`), owner lists, owner accepts (User B becomes a member).
6. **5. Team** — verify owner + member, no passwords.
7. **6. Tasks** — create (stores `taskId`), list, advance status, delete.
8. **7. Messages** — send (stores `messageId`), list. (Socket testing below.)
9. **8. Showcases** — advance project to `COMPLETED`, publish (stores `showcaseId`), feed, detail, like/unlike, comment, list comments.
10. **9. Reports** — file a report (stores `reportId`).
11. **10. Administration** — admin lists, resolve report, statistics, suspend/restore, then delete the project (cascade).

### Positive vs negative tests
Every folder includes negative requests with expected codes: unauthenticated (`401`), invalid token (`401`), non-admin admin call (`403`), non-owner owner-only call (`403`), non-member team call (`403`), duplicate registration (`409`), duplicate request (`409`), duplicate showcase (`409`), invalid ObjectId (`404`), invalid status transition (`400`), invalid input (`400`), invalid report decision (`400`), self-suspension (`400`), suspended login (`403`), and revoked-token access (`401`).

### Suspended-user sequence (manual ordering)
In folder 10: run **PATCH admin ... status = suspended** targeting User A's id, then **POST login - suspended User A** (expect `403`) and **GET profile - suspended token** (expect `401`), then **PATCH admin restore** (active) to re-enable.

### Socket.IO testing guidance
1. Obtain a token (from login).
2. Use a Socket.IO client (Postman's Socket.IO support, or a small `socket.io-client` script) to connect to `http://localhost:5000` with `auth: { token }`.
3. Emit `join_project` with `{ projectId }` (must be a project you own or are a member of) — expect ack `{ ok:true }`; a non-member gets `{ ok:false }`.
4. With the socket joined, send `POST /api/projects/:id/messages` via REST — the socket should receive a `message:new` event.
5. Suspend the user (admin) and emit `join_project` again — expect `{ ok:false }`.

### Final verification checklist
- [ ] `GET /api/health` → 200
- [ ] Register/login for A, B, admin; admin elevated
- [ ] Project create → request → accept → team shows both members
- [ ] Task create/advance/delete
- [ ] Message send + REST list + socket `message:new`
- [ ] Project → COMPLETED → showcase publish → like → comment
- [ ] Report file → admin resolve
- [ ] Statistics shape correct
- [ ] Suspend blocks login + old token; restore re-enables
- [ ] Admin project delete cascades (tasks/messages/requests/showcase gone)
- [ ] All negative tests return the documented codes

A developer can fully test the backend using only this document plus the Postman collection.

---

## 15. Known Limitations / Deferred Improvements

Confirmed from the actual implementation:
- **Per-request DB lookup in `authMiddleware`**: enforcing immediate suspension adds one `User.findById` per authenticated request (middleware is no longer stateless).
- **Socket.IO single-process/in-memory**: no distributed adapter; broadcasts don't span multiple processes.
- **Already-connected suspended sockets are not force-disconnected**: suspension is enforced on the next `join_project`, not by dropping live connections.
- **Report targets are not existence-checked**: `targetId` need only be a valid ObjectId; it may reference deleted content.
- **Project deletion cascade is a sequential application-level cascade**, not a MongoDB transaction; a mid-cascade failure could leave partial deletions.
- **No rate limiting or security headers (Helmet)** are configured.

These are intentional scope decisions, not defects.
