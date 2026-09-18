# CollabSphere — REST API Specification & Contract

> [!IMPORTANT]
> **Base Path**: `/api`  
> *(Note: We use `/api`, NOT `/api/v1`)*  
> Endpoints marked `[IMPLEMENTED]` are live. Endpoints marked `[PLANNED]` are not yet implemented.

---

## 0. API Standards & Conventions

### Request Format
All requests that send a body must use `Content-Type: application/json`.

### Response Envelope
Every API response — success or error — uses a consistent JSON envelope.

**Success response:**
```json
{
  "success": true,
  "data": {}
}
```

**Error response:**
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

`data` holds the actual payload (object, array, or pagination wrapper). `message` is only present on errors.

---

### Standard HTTP Status Codes

| Situation | Code |
| :--- | :--- |
| Success (read / update / delete) | `200 OK` |
| Resource created successfully | `201 Created` |
| Bad input or validation failure | `400 Bad Request` |
| Not logged in (missing or invalid token) | `401 Unauthorized` |
| Logged in but not permitted | `403 Forbidden` |
| Resource not found | `404 Not Found` |
| Business rule violation (e.g. duplicate request) | `409 Conflict` |
| Unexpected server error | `500 Internal Server Error` |

> **Validation errors**: Mongoose schema validation failures (e.g. invalid email format, missing required field) are automatically caught by the centralized error handler and returned as `400 Bad Request` with a human-readable `message`.

---

### Pagination

List endpoints that return multiple records support page-based pagination via query parameters.

```
GET /api/projects?page=1&limit=10
```

- Default: `page=1`, `limit=10`
- Pagination metadata is returned inside the `data` object.

**Paginated success response shape:**
```json
{
  "success": true,
  "data": {
    "results": [],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 48
    }
  }
}
```

Pagination applies to: `GET /api/projects`, `GET /api/showcases`, `GET /api/admin/users`, `GET /api/admin/projects`, `GET /api/admin/reports`.

---

## 1. Authentication Endpoints

### `POST /api/auth/register` `[IMPLEMENTED]`
* **What it does**: Registers a new student account, then returns a JWT and the new user's profile.
* **Access**: Public
* **Request body**:
```json
{
  "name": "Jane Smith",
  "email": "jane@university.edu",
  "password": "securepassword123"
}
```
* **Success response** `201 Created`:
```json
{
  "success": true,
  "data": {
    "token": "<jwt_token>",
    "user": {
      "_id": "64abc...",
      "name": "Jane Smith",
      "email": "jane@university.edu",
      "role": "student",
      "avatar": null,
      "skills": [],
      "bio": "",
      "githubUrl": "",
      "linkedinUrl": "",
      "createdAt": "2026-09-18T10:00:00.000Z"
    }
  }
}
```
* **Notes**:
  * `role` defaults to `"student"`. Admins are created by direct database seeding — not via this endpoint.
  * `password` is never included in the response.
  * Email must be unique — duplicate email returns `409 Conflict`.
  * Email must be a valid format (e.g. `user@domain.com`) — invalid format returns `400 Bad Request`.
  * All three fields (`name`, `email`, `password`) are required — missing fields return `400 Bad Request`.

---

### `POST /api/auth/login` `[IMPLEMENTED]`
* **What it does**: Authenticates a user and returns a JWT token with the user's profile.
* **Access**: Public
* **Request body**:
```json
{
  "email": "jane@university.edu",
  "password": "securepassword123"
}
```
* **Success response** `200 OK`:
```json
{
  "success": true,
  "data": {
    "token": "<jwt_token>",
    "user": {
      "_id": "64abc...",
      "name": "Jane Smith",
      "email": "jane@university.edu",
      "role": "student",
      "avatar": null,
      "skills": [],
      "bio": "",
      "githubUrl": "",
      "linkedinUrl": "",
      "createdAt": "2026-09-18T10:00:00.000Z"
    }
  }
}
```
* **Notes**:
  * Returns `401 Unauthorized` if email is not found or password does not match.
  * `password` is never included in the response.
  * Token is signed using `JWT_SECRET` and expires after `JWT_EXPIRES_IN` (both from environment variables).

