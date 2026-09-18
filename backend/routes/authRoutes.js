const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register — public
router.post('/register', register);

// POST /api/auth/login — public
router.post('/login', login);

module.exports = router;
