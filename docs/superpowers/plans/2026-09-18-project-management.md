# Implementation Plan — Phase 4: Project Management

* **Date**: September 18, 2026
* **Phase**: 4 — Project Management (Extended)
* **Branch**: `feature/phase-4-project-management`
* **Worktree**: `S:\PROJECTS\CollabSphere-worktrees\phase-4-project-management`
* **Design spec**: [`docs/superpowers/specs/2026-09-18-project-management-design.md`](../specs/2026-09-18-project-management-design.md) (finalized decisions §11, commit `94b75d5`)
* **Status**: PLAN (no implementation yet)
* **Baseline**: 26/26 tests passing (17 auth + 9 user).

---

## 0. Methodology

This plan is **strictly TDD**. Every task follows the same loop:

1. **RED** — write the failing test(s) for the slice.
2. **Run** the suite; **verify the new tests fail** (and existing 26 still pass).
3. **GREEN** — implement the minimum code to pass.
4. **Run** the suite; **verify all pass**.
5. **Commit** at the checkpoint.

**Standing rules** (from Phases 1–3 conventions and spec §1):
* Response envelope: success `{ success: true, data }`; error `{ success: false, message }`.
* Controllers are thin `async` handlers with `try/catch → next(error)`; set `err.statusCode`.
* Reuse the existing `errorHandler` (ValidationError → 400). **Do not modify it.**
* Auth via existing `authMiddleware` (`req.user = { userId, role }`). **Do not modify auth.**
* No new dependencies. No populate. No `$text` index. No member-management endpoints (Phase 5).
* Ownership check pattern: `String(project.ownerId) !== req.user.userId` → `403`.
* Invalid ObjectId → controller-level `mongoose.isValidObjectId` guard → `404`.

**Test command (run from `backend/`)**: `npm test`
**Expected baseline before any change**: `Test Suites: 2 passed`, `Tests: 26 passed`.

---

## 1. Files Created / Modified (full scope)

### Created
| File | Purpose |
| :--- | :--- |
| `backend/models/Project.js` | Mongoose `Project` schema (spec §2). |
| `backend/utils/formatProject.js` | Response shaper for a project (spec §2). |
| `backend/utils/paginate.js` | Shared page/limit parsing + metadata builder (spec §4). |
| `backend/controllers/projectController.js` | All 8 project handlers. |
| `backend/routes/projectRoutes.js` | `/api/projects` route table. |
| `backend/tests/project.test.js` | Project model + API tests. |

### Modified
| File | Change |
| :--- | :--- |
| `backend/app.js` | Mount `projectRoutes` at `/api/projects` (one `app.use` line). |
| `backend/routes/userRoutes.js` | Add `GET /api/users/search` (before any `:id` route). |
| `backend/controllers/userController.js` | Add `searchUsers` handler + export. |
| `backend/tests/user.test.js` | Add user-skill-search tests (regression-safe append). |
| `docs/api-contract.md` | Flip Project endpoints `[PLANNED]→[IMPLEMENTED]`; add `GET /api/users/search`; add `difficulty`/`repositoryUrl`/`projectImage` to schemas. |
| `docs/architecture.md` | Add `difficulty`, `repositoryUrl`, `projectImage` to `Projects` collection §7.1; mark `Projects` live. |
| `docs/development-roadmap.md` | Mark Phase 4 `[COMPLETED]`. |
| `PROJECT_CONTEXT.md` | Append Phase 4 to phase history. |
| `README.md` | Update cumulative phase status + endpoint list. |
| `walkthrough.md` | Append Phase 4 section + ADRs. |

### Explicitly NOT touched
`models/User.js`, `controllers/authController.js`, `middleware/authMiddleware.js`, `middleware/errorHandler.js`, `routes/authRoutes.js`, `tests/auth.test.js`, `package.json` (no dependency changes).

---

## 2. Task Breakdown

Each task is independently testable and ends at a commit checkpoint. Tasks are ordered so every step keeps the suite green.

---

