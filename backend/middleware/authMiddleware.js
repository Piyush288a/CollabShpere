const jwt = require('jsonwebtoken');

// authMiddleware — protects private routes
// Reads the JWT from the Authorization header, verifies it,
// and attaches { userId, role } to req.user for downstream handlers.
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const err = new Error('Not authorized — no token provided');
    err.statusCode = 401;
    return next(err);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded payload so route handlers can read req.user.userId and req.user.role
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
