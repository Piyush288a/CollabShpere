# CollabSphere Production Deployment & CI/CD Guide

This guide walks you through deploying **CollabSphere** to production using modern cloud platforms (**Vercel** + **Render** + **MongoDB Atlas**) and configuring automated **CI/CD with GitHub Actions**.

---

## 🏛 Architecture Overview

```
                                      +-------------------------------+
                                      |         GitHub Repo           |
                                      |   (GitHub Actions CI/CD)      |
                                      +---------------+---------------+
                                                      |
                             +------------------------+------------------------+
                             | (on push to main)                               | (on push to main)
                             v                                                 v
                  +---------------------+                           +---------------------+
                  |       Vercel        |                           |       Render        |
                  |  (React Vite SPA)   |                           | (Node Express + WS) |
                  +----------+----------+                           +----------+----------+
                             |                                                 |
                             | HTTPS / REST                                    | Mongoose Driver
                             | WSS / Socket.IO                                 v
                             +----------------------------------------> +-----------------+
                                                                        |  MongoDB Atlas  |
                                                                        | (Cloud Cluster) |
                                                                        +-----------------+
```

| Component | Platform | Why Selected |
| :--- | :--- | :--- |
| **Frontend** | [Vercel](https://vercel.com) | Blazing-fast global edge CDN, automatic HTTPS, SPA rewrites, zero config. |
| **Backend & Socket.IO** | [Render](https://render.com) | Native WebSocket / Socket.IO support, automatic HTTPS, free/starter plans. |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) | Fully managed MongoDB cloud cluster (M0 Free tier), automated backups. |
| **CI/CD** | [GitHub Actions](https://github.com/features/actions) | Runs automated 177+ test suite, builds frontend, triggers deployment. |

---

## 📋 Step 1: Set Up MongoDB Atlas

1. **Sign Up / Log In**: Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and log in.
2. **Create a Free Cluster**:
   * Click **Create Database** -> Choose **M0 (Shared Free Tier)**.
   * Select a region close to your target users (e.g., AWS / Mumbai, Frankfurt, or N. Virginia).
   * Name your cluster (e.g., `collabsphere-cluster`).
3. **Configure Database Access (User)**:
   * Go to **Security** -> **Database Access** -> Click **Add New Database User**.
   * Authentication Method: **Password**.
   * Create username (e.g., `collabsphere_admin`) and a secure password. Keep this safe.
   * Database User Privileges: **Read and write to any database**.
4. **Configure Network Access (IP Whitelist)**:
   * Go to **Security** -> **Network Access** -> Click **Add IP Address**.
   * Click **Allow Access from Anywhere** (`0.0.0.0/0`). *(Required because Render dynamically provisions cloud IPs).*
5. **Get Connection String**:
   * Go to **Database** -> Click **Connect** on your cluster.
   * Select **Drivers** -> Driver: **Node.js**, Version: **5.5 or later**.
   * Copy the connection string. It looks like:
     ```
     mongodb+srv://collabsphere_admin:<password>@collabsphere-cluster.xxxx.mongodb.net/collabsphere?retryWrites=true&w=majority
     ```
   * Replace `<password>` with your actual database user password.

---

## 🚀 Step 2: Deploy Backend to Render

### Option A: Using the Render Blueprint (Recommended - One Click)
1. Go to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> Select **Blueprint**.
3. Connect your GitHub repository (`CollabShpere`).
4. Render will automatically detect the `render.yaml` configuration in the root directory.
5. In the configuration screen, provide the secret environment variables:
   * `MONGODB_URI`: Your MongoDB Atlas connection string from Step 1.
   * `CLIENT_URL`: Your frontend URL (e.g. `https://your-collabsphere.vercel.app` or `*` temporarily).
6. Click **Apply**. Render will provision and launch your backend web service.

### Option B: Manual Web Service Setup
1. On Render Dashboard, click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   * **Name**: `collabsphere-backend`
   * **Root Directory**: `backend`
   * **Environment**: `Node`
   * **Build Command**: `npm ci`
   * **Start Command**: `npm start`
   * **Health Check Path**: `/api/health`
4. Add **Environment Variables**:
   * `NODE_ENV`: `production`
   * `PORT`: `10000`
   * `MONGODB_URI`: *(Your MongoDB Atlas URI)*
   * `JWT_SECRET`: *(A random 64-character string)*
   * `JWT_EXPIRES_IN`: `7d`
   * `CLIENT_URL`: `https://your-collabsphere.vercel.app`
5. Click **Create Web Service**. Note your backend URL (e.g., `https://collabsphere-backend.onrender.com`).
6. Under **Settings** -> Scroll to **Deploy Hook** -> Click **Create Deploy Hook** and copy the webhook URL. You'll need this for CI/CD.

---

## 🌐 Step 3: Deploy Frontend to Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`CollabShpere`).
4. Configure the Project:
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click *Edit* and select `frontend`.
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Add **Environment Variables**:
   * `VITE_API_BASE_URL`: `https://collabsphere-backend.onrender.com/api`
   * `VITE_SOCKET_URL`: `https://collabsphere-backend.onrender.com`
6. Click **Deploy**.
7. Vercel will build and assign you a production domain (e.g., `https://collabsphere.vercel.app`).
8. **Important**: Go back to Render backend environment variables and ensure `CLIENT_URL` matches this Vercel domain!

---

## ⚡ Step 4: Automated CI/CD with GitHub Actions

The repository includes a ready-to-run GitHub Actions workflow at [`.github/workflows/ci-cd.yml`](file:///.github/workflows/ci-cd.yml).

### Workflow Capabilities:
1. **Pull Requests & Pushes**:
   * Runs an isolated MongoDB 6.0 service container.
   * Runs all 177 backend unit/integration tests with Jest.
   * Builds the frontend with Vite to catch bundling and syntax errors before code reaches production.
2. **Push to `main` (Continuous Deployment)**:
   * Automatically triggers Render to rebuild and deploy the latest backend code via webhook.
   * Automatically deploys the latest frontend build to Vercel.

### Setting Up Secrets on GitHub:
In your GitHub repository, go to **Settings** -> **Secrets and variables** -> **Actions** -> Click **New repository secret**:

| Secret Name | Value Description | Where to get it |
| :--- | :--- | :--- |
| `RENDER_DEPLOY_HOOK_URL` | Render Deploy Hook URL | Render Service Dashboard -> Settings -> Deploy Hook |
| `VERCEL_TOKEN` | Vercel Personal Access Token | [Vercel Account Settings -> Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel Organization / User ID | In project `.vercel/project.json` or team settings |
| `VERCEL_PROJECT_ID` | Vercel Project ID | Project Settings -> General -> Project ID |

*(Note: Even without Vercel CLI secrets, Vercel's native GitHub integration deploys automatically whenever `main` updates!)*

---

## 🐳 Alternative: Running Locally with Docker Compose

If you or your team want to run the full stack containerized:

```bash
# 1. Build and launch MongoDB, Backend, and Frontend containers
docker-compose up --build

# 2. Access the services:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
# Healthcheck: http://localhost:5000/api/health
```

---

## 🔍 Step 5: Verification & Smoke Testing Checklist

Once deployed, verify everything works:

1. **Backend Health Check**:
   Open `https://collabsphere-backend.onrender.com/api/health` in your browser. You should receive:
   ```json
   { "success": true, "data": { "message": "Server is running" } }
   ```
2. **Frontend Routing**:
   Navigate to your Vercel site (`https://collabsphere.vercel.app/`). Refresh on a sub-route like `/projects` or `/login`. It should render correctly without 404 errors (handled by [`vercel.json`](file:///frontend/vercel.json)).
3. **Database Seeding (Optional)**:
   You can populate demo data directly from your local terminal to Atlas:
   ```bash
   cd backend
   MONGODB_URI="your_atlas_connection_string" node seeders/seed.js
   ```
4. **Real-Time WebSockets**:
   Log in with two accounts in different browser tabs. Join a project workspace and send a message. Verify that messages arrive instantaneously without page refreshes.

---

## 🧠 Step 6: Preparing for Real-Time AI Analysis (Next Phase)

Now that CollabSphere is deployed and automated with CI/CD:
1. **API Keys**: Add `GEMINI_API_KEY` to your Render environment variables and local `.env`.
2. **AI Streaming Architecture**: Since Socket.IO is already configured in production with low latency, real-time AI responses (e.g., project pitch analysis, skill matching suggestions, toxicity filters) can be streamed over existing WebSockets or standard SSE endpoints.
3. **Worker Readiness**: Background analysis jobs can run asynchronously on Node without blocking Express HTTP handlers.
