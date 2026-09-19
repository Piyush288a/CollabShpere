const User = require('../models/User');
const formatUser = require('../utils/formatUser');
const { parsePagination, buildPagination } = require('../utils/paginate');

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

// GET /api/users/search
// Protected — finds potential collaborators by skill and/or name.
// Excludes the requesting user. Designed to feed Phase 5 collaboration requests.
const searchUsers = async (req, res, next) => {
  try {
    const { skills, search } = req.query;
    const filter = { _id: { $ne: req.user.userId } };

    if (skills) {
      const list = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => new RegExp(`^${s}$`, 'i'));
      if (list.length) filter.skills = { $in: list };
    }

    if (search) {
      filter.name = new RegExp(search, 'i');
    }

    const { page, limit, skip } = parsePagination(req.query);

    const [totalCount, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: {
        results: users.map(formatUser),
        pagination: buildPagination({ totalCount, page, limit }),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, searchUsers };
