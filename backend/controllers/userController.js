const User = require('../models/User');
const formatUser = require('../utils/formatUser');

// GET /api/users/profile
// Protected by authMiddleware — req.user is already populated
const getProfile = async (req, res, next) => {
  try {
    // req.user.userId is set by authMiddleware after token verification
    const user = await User.findById(req.user.userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      data: {
        user: formatUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Fields a user is allowed to update on their own profile.
// email, password, and role are deliberately excluded.
const ALLOWED_FIELDS = ['name', 'bio', 'skills', 'githubUrl', 'linkedinUrl', 'avatar'];

// PUT /api/users/profile
// Protected by authMiddleware — updates the authenticated user's own profile.
const updateProfile = async (req, res, next) => {
  try {
    // Build the update object from allowlisted fields only.
    // Any email, password, or role fields in the body are ignored.
    const updates = {};
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      data: {
        user: formatUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
