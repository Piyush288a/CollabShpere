# Phase 4 — Project Management: Design Specification

* **Date**: September 18, 2026
* **Phase**: 4 — Project Management (Extended)
* **Branch**: `feature/phase-4-project-management`
* **Status**: DESIGN (no implementation yet)

This document is a **design specification only**. It defines *what* Phase 4 will build and *how* it should behave, following the conventions established in Phases 1–3. It does not contain an implementation plan or application code.

---

## 1. Context & Existing Conventions (Inputs)

Design decisions below are constrained to match the patterns already present in the codebase:

* **Response envelope**: success → `{ "success": true, "data": {...} }`; error → `{ "success": false, "message": "..." }`. (`app.js`, `errorHandler.js`)
* **Status codes**: 200, 201, 400, 401, 403, 404, 409, 500.
* **Error flow**: controllers create an `Error`, set `err.statusCode`, and call `next(err)`. The centralized `errorHandler` maps Mongoose `ValidationError` → `400` using the first validation message.
* **Auth**: `authMiddleware` verifies the JWT and sets `req.user = { userId, role }`. `adminMiddleware` gates `role === 'admin'` (exists, currently unused).
* **Controllers**: thin, `async` with `try/catch → next(error)`. Field allowlisting for updates (see `userController.updateProfile`). Mongoose updates use `{ new: true, runValidators: true }`.
* **Response shaping**: dedicated formatter helpers in `utils/` (see `utils/formatUser.js`) build the exact response object; sensitive fields are structurally excluded.
* **Models**: Mongoose schema with field-level validators, `enum` for constrained strings, `default`s, and `{ timestamps: true }`.
* **Tests**: Jest + Supertest, dedicated test DB, `afterEach` cleanup, register-to-get-token pattern. Script: `jest --runInBand --forceExit`.
* **Naming**: `camelCase` fields, `xxxId`/`xxxIds` for references (`ownerId`, `memberIds`, `bookmarkedBy`), controllers `resourceController.js`, routes `resourceRoutes.js`.

No new dependencies are required. `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv` (+ `jest`, `supertest`) already cover everything in this spec.

---

## 2. Project Model (`models/Project.js`)

Mongoose schema for the `Projects` collection.

| Field | Type | Rules / Default |
| :--- | :--- | :--- |
| `ownerId` | `ObjectId` (ref `User`) | Required. Set from `req.user.userId` on create; immutable thereafter. |
| `memberIds` | `[ObjectId]` (ref `User`) | Defaults to `[ownerId]` on create (owner is always a member). |
| `title` | `String` | Required, trimmed, `minlength 3`, `maxlength 120`. |
| `description` | `String` | Required, trimmed, `minlength 10`, `maxlength 5000`. |
| `category` | `String` | Required, trimmed. (Free-form string; see Ambiguity A1.) |
| `requiredSkills` | `[String]` | Defaults to `[]`. Each entry trimmed. |
| `teamSize` | `Number` | Required, integer, `min 1`, `max 50`. Must be `>= memberIds.length` (see A5). |
| `deadline` | `Date` | Required. Should be a future date at creation (see A2). |
| `difficulty` | `String` (enum) | Required. Enum `['Beginner', 'Intermediate', 'Advanced']`. |
| `repositoryUrl` | `String` | Optional. Defaults to `''`. URL-format validated when non-empty (see A3). |
| `projectImage` | `String` | Optional. Defaults to `null`. URL string (Cloudinary later, Phase 8/10). |
| `status` | `String` (enum) | Enum `['OPEN', 'IN_PROGRESS', 'COMPLETED']`, default `'OPEN'`. |
| `bookmarkedBy` | `[ObjectId]` (ref `User`) | Defaults to `[]`. |
| `createdAt` / `updatedAt` | `Date` | Added by `{ timestamps: true }`. |