---

## 2. User Profile Endpoints

### `GET /api/users/profile` `[IMPLEMENTED]`
* **What it does**: Retrieves the currently authenticated user's profile.
* **Access**: Private (requires valid JWT — introduced in Phase 2)
* **Request header**:
```
Authorization: Bearer <jwt_token>
```
* **Success response** `200 OK`:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64abc...",
      "name": "Jane Smith",
      "email": "jane@university.edu",
      "role": "student",
      "avatar": null,
      "skills": [],
      "bio": "",
      "githubUrl": "",
      "linkedinUrl": "",
      "createdAt": "2026-09-18T10:00:00.000Z"
    }
  }
}
```
* **Notes**:
  * Returns `401 Unauthorized` if no token is provided or the token is invalid/expired.
  * `password` is never included in the response.

### `PUT /api/users/profile` `[IMPLEMENTED]`
* **What it does**: Updates the authenticated user's own profile. Supports partial updates.
* **Access**: Private (requires valid JWT)
* **Request header**:
```
Authorization: Bearer <jwt_token>
```
* **Request body** (all fields optional — send any subset):
```json
{
  "name": "Jane Doe",
  "bio": "Full-stack developer",
  "skills": ["React", "Node.js"],
  "githubUrl": "https://github.com/janedoe",
  "linkedinUrl": "https://linkedin.com/in/janedoe",
  "avatar": "https://example.com/avatar.png"
}
```
* **Success response** `200 OK`: returns the updated user object (same shape as `GET /api/users/profile`).
* **Notes**:
  * Only `name`, `bio`, `skills`, `githubUrl`, `linkedinUrl`, and `avatar` are updatable.
  * `email`, `password`, and `role` are **never** updatable via this endpoint — any such fields in the body are silently ignored.
  * Mongoose validators run on update (`runValidators: true`); invalid input returns `400 Bad Request`.
  * An empty body is valid — the user is returned unchanged with `200 OK`.
  * Returns `401 Unauthorized` if no token is provided or the token is invalid/expired.
  * `password` is never included in the response.

---

## 3. Projects Endpoints

### `POST /api/projects` `[PLANNED]`
* **What it does**: Creates a new project (status starts directly as `"OPEN"`).
* **Access**: Private (Logged-in students)

### `GET /api/projects` `[PLANNED]`
* **What it does**: Lists and searches projects by skill or category.
* **Access**: Public
* **Pagination**: Yes — supports `?page=1&limit=10`

### `GET /api/projects/:id` `[PLANNED]`
* **What it does**: Views detailed project information (includes owner, member list `memberIds`, status).
* **Access**: Public

### `PUT /api/projects/:id` `[PLANNED]`
* **What it does**: Updates project details.
* **Access**: Private (Project Owner only)

### `DELETE /api/projects/:id` `[PLANNED]`
* **What it does**: Deletes a project.
* **Access**: Private (Project Owner only)

### `PATCH /api/projects/:id/status` `[PLANNED]`
* **What it does**: Changes project stage (`"OPEN"` → `"IN_PROGRESS"` → `"COMPLETED"`).
* **Access**: Private (Project Owner only)

---

## 4. Collaboration Endpoints

### `POST /api/projects/:id/requests` `[PLANNED]`
* **What it does**: Sends a request to join an open project (prevents self-requests and duplicate active requests).
* **Access**: Private (Students)

### `PATCH /api/requests/:id` `[PLANNED]`
* **What it does**: Accepts or rejects a request. Accepting adds applicant to `Projects.memberIds` if team capacity (`teamSize`) allows.
* **Access**: Private (Project Owner only)

### `GET /api/projects/:id/team` `[PLANNED]`
* **What it does**: Gets current project team members (owner + `memberIds`).
* **Access**: Private (Logged-in users — requires valid JWT)
* **Note**: Requires authentication to protect user profile data from anonymous scraping.

---

## 5. Tasks Endpoints (Team Workspace)

### `POST /api/projects/:id/tasks` `[PLANNED]`
* **What it does**: Creates a task inside a project workspace.
* **Access**: Private (Project Team Members)

### `GET /api/projects/:id/tasks` `[PLANNED]`
* **What it does**: Lists all tasks for a project workspace.
* **Access**: Private (Project Team Members)

### `PATCH /api/tasks/:id` `[PLANNED]`
* **What it does**: Updates task details or status (`"TODO"`, `"IN_PROGRESS"`, `"COMPLETED"`).
* **Access**: Private (Project Team Members)

---

## 6. Messages Endpoints (Workspace Chat)

### `GET /api/projects/:id/messages` `[PLANNED]`
* **What it does**: Retrieves persistent chat history for a project workspace.
* **Access**: Private (Project Team Members)

### `POST /api/projects/:id/messages` `[PLANNED]`
* **What it does**: Sends a chat message in a project workspace.
* **Access**: Private (Project Team Members)

---

## 7. Showcases Endpoints

### `POST /api/showcases` `[PLANNED]`
* **What it does**: Publishes a showcase for a completed project.
* **Access**: Private (Project Owner only)

### `GET /api/showcases` `[PLANNED]`
* **What it does**: Lists public project showcases.
* **Access**: Public
* **Pagination**: Yes — supports `?page=1&limit=10`

### `POST /api/showcases/:id/like` `[PLANNED]`
* **What it does**: Likes a showcase.
* **Access**: Private

### `DELETE /api/showcases/:id/like` `[PLANNED]`
* **What it does**: Removes a like from a showcase.
* **Access**: Private

### `GET /api/showcases/:id/comments` `[PLANNED]`
* **What it does**: Fetches embedded comments on a showcase.
* **Access**: Public

### `POST /api/showcases/:id/comments` `[PLANNED]`
* **What it does**: Posts a comment on a showcase. Comment is embedded inside the Showcase document.
* **Access**: Private

---

## 8. Bookmarks Endpoints

### `POST /api/projects/:id/bookmark` `[PLANNED]`
* **What it does**: Bookmarks a project (adds user ID to `Projects.bookmarkedBy`).
* **Access**: Private

### `DELETE /api/projects/:id/bookmark` `[PLANNED]`
* **What it does**: Removes a project from bookmarks.
* **Access**: Private

---

## 9. Reports Endpoints

### `POST /api/reports` `[PLANNED]`
* **What it does**: Files a report against a user, project, showcase, or comment.
* **Access**: Private

---

## 10. Administration Endpoints

### `GET /api/admin/users` `[PLANNED]`
* **What it does**: Lists all system users for admin moderation.
* **Access**: Private (Admin only)
* **Pagination**: Yes — supports `?page=1&limit=10`

### `PATCH /api/admin/users/:id/status` `[PLANNED]`
* **What it does**: Suspends or restores a user account.
* **Access**: Private (Admin only)

### `GET /api/admin/projects` `[PLANNED]`
* **What it does**: Lists all projects for admin review.
* **Access**: Private (Admin only)
* **Pagination**: Yes — supports `?page=1&limit=10`

### `DELETE /api/admin/projects/:id` `[PLANNED]`
* **What it does**: Removes an inappropriate project.
* **Access**: Private (Admin only)

### `GET /api/admin/reports` `[PLANNED]`
* **What it does**: Lists submitted user reports.
* **Access**: Private (Admin only)
* **Pagination**: Yes — supports `?page=1&limit=10`

### `PATCH /api/admin/reports/:id` `[PLANNED]`
* **What it does**: Resolves or dismisses a report.
* **Access**: Private (Admin only)

### `GET /api/admin/statistics` `[PLANNED]`
* **What it does**: Retrieves system platform statistics (user totals, active projects, reports).
* **Access**: Private (Admin only)
