# CollabSphere — Project Overview & Context

Welcome to **CollabSphere**! This document explains what CollabSphere is, who it is for, how it works, and the main rules of the project in simple, easy-to-understand language.

---

## 1. What is CollabSphere?

CollabSphere is a web platform built for university students. 

It helps students to:
* **Create & Find Projects**: Post project ideas or search for projects created by classmates.
* **Find Teammates**: Look for team members based on skills (like React, Python, or UI/UX design).
* **Join Projects**: Send requests (`CollaborationRequests`) to join open projects.
* **Work Together**: Manage team tasks (`Tasks`) and chat with project members (`Messages`) in real time.
* **Showcase Work**: Publish completed projects (`Showcases`) for everyone to see.
* **Interact**: Like, comment on, and bookmark projects and showcases.

Administrators help manage the platform by keeping users safe, checking reports, and removing inappropriate content.

---

## 2. User Roles (Who uses CollabSphere?)

### 1. Student
* **What they do**: Standard user account for university students.
* **What they can do**:
  * Create a profile with their skills and bio.
  * Post a new project (becomes the Project Owner `ownerId`).
  * Search projects by skill or category.
  * Send collaboration requests (`senderId`) to join other students' projects.
  * Accept or reject requests from students who want to join their project.
  * Create tasks (`assignedTo`) and chat with teammates (`message`) inside their project workspace.
  * Publish a Showcase (`technologies`) when their project is finished.
  * Bookmark (`Projects.bookmarkedBy`), like, and comment on projects and showcases.
  * Report bad behavior or content to administrators.

### 2. Administrator (Admin)
* **What they do**: Special account role with extra permissions to manage the platform.
* **What they can do**:
  * View overall platform statistics (total users, active projects, reports).
  * Manage user accounts (suspend or restore accounts).
  * Review reports sent by students and remove bad content.
* *Note*: Admin is just a special user role (`role: "admin"`), not a completely separate website or login system.

---

## 3. Technology Stack (What tools are used?)

We use the **MERN Stack** (MongoDB, Express, React, Node.js) with standard JavaScript.

| Part | Tool | Simple Explanation |
| :--- | :--- | :--- |
| **Frontend (User Interface)** | React.js (Vite) | Displays the screens and buttons users see in their browser. |
| **Styling** | Tailwind CSS | Makes the website look clean and modern. |
| **Backend (Server)** | Node.js + Express.js | Handles the background logic and responds to client requests. |
| **Database** | MongoDB + Mongoose | Saves users, projects, tasks, and messages permanently. |
| **Security & Login** | JWT & bcryptjs | Keeps user passwords safe and handles secure logins. |
| **Real-Time Chat** | Socket.IO | Enables instant messaging between team members *(Deferred to Phase 7)*. |
| **Photo Uploads** | Cloudinary | Stores profile pictures and showcase screenshots *(Deferred to Phase 8/10)*. |

### ⛔ What we are NOT using:
* No **TypeScript** (we use plain JavaScript).
* No **Next.js** or SQL databases.
* No complex microservices. We keep everything clean, simple, and modular.

---

## 4. Key Rules of the Project (Domain Rules)

### Rule 1: Project Lifecycle (Status Steps)
Projects follow 3 simple steps:
1. `OPEN`: The project is active and looking for team members.
2. `IN_PROGRESS`: The team is formed and actively working. New requests are no longer accepted.
3. `COMPLETED`: The project is finished and ready to be published as a Showcase.

*Note: Projects do NOT need admin approval to open. They start as `OPEN` immediately when created.*

### Rule 2: Collaboration Requests
* **No Self-Requests**: You cannot request to join your own project (`senderId !== ownerId`).
* **No Duplicate Requests**: You can only have 1 active pending request per project at a time.
* **Owner Decision**: Only the project owner can accept or reject requests.
* **Team Size Limit**: A project cannot accept more members if it hits `teamSize`.
* **Member Sync**: When an owner accepts a request, that student is added to the project's member list (`Projects.memberIds`).
* **Open Status Only**: Requests can only be sent and accepted when the project status is `OPEN`.

### Rule 3: Showcase & Bookmarks
* **Showcase**: Can only be published after the project status is changed to `COMPLETED`. Showcase features technology tags (`technologies`), links, screenshots, likes, and comments.
* **Bookmarks**: Students can save open projects (`Projects.bookmarkedBy`) and finished showcases to their bookmarks list.

---

## 5. Development Principles

1. **Keep Frontend & Backend Separate**: The React frontend talks to the Express backend using simple web API requests.
2. **Keep Environment Variables Secret**: Passwords and database links are stored in `.env` files and never uploaded to GitHub.
3. **Hide Passwords**: Passwords are saved as scrambled hashes (`bcryptjs`) and never sent in API responses.
4. **Simple Code**: Write clean, easy-to-read code without over-complicating things.

---

## 6. Complete Project Phase History

*This section keeps a complete record of every phase completed in CollabSphere.*

### 🟢 Phase 0: Project Foundation & Architecture (COMPLETED)
* **What was done**: Set up repository folders (`frontend/`, `backend/`, `docs/`), completed folder restructuring (`client/server` → `frontend/backend`), wrote all initial documentation files in plain English, designed database collections with standardized field names (`senderId`, `assignedTo`, `message`, `technologies`), created API contracts, and set up `.gitignore`.
* **Status**: Completed successfully.

### 🟢 Phase 1: Backend Infrastructure (COMPLETED)
* **What was done**: Created `backend/package.json` with all production dependencies, `backend/config/db.js` for MongoDB connection (with safe exit on failure), `backend/app.js` as the exportable Express app (with health check, 404 handler, and centralized error handler), and `backend/server.js` as the server entry point that awaits database connection before starting. All responses follow the documented `{ success, data/message }` JSON envelope.
* **Status**: Completed successfully.

### 🟢 Phase 2: Authentication & Authorization (COMPLETED)
* **What was done**: Built user registration and login with `bcryptjs` password hashing (10 salt rounds), JWT generation using environment variables, `authMiddleware` and `adminMiddleware` for route protection, `GET /api/users/profile` as the first protected endpoint, email format validation via Mongoose schema, and Mongoose `ValidationError` → `400` mapping in the centralized error handler. 17/17 tests passing.
* **Status**: Completed successfully.

### 🟢 Phase 3: User Profiles (COMPLETED)
* **What was done**: Added `PUT /api/users/profile` for authenticated profile updates. Updatable fields are allowlisted (`name`, `bio`, `skills`, `githubUrl`, `linkedinUrl`, `avatar`); `email`, `password`, and `role` are protected from modification. Supports partial updates with Mongoose validators. Relocated `getProfile` to `userController.js` and extracted the shared `formatUser` helper to `utils/`. 26/26 tests passing. (User search deferred to Phase 4.)
* **Status**: Completed successfully.

### ⏳ Phase 4: Project Management (UPCOMING)
* **What will be done**: Project model, create/search/filter projects, status transitions, bookmarking, and user search by skills.
