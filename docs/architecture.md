# CollabSphere — Architecture & System Design

This document explains how CollabSphere is designed, how data moves through the app, and how the database is structured in simple, clear language.

---

## 1. How CollabSphere Works (System Overview)

CollabSphere has 3 main parts (3 tiers):

```text
+-------------------------------------------------------------+
|                      1. FRONTEND (Client)                   |
|                   React.js + Tailwind CSS                   |
|     What users see and click in their web browser.           |
+-------------------------------------------------------------+
                               |
                               | Sends API Requests with Login Token
                               v
+-------------------------------------------------------------+
|                      2. BACKEND (Server)                    |
|                     Node.js + Express.js                    |
|     Handles app logic, checks permissions, processes data.  |
+-------------------------------------------------------------+
                               |
                               | Reads & Writes Data
                               v
+-------------------------------------------------------------+
|                     3. DATABASE (MongoDB)                   |
|     Stores users, projects, requests, tasks, and messages.  |
+-------------------------------------------------------------+
```

---

## 2. What Each Part Does

### 1. Frontend (React.js + Vite + Tailwind CSS)
* Runs in the user's web browser.
* Renders interactive screens (Login, Dashboard, Project Search, Workspace, Admin Panel).
* Sends REST API requests to the backend server.
* Stores the user's login token (JWT) safely for authorized sessions.

### 2. Backend (Node.js + Express.js)
* Listens for REST API requests under `/api`.
* Validates user input and checks security permissions.
* Encrypts passwords securely using `bcryptjs`.
* Communicates with MongoDB using Mongoose.
* The Express app (`app.js`) is kept separate from the server entry point (`server.js`) so that the app can be imported cleanly during automated testing without binding to a port.
* Prepares Socket.IO real-time chat gateways *(Deferred to Phase 7)*.

### 3. Database (MongoDB + Mongoose)
* Persists data in MongoDB collections.
* Enforces data schema fields, indexes, and user references via Mongoose.

### 4. Socket.IO *(Deferred to Phase 7)*
* Will handle real-time instant messaging inside project workspace chat rooms. Implementation details remain deferred until Phase 7.

### 5. Cloudinary *(Deferred to Phase 8/10)*
* Will store user avatars and showcase screenshots in the cloud. Implementation details remain deferred until relevant feature phases.

---

## 3. Directory Breakdown Specifications

*(Note: The subdirectories listed below will be introduced incrementally during their relevant implementation phases and are not created during Phase 0).*

### Backend Structure (`backend/`)

| Directory | Responsibility |
| :--- | :--- |
| `config/` | Environment and database configuration |
| `controllers/` | Request-handling and business logic |
| `middleware/` | Authentication, authorization, validation, and errors |
| `models/` | Mongoose schemas |
| `routes/` | API route definitions |
| `seeders/` | Development seed data |
| `tests/` | Backend automated tests (Jest + Supertest, introduced in Phase 2) |

### Frontend Structure (`frontend/`)

| Directory | Responsibility |
| :--- | :--- |
| `src/components/` | Reusable UI components |
| `src/pages/` | Route-level pages |
| `src/services/` | Backend API communication |
| `src/hooks/` | Reusable React hooks |
| `src/context/` | Shared application state when required |
| `src/assets/` | Frontend assets |

---

## 4. API Response Standards

All API responses use a consistent JSON envelope.

**Success:**
```json
{ "success": true, "data": {} }
```

**Error:**
```json
{ "success": false, "message": "Human-readable error description" }
```

**Paginated list responses** nest results and pagination metadata inside `data`:
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

Default pagination values: `page=1`, `limit=10`. See `docs/api-contract.md` Section 0 for the full HTTP status code table and pagination endpoint list.

**Mongoose ValidationError handling**: When a Mongoose schema validation fails (e.g. invalid email format, missing required field), the centralized error handler in `middleware/errorHandler.js` detects `err.name === 'ValidationError'`, maps it to `400 Bad Request`, and returns the first validation message in the standard error envelope.

---

## 5. Testing Strategy

* **Test runner**: Jest
* **HTTP testing**: Supertest (fires real requests against the Express app without starting a live server)
* **Introduced**: Phase 2 (alongside the first real routes and models)
* **Test location**: `backend/tests/`
* **Test database**: A separate MongoDB test database configured via environment variables — never the development database
* **Focus areas**: Business-critical rules — authentication, collaboration request constraints, project status transitions
* **App/server separation**: `app.js` exports the configured Express app; `server.js` imports it and starts the HTTP listener. This is established in Phase 1 to make the app testable from Phase 2 onward.

---

## 6. Conceptual JWT Authentication Flow

