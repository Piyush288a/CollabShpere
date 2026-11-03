const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, searchUsers, getUserById } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET /api/users/search — private. Registered before any /:id route to avoid capture.
router.get('/search', authMiddleware, searchUsers);

// GET /api/users/profile — private (requires valid JWT)
router.get('/profile', authMiddleware, getProfile);

// PUT /api/users/profile — private (requires valid JWT)
router.put('/profile', authMiddleware, updateProfile);

// GET /api/users/:id — public user profile
router.get('/:id', getUserById);

module.exports = router;