**Notes**
* Enum casing (`Beginner`/`Intermediate`/`Advanced`, `OPEN`/`IN_PROGRESS`/`COMPLETED`) is chosen to match the existing docs: difficulty uses Title Case per the approved scope; status uses UPPER_CASE per `architecture.md` and `PROJECT_CONTEXT.md`.
* No pre-save hooks are required (unlike `User`, there is no hashing). `memberIds` default is applied in the controller at create time because it depends on `ownerId`.
* Indexes (design intent): text index on `title` + `description` for search, and secondary indexes on `category`, `difficulty`, `status` (see A4 for the search-method decision).

### Response shape — `utils/formatProject.js`

A dedicated formatter mirrors `formatUser`. Proposed shape:

```json
{
  "_id": "...",
  "ownerId": "...",
  "memberIds": ["..."],
  "title": "...",
  "description": "...",
  "category": "...",
  "requiredSkills": ["..."],
  "teamSize": 4,
  "deadline": "2026-12-01T00:00:00.000Z",
  "difficulty": "Intermediate",
  "repositoryUrl": "",
  "projectImage": null,
  "status": "OPEN",
  "bookmarkedBy": ["..."],
  "createdAt": "...",
  "updatedAt": "..."
}
```

Whether `ownerId`/`memberIds` are returned as raw IDs or populated user objects is deferred (see A6). Default design: return raw IDs in Phase 4 to keep the contract stable; populate later when collaboration UI needs it.

---

## 3. Project API Endpoints

Mounted at `/api/projects` in `app.js` via a new `routes/projectRoutes.js` → `controllers/projectController.js`. All routes follow the standard envelope.

| # | Method & Path | Access | Purpose |
| :- | :--- | :--- | :--- |
| 1 | `POST /api/projects` | Private (JWT) | Create a project; `ownerId` = caller; `memberIds` = `[ownerId]`; `status` = `OPEN`. → `201`. |
| 2 | `GET /api/projects` | Public | List/search/filter/paginate projects. → `200`, paginated. |
| 3 | `GET /api/projects/:id` | Public | Get one project. → `200`; `404` if not found / invalid id. |
| 4 | `PUT /api/projects/:id` | Private, **owner only** | Update allowlisted editable fields. → `200`. |
| 5 | `DELETE /api/projects/:id` | Private, **owner only** | Delete a project. → `200` with a confirmation payload. |
| 6 | `PATCH /api/projects/:id/status` | Private, **owner only** | Transition status with validation. → `200`. |
| 7 | `POST /api/projects/:id/bookmark` | Private (JWT) | Add caller to `bookmarkedBy` (idempotent). → `200`. |
| 8 | `DELETE /api/projects/:id/bookmark` | Private (JWT) | Remove caller from `bookmarkedBy` (idempotent). → `200`. |

### 3.1 `POST /api/projects`
* **Body (accepted)**: `title`, `description`, `category`, `requiredSkills?`, `teamSize`, `deadline`, `difficulty`, `repositoryUrl?`, `projectImage?`.
* **Ignored if sent** (server-controlled): `ownerId`, `memberIds`, `status`, `bookmarkedBy`, `_id`, timestamps. Follows the `updateProfile` allowlist convention.
* **Behavior**: `ownerId = req.user.userId`; `memberIds = [ownerId]`; `status = 'OPEN'`.
* **Errors**: `400` on validation failure (missing/invalid fields), `401` if no token.

### 3.2 `GET /api/projects`
* **Query params**: `page`, `limit`, `search`, `category`, `difficulty`, `status`, `skills` (see §4).
* **Success `200`**:
```json
{
  "success": true,
  "data": {
    "results": [ /* formatted projects */ ],
    "pagination": { "currentPage": 1, "totalPages": 5, "totalCount": 48 }
  }
}
```

### 3.3 `GET /api/projects/:id`
* `200` with the project; `404` `Project not found` if the id doesn't exist or is not a valid ObjectId (cast handled → 404, see A7).

