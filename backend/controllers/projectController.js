const mongoose = require('mongoose');
const Project = require('../models/Project');
const formatProject = require('../utils/formatProject');
const { parsePagination, buildPagination } = require('../utils/paginate');

// Fields a user may set on create / update. Server-controlled fields
// (ownerId, memberIds, status, bookmarkedBy) are never accepted here.
const EDITABLE_FIELDS = [
  'title',
  'description',
  'category',
  'requiredSkills',
  'teamSize',
  'deadline',
  'difficulty',
  'repositoryUrl',
  'projectImage',
];

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const STATUSES = ['OPEN', 'IN_PROGRESS', 'COMPLETED'];

// Forward-only status transition map.
const ALLOWED_TRANSITIONS = {
  OPEN: ['IN_PROGRESS'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
};

// Helper — 404 for an invalid or unknown project id.
const notFound = () => {
  const err = new Error('Project not found');
  err.statusCode = 404;
  return err;
};

// Helper — pulls allowlisted fields out of the body into an updates object.
const pickEditable = (body) => {
  const updates = {};
  for (const field of EDITABLE_FIELDS) {
    if (body[field] !== undefined) updates[field] = body[field];
  }
  return updates;
};

// POST /api/projects — create a project (authenticated).
const createProject = async (req, res, next) => {
  try {
    const data = pickEditable(req.body);
    const ownerId = req.user.userId;

    const project = await Project.create({
      ...data,
      ownerId,
      memberIds: [ownerId], // owner is always the first member
      status: 'OPEN',
    });

    res.status(201).json({
      success: true,
      data: { project: formatProject(project) },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects — list with search, filters, and pagination (public).
const listProjects = async (req, res, next) => {
  try {
    const { search, category, difficulty, status, skills } = req.query;
    const filter = {};

    // Text search across title OR description (case-insensitive partial).
    if (search) {
      const rx = new RegExp(search, 'i');
      filter.$or = [{ title: rx }, { description: rx }];
    }

    // Exact (case-insensitive) category match.
    if (category) {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    // Enum filters — reject unknown values with 400.
    if (difficulty !== undefined) {
      if (!DIFFICULTIES.includes(difficulty)) {
        const err = new Error('Invalid difficulty filter');
        err.statusCode = 400;
        return next(err);
      }
      filter.difficulty = difficulty;
    }

    if (status !== undefined) {
      if (!STATUSES.includes(status)) {
        const err = new Error('Invalid status filter');
        err.statusCode = 400;
        return next(err);
      }
      filter.status = status;
    }

    // Skills — match ANY provided skill (case-insensitive).
    if (skills) {
      const list = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => new RegExp(`^${s}$`, 'i'));
      if (list.length) filter.requiredSkills = { $in: list };
    }

    const { page, limit, skip } = parsePagination(req.query);

    const [totalCount, projects] = await Promise.all([
      Project.countDocuments(filter),
      Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: {
        results: projects.map(formatProject),
        pagination: buildPagination({ totalCount, page, limit }),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:id — fetch a single project (public).
const getProjectById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next(notFound());

    const project = await Project.findById(req.params.id);
    if (!project) return next(notFound());

    res.status(200).json({
      success: true,
      data: { project: formatProject(project) },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/projects/:id — owner-only update of editable fields.
const updateProject = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next(notFound());

    const project = await Project.findById(req.params.id);
    if (!project) return next(notFound());

    if (String(project.ownerId) !== req.user.userId) {
      const err = new Error('Access denied — project owner only');
      err.statusCode = 403;
      return next(err);
    }

    const updates = pickEditable(req.body);

    // teamSize cannot drop below the current member count.
    if (updates.teamSize !== undefined && updates.teamSize < project.memberIds.length) {
      const err = new Error('Team size cannot be less than the current number of members');
      err.statusCode = 400;
      return next(err);
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: { project: formatProject(updated) },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/projects/:id/status — owner-only forward status transition.
const updateStatus = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next(notFound());

    const project = await Project.findById(req.params.id);
    if (!project) return next(notFound());

    if (String(project.ownerId) !== req.user.userId) {
      const err = new Error('Access denied — project owner only');
      err.statusCode = 403;
      return next(err);
    }

    const { status } = req.body;
    if (!STATUSES.includes(status)) {
      const err = new Error('Invalid status value');
      err.statusCode = 400;
      return next(err);
    }

    if (!ALLOWED_TRANSITIONS[project.status].includes(status)) {
      const err = new Error(`Invalid status transition from ${project.status} to ${status}`);
      err.statusCode = 400;
      return next(err);
    }

    project.status = status;
    await project.save();

    res.status(200).json({
      success: true,
      data: { project: formatProject(project) },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/projects/:id — owner-only delete.
const deleteProject = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next(notFound());

    const project = await Project.findById(req.params.id);
    if (!project) return next(notFound());

    if (String(project.ownerId) !== req.user.userId) {
      const err = new Error('Access denied — project owner only');
      err.statusCode = 403;
      return next(err);
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: { message: 'Project deleted', id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/projects/:id/bookmark — add current user (idempotent).
const addBookmark = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next(notFound());

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { bookmarkedBy: req.user.userId } },
      { new: true }
    );
    if (!project) return next(notFound());

    res.status(200).json({
      success: true,
      data: { project: formatProject(project) },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/projects/:id/bookmark — remove current user (idempotent).
const removeBookmark = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next(notFound());

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $pull: { bookmarkedBy: req.user.userId } },
      { new: true }
    );
    if (!project) return next(notFound());

    res.status(200).json({
      success: true,
      data: { project: formatProject(project) },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  listProjects,
  getProjectById,
  updateProject,
  updateStatus,
  deleteProject,
  addBookmark,
  removeBookmark,
};