1. **Login**: User submits credentials (`POST /api/auth/login`).
2. **Verification**: Backend checks password hash with `bcryptjs`.
3. **Token Creation**: Backend signs a JWT containing `userId` and `role`.
4. **Authorization**: Client sends token in header (`Authorization: Bearer <token>`) for protected routes. `authMiddleware` validates token before granting access.

---

## 7. Planned MongoDB Collections (Database Design)

### 1. `Users` Collection
* **Purpose**: Stores student and administrator accounts.
* **Fields**: `_id`, `name`, `email`, `password` (hashed), `role` (`"student"` or `"admin"`), `avatar`, `skills`, `bio`, `githubUrl`, `linkedinUrl`, `createdAt`, `updatedAt`.
* **Email validation**: The `email` field enforces format validation via a regex match (`/^\S+@\S+\.\S+$/`). Invalid formats are rejected with a Mongoose `ValidationError` which the centralized error handler maps to `400 Bad Request`.

### 2. `Projects` Collection
* **Purpose**: Stores projects created by students seeking team collaboration.
* **Major Fields**:
  * `_id`: Unique project ID.
  * `ownerId`: User ID of the project creator (ref: `Users`).
  * `memberIds`: Array of user IDs of accepted team members (ref: `Users`).
  * `title`: Name of the project.
  * `description`: Detailed project explanation.
  * `category`: Domain category (e.g. Web Development, Mobile, AI).
  * `requiredSkills`: Array of skill tags needed for the project.
  * `teamSize`: Maximum team capacity allowed.
  * `deadline`: Target completion date.
  * `status`: Project lifecycle stage (`"OPEN"`, `"IN_PROGRESS"`, `"COMPLETED"`). Starts directly as `"OPEN"`.
  * `bookmarkedBy`: Array of user IDs who bookmarked this project (ref: `Users`).
  * `createdAt`: Creation timestamp.

### 3. `CollaborationRequests` Collection
* **Purpose**: Tracks requests to join open projects.
* **Fields**: `_id`, `projectId` (ref: `Projects`), `senderId` (ref: `Users`), `message`, `status` (`"PENDING"`, `"ACCEPTED"`, `"REJECTED"`), `createdAt`.

### 4. `Tasks` Collection
* **Purpose**: Workspace tasks for project team members.
* **Fields**: `_id`, `projectId` (ref: `Projects`), `title`, `description`, `assignedTo` (ref: `Users`), `status` (`"TODO"`, `"IN_PROGRESS"`, `"COMPLETED"`), `dueDate`, `createdAt`.

### 5. `Messages` Collection
* **Purpose**: Workspace chat messages.
* **Fields**: `_id`, `projectId` (ref: `Projects`), `senderId` (ref: `Users`), `message`, `createdAt`.

### 6. `Showcases` Collection
* **Purpose**: Public showcases for finished projects.
* **Fields**: `_id`, `projectId` (ref: `Projects`), `title`, `description`, `technologies`, `githubUrl`, `demoUrl`, `images`, `likesCount`, `likedBy`, `comments`, `createdAt`.
* **`images` field**: Array of URL strings. Defaults to an empty array `[]`. Populated with Cloudinary URLs when Phase 8/10 image upload is implemented. Accepts manually provided URL strings in the interim.
* **`comments` field**: Array of embedded subdocuments stored directly inside the Showcase document. No separate `Comments` collection. Each embedded comment contains:
  * `_id`: Auto-generated comment ID.
  * `userId`: Reference to `Users._id` (who wrote the comment).
  * `text`: The comment text string.
  * `createdAt`: Timestamp the comment was posted.

### 7. `Reports` Collection
* **Purpose**: User moderation reports.
* **Fields**: `_id`, `reporterId` (ref: `Users`), `targetType` (`"USER"`, `"PROJECT"`, `"SHOWCASE"`, `"COMMENT"`), `targetId`, `reason`, `status` (`"PENDING"`, `"RESOLVED"`, `"DISMISSED"`), `createdAt`.

---

## 8. Key Relationships Between Collections

* `Projects.ownerId` → References `Users._id`.
* `Projects.memberIds` → Array of references to `Users._id`.
* `Projects.bookmarkedBy` → Array of references to `Users._id`.
* `CollaborationRequests.projectId` → References `Projects._id`.
* `CollaborationRequests.senderId` → References `Users._id`.
* `Tasks.projectId` → References `Projects._id`.
* `Tasks.assignedTo` → References `Users._id`.
* `Messages.projectId` → References `Projects._id`.
* `Messages.senderId` → References `Users._id`.
* `Showcases.projectId` → References `Projects._id`.
* `Showcases.comments[].userId` → References `Users._id` (embedded subdocument, not a separate collection).
* `Reports.reporterId` → References `Users._id`.
