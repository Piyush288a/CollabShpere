const express = require('express');
const router = express.Router();
const { createReport } = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/authMiddleware');

// POST /api/reports — file a report (authenticated users)
router.post('/', authMiddleware, createReport);

module.exports = router;