### Task 1 — Project model + response shaper (RED → GREEN)

**Goal**: `Project` schema with validation and defaults; `formatProject` shape.

**RED — tests** (new `tests/project.test.js`, model-only block, exercised through the model directly or a temporary describe):
* Missing required field (`title`/`description`/`category`/`teamSize`/`deadline`/`difficulty`) → validation error.
* `difficulty` outside enum → validation error; valid enum accepted.
* `status` defaults to `OPEN`; `bookmarkedBy` defaults `[]`; `requiredSkills` defaults `[]`.
* `title` length bounds (min 3 / max 120); `description` min 10 / max 5000; `teamSize` min 1 / max 50 and integer.
* `repositoryUrl`/`projectImage` optional (absent is valid); non-empty non-URL `repositoryUrl` → validation error.

**Run**: `npm test` → new model tests **fail** (module not found / assertions), existing 26 pass.

**GREEN — implement**:
* `models/Project.js` per spec §2 (fields, validators, enums, `timestamps: true`). URL validator: `match: [/^https?:\/\/.+/, '...']` applied only when non-empty (use a validator that allows `''`).
* `utils/formatProject.js` returning the exact shape in spec §2 (raw IDs, no populate).

**Run**: `npm test` → all pass.

**Checkpoint commit**: `feat(project): add Project model and formatProject helper`

---

### Task 2 — Pagination helper (RED → GREEN)

**Goal**: `utils/paginate.js` — parse `page`/`limit`, clamp, build `{ skip, limit, page }` and a `buildPagination(totalCount)` → `{ currentPage, totalPages, totalCount }`.

**RED — tests** (unit block in `project.test.js` or a small `tests/paginate` describe): defaults (`page=1`,`limit=10`); `limit` capped at 100; negative/NaN clamped to valid bounds; `totalPages = ceil(total/limit)`; `totalCount=0` → `totalPages=0` or `1` (decide: **0**), `results` empty.

**Run**: fail → implement minimal pure functions → pass.

**Checkpoint commit**: `feat(utils): add pagination helper`

---

### Task 3 — `POST /api/projects` create (RED → GREEN)

**RED — tests**:
* Authenticated create with valid body → `201`; `ownerId` == caller; `memberIds` == `[ownerId]`; `status` == `OPEN`.
* Server-controlled fields in body (`ownerId`, `memberIds`, `status`, `bookmarkedBy`) are ignored.
* Missing required field → `400`.
* No token → `401`.

**GREEN**:
* `controllers/projectController.js` → `createProject`: allowlist input fields (spec §3.1), set `ownerId = req.user.userId`, `memberIds = [ownerId]`, create, return `formatProject` with `201`.
* `routes/projectRoutes.js`: `router.post('/', authMiddleware, createProject)`.
* `app.js`: `app.use('/api/projects', projectRoutes)`.

**Run**: fail → implement → pass (existing 26 + new create tests).

**Checkpoint commit**: `feat(project): POST /api/projects create endpoint`

---

### Task 4 — `GET /api/projects/:id` + invalid-id guard (RED → GREEN)

**RED — tests**: existing project → `200` with formatted project; unknown but valid ObjectId → `404`; malformed id → `404` (not `500`).

**GREEN**: `getProjectById` with `mongoose.isValidObjectId` guard → `404 Project not found`; else fetch, `404` if null.

**Checkpoint commit**: `feat(project): GET /api/projects/:id endpoint`

---

### Task 5 — `GET /api/projects` list + search + filter + pagination (RED → GREEN)

**RED — tests**:
* Empty DB → `200`, `data.results == []`, `pagination.totalCount == 0`.
* Seed several projects; default list → newest first, `results` + `pagination` shape (`currentPage/totalPages/totalCount`).
* `search` matches title OR description (case-insensitive partial).
* `category` exact (case-insensitive) filter.
* `difficulty` / `status` exact filter; invalid enum value → `400`.
* `skills` comma-separated → ANY match (`$in`).
* `page`/`limit` paginate correctly; `limit` capped at 100.

