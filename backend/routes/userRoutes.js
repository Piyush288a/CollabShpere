const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET /api/users/profile — private (requires valid JWT)
router.get('/profile', authMiddleware, getProfile);

// PUT /api/users/profile — private (requires valid JWT)
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
