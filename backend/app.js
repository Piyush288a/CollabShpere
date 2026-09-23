const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const requestRoutes = require('./routes/requestRoutes');
const taskRoutes = require('./routes/taskRoutes');
const showcaseRoutes = require('./routes/showcaseRoutes');

const app = express();

// --- Global Middleware ---

// Allow requests from the React frontend (configured via CLIENT_URL)
app.use(cors({ origin: process.env.CLIENT_URL }));

// Parse incoming JSON request bodies
app.use(express.json());

// --- Routes ---

// Health check — confirms the server and process are alive
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: { message: 'Server is running' },
  });
});

// Auth routes: POST /api/auth/register, POST /api/auth/login
app.use('/api/auth', authRoutes);

// User routes: GET /api/users/profile, GET /api/users/search
app.use('/api/users', userRoutes);

// Project routes: CRUD, search/filter, status, bookmarks, collaboration requests, team
app.use('/api/projects', projectRoutes);

// Collaboration request decisions: PATCH /api/requests/:id
app.use('/api/requests', requestRoutes);

// Task decisions: PATCH/DELETE /api/tasks/:id
app.use('/api/tasks', taskRoutes);

// Showcase routes: publish, feed, detail, like/unlike, comments
app.use('/api/showcases', showcaseRoutes);

// --- 404 Handler ---
// Catches any request that did not match a registered route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// --- Centralized Error Handler ---
// Must be last — handles errors passed via next(error) from any route
app.use(errorHandler);

module.exports = app;