**GREEN**: `listProjects` builds a Mongo query object from query params (regex for search, `$in` for skills, exact for category/difficulty/status with enum validation → 400), sorts `createdAt: -1`, uses `paginate` for skip/limit + metadata, maps through `formatProject`.

**Checkpoint commit**: `feat(project): GET /api/projects list with search, filter, pagination`

---

### Task 6 — `PUT /api/projects/:id` update + ownership (RED → GREEN)

**RED — tests**:
* Owner updates editable fields → `200`, values changed.
* Server-controlled/`status` fields in body ignored.
* Non-owner → `403`; no token → `401`; unknown id → `404`.
* Invalid value (e.g. bad `difficulty`) → `400`.
* `teamSize` below current `memberIds.length` → `400`.

**GREEN**: `updateProject` — id guard → fetch → ownership check (`403`) → allowlist editable fields (spec §3.4) → `teamSize` vs members check → `findByIdAndUpdate(id, updates, { new: true, runValidators: true })` → `formatProject`.

**Checkpoint commit**: `feat(project): PUT /api/projects/:id owner update`

---

### Task 7 — `PATCH /api/projects/:id/status` transitions (RED → GREEN)

**RED — tests**:
* Owner `OPEN→IN_PROGRESS` → `200`; then `IN_PROGRESS→COMPLETED` → `200`.
* Backward (`IN_PROGRESS→OPEN`), skip (`OPEN→COMPLETED`), same-status no-op, unknown value → `400`.
* Non-owner → `403`; no token → `401`; unknown id → `404`.

**GREEN**: `updateStatus` — id guard → fetch → ownership → validate `status` in enum → check forward-only transition map (`OPEN→IN_PROGRESS`, `IN_PROGRESS→COMPLETED`) → save → `formatProject`.

**Checkpoint commit**: `feat(project): PATCH /api/projects/:id/status transitions`

---

### Task 8 — Bookmark add/remove (RED → GREEN)

**RED — tests**:
* Authenticated `POST /:id/bookmark` → `200`, caller in `bookmarkedBy`; repeat → still `200`, no duplicate.
* `DELETE /:id/bookmark` → `200`, caller removed; repeat when absent → `200`.
* Owner may bookmark own project → `200`.
* No token → `401`; unknown id → `404`.

**GREEN**: `addBookmark` (`$addToSet`) and `removeBookmark` (`$pull`) with id guard, `{ new: true }`, `formatProject`.

**Checkpoint commit**: `feat(project): bookmark add/remove endpoints`

---

### Task 9 — `DELETE /api/projects/:id` (RED → GREEN)

**RED — tests**: owner delete → `200` with `{ message, id }`; subsequent `GET /:id` → `404`; non-owner → `403`; no token → `401`; unknown id → `404`.

**GREEN**: `deleteProject` — id guard → fetch → ownership → `findByIdAndDelete` → `200` confirmation envelope.

**Checkpoint commit**: `feat(project): DELETE /api/projects/:id owner delete`

---

### Task 10 — User skill search (RED → GREEN)

**RED — tests** (append to `tests/user.test.js`):
* Seed users with skills; authenticated `GET /api/users/search?skills=React` → `200`, matches by skill (`$in`, case-insensitive), paginated `{ results, pagination }`.
* `search` param matches `name`.
* Requesting user excluded from results.
* No password in any result.
* No token → `401`; no match → `200` empty results.

**GREEN**:
* `userController.searchUsers`: build query (`skills` `$in`, `name` regex), exclude `_id: req.user.userId`, paginate via `paginate`, map through existing `formatUser`.
* `userRoutes.js`: `router.get('/search', authMiddleware, searchUsers)` — **registered before** any `/:id` route (none exists yet, but ordering documented).

**Run**: existing 26 + all project tests + new user-search tests pass.

**Checkpoint commit**: `feat(user): GET /api/users/search by skills`

---

### Task 11 — Documentation sync (no code)