### 3.4 `PUT /api/projects/:id`
* **Editable allowlist**: `title`, `description`, `category`, `requiredSkills`, `teamSize`, `deadline`, `difficulty`, `repositoryUrl`, `projectImage`. Partial updates supported.
* **Never editable here**: `ownerId`, `memberIds`, `status` (use endpoint #6), `bookmarkedBy`, timestamps.
* **Access**: `403` `Access denied — project owner only` if `req.user.userId !== project.ownerId`.
* Uses `findByIdAndUpdate(id, updates, { new: true, runValidators: true })` after the ownership check. `404` if not found; `400` on validation error.

### 3.5 `DELETE /api/projects/:id`
* **Access**: owner only (`403` otherwise). `404` if not found.
* **Success `200`**: `{ "success": true, "data": { "message": "Project deleted", "id": "<id>" } }`. (200 with confirmation chosen over 204 to keep the non-empty envelope convention — see A8.)

### 3.6 `PATCH /api/projects/:id/status`
* **Body**: `{ "status": "IN_PROGRESS" }`.
* **Access**: owner only.
* **Valid transitions** (forward-only): `OPEN → IN_PROGRESS`, `IN_PROGRESS → COMPLETED`. Any other transition (including skips like `OPEN → COMPLETED`, backward moves, or no-op repeats) → `400 Invalid status transition` (see A9 for no-op handling).
* **Errors**: `400` unknown/invalid `status` value or illegal transition; `403` non-owner; `404` not found.

### 3.7 `POST` / `DELETE /api/projects/:id/bookmark`
* **Access**: any authenticated user (including the owner).
* **POST**: adds `req.user.userId` to `bookmarkedBy` if absent (idempotent via `$addToSet`). → `200` with updated project.
* **DELETE**: removes it if present (idempotent via `$pull`). → `200` with updated project.
* **Errors**: `401` no token; `404` not found. Idempotent operations do not error on repeat (see A10).

---

## 4. Search, Filtering & Pagination (`GET /api/projects`)

All parameters are optional and combinable (logical AND across filters).

| Param | Type | Behavior |
| :--- | :--- | :--- |
| `page` | integer ≥ 1, default `1` | Page number. Invalid/negative → clamped to `1`. |
| `limit` | integer 1–100, default `10` | Page size. Values > 100 clamped to 100 (see A11). |
| `search` | string | Matches `title` OR `description`, case-insensitive (see A4 for regex vs text index). |
| `category` | string | Exact match (case-insensitive), single value. |
| `difficulty` | enum string | Exact match against difficulty enum; invalid value → `400` (see A12). |
| `status` | enum string | Exact match against status enum; invalid value → `400`. |
| `skills` | comma-separated string | Matches projects whose `requiredSkills` contain **any** of the provided skills (`$in`); AND-vs-OR is A13. |

* **Sorting**: default `createdAt` descending (newest first). Sort options not in scope for Phase 4.
* **Pagination math**: `skip = (page - 1) * limit`; `totalPages = ceil(totalCount / limit)`. Metadata returned as `{ currentPage, totalPages, totalCount }` to match `architecture.md` §4.
* **Empty result**: `200` with `results: []` and `totalCount: 0` (not a `404`).
* A shared helper `utils/paginate.js` is proposed to centralize page/limit parsing and metadata construction (reused by future list endpoints). This is the first paginated endpoint in the codebase.

---

## 5. User Search by Skills

Extends the existing user domain to support finding collaborators — designed to feed future Phase 5 collaboration requests.

* **Endpoint**: `GET /api/users/search` — Private (JWT).
* **Placement**: added to existing `routes/userRoutes.js` → new `userController.searchUsers`. No change to auth/profile handlers.
* **Query params**:
  * `skills` — comma-separated; matches users whose `skills` array contains any of them (`$in`, case-insensitive).
  * `search` — optional, matches `name` (case-insensitive).
  * `page`, `limit` — same pagination contract as §4.
* **Response**: paginated `{ results, pagination }`, where each user is shaped by the existing `formatUser` (password never exposed).
* **Excludes self**: the requesting user is omitted from results (`_id !== req.user.userId`) so search returns potential collaborators only — this is the hook for Phase 5.
* **Errors**: `401` no token; `200` with empty `results` when nothing matches.

**Route-ordering note**: `GET /api/users/search` must be registered **before** any future `/api/users/:id` route to avoid `search` being captured as an `:id` param. Not an issue in Phase 4 (no `:id` user route exists) but flagged for the implementer.

---

## 6. Authorization & Validation Rules

| Concern | Rule |
| :--- | :--- |
| Create project | Authenticated only. `ownerId` forced to caller; body cannot override server-controlled fields. |
| Read (list/detail) | Public — consistent with `api-contract.md` (`GET /api/projects` is Public). |
| Update / Delete / Status | Owner only. Compare `String(project.ownerId) === req.user.userId`; else `403`. |
| Bookmark add/remove | Any authenticated user. |
| Status transitions | Forward-only state machine `OPEN → IN_PROGRESS → COMPLETED`. Enforced in controller before persisting. |
| Input validation | Enforced by Mongoose schema (`required`, `enum`, `min`/`max`, `minlength`/`maxlength`, URL match) + `runValidators: true` on updates. ValidationError → `400` via existing `errorHandler`. |
| Response envelope | All responses use the standard success/error envelope. |
| Sensitive data | Users in any project/user response are shaped by `formatUser` (no password). |
| Invalid ObjectId | Mongoose `CastError` on `:id` mapped to `404 Project not found` (design decision A7 — needs a small addition to `errorHandler` OR explicit `isValidObjectId` guard in the controller). |

---

## 7. New / Modified Files (design intent — not an implementation plan)

**New**
* `backend/models/Project.js`
* `backend/controllers/projectController.js`
* `backend/routes/projectRoutes.js`
* `backend/utils/formatProject.js`
* `backend/utils/paginate.js`
* `backend/tests/project.test.js`

**Modified**
* `backend/app.js` — mount `projectRoutes` at `/api/projects`.
* `backend/routes/userRoutes.js` — add `GET /api/users/search`.
* `backend/controllers/userController.js` — add `searchUsers`.
* Docs: `docs/api-contract.md` (flip Project endpoints to `[IMPLEMENTED]`, add user search), `docs/architecture.md`, `docs/development-roadmap.md`, `PROJECT_CONTEXT.md`, `README.md`, `walkthrough.md`.

**Not touched**: `User.js` schema, `authController.js`, `authMiddleware.js`, `errorHandler.js` (unless A7 is resolved in favor of the centralized approach), existing auth/user tests, `package.json` dependencies.

---

## 8. Testing Strategy (`tests/project.test.js`, extend `tests/user.test.js`)

Same harness as Phases 2–3 (Jest + Supertest, dedicated test DB, `afterEach` cleanup, register-to-get-token).

1. **Model validation**: required fields; `difficulty`/`status` enum rejection; `teamSize` bounds; `title`/`description` length bounds; deadline presence; defaults applied (`status='OPEN'`, `memberIds=[owner]`, `bookmarkedBy=[]`).
2. **CRUD**:
   * Create → `201`, owner is caller, owner in `memberIds`, status `OPEN`.
   * Create without token → `401`.
   * Get list / get by id → `200`; unknown id → `404`.
   * Update by owner → `200`; server-controlled fields ignored.
   * Delete by owner → `200`.
3. **Authorization**:
   * Non-owner update/delete/status → `403`.
   * Any mutation without token → `401`.
4. **Search/filter**: by `search` (title/description), `category`, `difficulty`, `status`, `skills`; combined filters; empty result → `200` empty array.
5. **Pagination**: `page`/`limit` respected; correct `currentPage`/`totalPages`/`totalCount`; limit clamping; defaults.
6. **Status transitions**: valid `OPEN→IN_PROGRESS→COMPLETED` succeed; invalid skips/backward/unknown value → `400`; non-owner → `403`.
7. **Bookmarking**: add → present in `bookmarkedBy`; remove → absent; idempotent repeat calls don't error; without token → `401`.
8. **User skill search**: matches by skill; excludes self; paginated; no password in results; without token → `401`.

Target: existing 26 tests remain green + new Phase 4 tests. Exact counts determined at implementation time.

---

## 9. Unresolved Ambiguities (need product decision before implementation)

* **A1 — Category values**: free-form string, or a fixed enum (e.g. Web, Mobile, AI/ML, Data, Other)? Docs use examples, not a closed list. **Default assumption**: free-form trimmed string in Phase 4.
* **A2 — Deadline in the past**: reject deadlines earlier than "now" at creation, or allow? **Default**: require future date on create (custom validator); allow past on update? — needs confirmation.
* **A3 — URL validation strictness**: `repositoryUrl`/`projectImage` — validate as generic URL, require `https`, or restrict `repositoryUrl` to GitHub? **Default**: generic URL regex when non-empty, no host restriction.
* **A4 — Search implementation**: MongoDB `$text` index vs case-insensitive `$regex` on title/description. `$text` is faster and ranks results but matches whole words and needs an index; `$regex` supports partial substrings (better for a search box) but is slower. **Default**: `$regex` (case-insensitive, partial match) for Phase 4 UX; revisit if performance matters.
* **A5 — teamSize vs members**: enforce `teamSize >= memberIds.length` on update (can't shrink below current members)? **Default**: yes, reject with `400`.
* **A6 — Populate owner/members**: return raw IDs or populated user objects in project responses? **Default**: raw IDs in Phase 4.
* **A7 — Invalid ObjectId handling**: centralize `CastError → 404` in `errorHandler` (touches shared middleware) vs guard with `mongoose.isValidObjectId` in each controller (no shared change). **Default**: controller-level guard to avoid modifying shared middleware in Phase 4.
* **A8 — Delete response**: `200` + confirmation envelope vs `204 No Content`. **Default**: `200` + `{ message, id }` to preserve the non-empty envelope convention.
* **A9 — Status no-op**: is `PATCH` to the same current status a `400` or a `200` no-op? **Default**: `400 Invalid status transition` (only forward moves are valid).
* **A10 — Bookmark idempotency response**: always `200` even when nothing changed (already/never bookmarked)? **Default**: yes, idempotent `200`.
* **A11 — limit cap**: hard cap at 100? **Default**: yes, clamp.
* **A12 — Invalid filter enum**: `difficulty`/`status` filter with an unknown value → `400` vs ignore the filter. **Default**: `400` (explicit feedback).
* **A13 — skills filter match mode**: match projects containing ANY provided skill (`$in`) vs ALL (`$all`). **Default**: ANY (`$in`) for broader discovery.
* **A14 — Who can bookmark**: can the owner bookmark their own project? **Default**: yes (no restriction).
* **A15 — Members management**: this spec does not add endpoints to add/remove `memberIds` directly — member changes are expected to flow from Phase 5 (accepting collaboration requests). Confirm no manual member endpoint is needed in Phase 4.

---

## 10. Self-Review Checklist

* [x] All 8 approved endpoints specified with method, access, success code, and error cases.
* [x] All model fields from the approved scope included, typed, and constrained.
* [x] Search, filtering, and pagination cover the required params and response shape (`data.results` + `data.pagination`).
* [x] User skill search designed and explicitly linked to future collaboration requests (self-exclusion).
* [x] Authorization (auth-required, owner-only, bookmark-any-auth) and the forward-only status state machine defined.
* [x] Validation strategy reuses Mongoose validators + existing `errorHandler` mapping.
* [x] Testing strategy covers every required category.
* [x] No new dependencies introduced.
* [x] Naming/architecture follows Phases 1–3 conventions.
* [x] Ambiguities enumerated (A1–A15) rather than silently invented; each has a stated default assumption.
* [x] File touch-list separates new vs modified; shared middleware left untouched by default.
---

## 11. Finalized Decisions (resolves §9 for implementation)

Resolved under the Phase 4 guiding constraints: **keep it minimal, align with existing architecture, avoid new dependencies/abstractions, and preserve existing response + security conventions.** These decisions supersede the "default assumptions" in §9 where they differ.

| ID | Decision | Rationale |
| :-- | :--- | :--- |
| **A1** | `category` is a **flexible required trimmed String** (no enum). | Per constraint; `architecture.md` describes it as a free-form "Domain category (e.g. ...)". |
| **A2** | `deadline` is a **required `Date` with no past/future restriction** (Phase 4). | Minimal; `architecture.md` calls it "Target completion date" with no temporal rule. Avoids a custom validator. Revisit if product wants future-only later. |
| **A3** | `repositoryUrl` / `projectImage`: validate as a **generic URL when non-empty** (simple regex, e.g. `^https?://`), no host restriction, empty allowed. | Minimal validation, no dependency (no `validator` package). Consistent with the existing email-regex approach in `User.js`. |
| **A4** | **Search uses case-insensitive `$regex`** on `title` and `description` (partial substring, OR). No `$text` index. | Simpler, supports partial "search box" matching, no index/migration overhead. Aligns with "avoid unnecessary abstractions." |
| **A5** | On update, enforce **`teamSize >= memberIds.length`**; otherwise `400`. | Prevents an invalid team capacity. Cheap controller check; preserves data integrity. |
| **A6** | Project responses return **raw ObjectIds** for `ownerId`/`memberIds`/`bookmarkedBy` (no populate) in Phase 4. | Minimal, stable contract; population deferred until collaboration/UI phases need it. |
| **A7** | **Controller-level `mongoose.isValidObjectId` guard** → `404 Project not found` on invalid/unknown id. **`errorHandler` is NOT modified.** | Preserves existing shared middleware untouched; keeps the change local to Phase 4 code. |
| **A8** | `DELETE` returns **`200`** with `{ "success": true, "data": { "message": "Project deleted", "id": "<id>" } }`. | Preserves the non-empty success-envelope convention used everywhere else (no `204`). |
| **A9** | `PATCH /status` allows **only forward transitions** `OPEN→IN_PROGRESS→COMPLETED`. Same-status no-op and any backward/skip transition → **`400 Invalid status transition`**. | Clear, predictable state machine; matches documented lifecycle. |
| **A10** | Bookmark add/remove are **idempotent** (`$addToSet` / `$pull`), always **`200`** with the updated project, even when nothing changed. | Simple, safe for repeated client calls; no error noise. |
| **A11** | Pagination: `page` default `1`, `limit` default `10`, **`limit` hard-capped at `100`**; invalid/negative values clamped to valid bounds. | Matches `architecture.md` defaults; prevents unbounded queries. |
| **A12** | Invalid `difficulty`/`status` **filter** value on `GET /api/projects` → **`400`** with a descriptive message. | Explicit feedback over silently ignoring; consistent with validation-first convention. |
| **A13** | `skills` filter matches projects whose `requiredSkills` contain **ANY** provided skill (`$in`, case-insensitive). | Broader discovery for a search feature; `$all` would be too narrow for Phase 4. |
| **A14** | The **owner may bookmark their own project** (no restriction). | Minimal; no special-case logic. |
| **A15** | **No dedicated member-management endpoints in Phase 4.** `memberIds` is initialized to `[ownerId]` and otherwise unchanged until Phase 5 (collaboration requests) manages membership. | Per constraint; keeps Phase 4 scoped to projects + discovery. |

### Canonical field name
* **`requiredSkills`** is the canonical project skill field (array of strings). Confirmed against `docs/architecture.md` §7.1 (`Projects.requiredSkills`). This is distinct from `User.skills` (a user's own skills) and from `Showcases.technologies` (a different collection) — no terminology conflict.

### Terminology conflicts with existing system-design docs
* **None.** All Phase 4 field names (`ownerId`, `memberIds`, `title`, `description`, `category`, `requiredSkills`, `teamSize`, `deadline`, `status`, `bookmarkedBy`) match `docs/architecture.md` §7.1 and §8.
* **New fields not yet in system-design docs** (additive, non-conflicting): `difficulty` (enum `Beginner/Intermediate/Advanced`), `repositoryUrl`, `projectImage`. These are approved Phase 4 scope additions. **Action for implementation phase**: add these three fields to the `Projects` collection description in `docs/architecture.md` so the design docs stay in sync (documentation-only update, tracked in the file touch-list §7).

### Confirmed non-goals for Phase 4 (unchanged)
* No populate of references, no `$text` search, no `validator`/other new dependency, no member add/remove endpoints, no changes to `User` schema, auth, or shared `errorHandler`.
