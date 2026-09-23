const jwt = require('jsonwebtoken');
const User = require('../models/User');

// authMiddleware — protects private routes
// Reads the JWT from the Authorization header, verifies it, confirms the
// account still exists and is not suspended, and attaches { userId, role }
// to req.user for downstream handlers.
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const err = new Error('Not authorized — no token provided');
    err.statusCode = 401;
    return next(err);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Re-check the account on every request so suspensions take effect
    // immediately, even for previously issued tokens.
    const user = await User.findById(decoded.userId).select('status');
    if (!user || user.status === 'suspended') {
      const err = new Error('Not authorized — account suspended');
      err.statusCode = 401;
      return next(err);
    }

    // Preserve the existing req.user shape for all downstream handlers.
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    const err = new Error('Not authorized — token is invalid or expired');
    err.statusCode = 401;
    return next(err);
  }
};

// adminMiddleware — must be used AFTER authMiddleware
// Checks that the authenticated user has the admin role.
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  const err = new Error('Access denied — admin only');
  err.statusCode = 403;
  return next(err);
};

module.exports = { authMiddleware, adminMiddleware };