Update docs to match implemented behavior (spec §7):
* `docs/api-contract.md`: Projects endpoints → `[IMPLEMENTED]` with request/response bodies; add `GET /api/users/search`; add `difficulty`/`repositoryUrl`/`projectImage`.
* `docs/architecture.md`: add the three new fields to `Projects` §7.1.
* `docs/development-roadmap.md`: Phase 4 → `[COMPLETED]`.
* `PROJECT_CONTEXT.md`, `README.md`, `walkthrough.md`: append Phase 4 completion + ADRs.

**Run**: `npm test` (unchanged; docs-only) → all pass.

**Checkpoint commit**: `docs: mark Phase 4 project management complete`

---

### Task 12 — Full regression + final verification

* `npm test` → **all suites pass** (26 baseline + Phase 4 additions).
* Manual smoke (optional, documented in report): start server, create → list → filter → status → bookmark → user search.
* Confirm no secrets, `git status` clean except intended files.

**Final checkpoint commit** (if any doc tweaks): `test: Phase 4 regression verified`

---

## 3. Test Strategy Summary

| Area | Covered in Task |
| :--- | :--- |
| Model validation & defaults | 1 |
| Pagination helper | 2 |
| Create | 3 |
| Read (detail, invalid id) | 4 |
| List / search / filter / pagination | 5 |
| Update + ownership + teamSize rule | 6 |
| Status transitions | 7 |
| Bookmarking (idempotent) | 8 |
| Delete + ownership | 9 |
| User skill search + self-exclusion + no-password | 10 |
| Docs | 11 |
| Regression (all 26 baseline stay green) | every task + 12 |

* Harness: Jest + Supertest, dedicated test DB (`MONGODB_TEST_URI` / `collabsphere_test`), `afterEach` cleanup, register-to-get-token pattern — identical to Phases 2–3.
* Every task runs `npm test`; expected transition RED (new tests fail, 26 still pass) → GREEN (all pass).

---

## 4. Commit Checkpoints (summary)

1. `feat(project): add Project model and formatProject helper`
2. `feat(utils): add pagination helper`
3. `feat(project): POST /api/projects create endpoint`
4. `feat(project): GET /api/projects/:id endpoint`
5. `feat(project): GET /api/projects list with search, filter, pagination`
6. `feat(project): PUT /api/projects/:id owner update`
7. `feat(project): PATCH /api/projects/:id/status transitions`
8. `feat(project): bookmark add/remove endpoints`
9. `feat(project): DELETE /api/projects/:id owner delete`
10. `feat(user): GET /api/users/search by skills`
11. `docs: mark Phase 4 project management complete`
12. `test: Phase 4 regression verified` (if needed)

---

## 5. Self-Review

**Requirements coverage**: Project model ✅, CRUD ✅ (Tasks 3,4,5,6,9), search/filter/pagination ✅ (5), status transitions ✅ (7), bookmarking ✅ (8), user skill search ✅ (10), validation & authz ✅ (throughout), docs updates ✅ (11), regression ✅ (every task + 12). All 8 endpoints + user search planned. All finalized decisions A1–A15 reflected.

**Interface consistency**:
* All endpoints return the standard envelope; list/search return `data.results` + `data.pagination`.
* Ownership + id-guard patterns identical across update/delete/status.
* `paginate` shared by project list and user search — single source of truth.

**Assumptions surfaced**:
* `paginate` `totalCount=0 → totalPages=0` (chosen in Task 2; documented). If a `1` floor is preferred, adjust in Task 2 only.
* Model-level tests exercise the schema through create calls (not a separate unit runner) to stay within the existing Supertest harness — no new test tooling.
* `category`/`skills` case-insensitivity implemented via regex/`$in` with lowercasing at query build; `requiredSkills` stored as provided (trimmed).

**Risks / no-gos honored**: no dependency added, `errorHandler` and auth untouched, no populate, no `$text`, no member endpoints. Route ordering note for `/search` recorded to prevent `:id` capture regressions in later phases.

**Open blockers**: none. Plan is executable end-to-end against the finalized spec.
