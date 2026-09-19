const express = require('express');
const router = express.Router();
const { decideRequest } = require('../controllers/requestController');
const { authMiddleware } = require('../middleware/authMiddleware');

// PATCH /api/requests/:id — owner accepts or rejects a pending request.
router.patch('/:id', authMiddleware, decideRequest);

module.exports = router;
