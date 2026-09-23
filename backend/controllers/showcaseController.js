const mongoose = require('mongoose');
const Showcase = require('../models/Showcase');
const Project = require('../models/Project');
const { formatShowcase, formatComment } = require('../utils/formatShowcase');
const { parsePagination, buildPagination } = require('../utils/paginate');

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// Fields a publisher may set. Server-controlled fields are never accepted.
const PUBLISH_FIELDS = ['title', 'description', 'technologies', 'githubUrl', 'demoUrl', 'images'];

// POST /api/showcases — publish a showcase for a COMPLETED project (owner only).
const publishShowcase = async (req, res, next) => {
  try {
    const { projectId } = req.body;
    if (!mongoose.isValidObjectId(projectId)) return next(httpError('Project not found', 404));

    const project = await Project.findById(projectId);
    if (!project) return next(httpError('Project not found', 404));

    if (String(project.ownerId) !== req.user.userId) {
      return next(httpError('Access denied — project owner only', 403));
    }

    if (project.status !== 'COMPLETED') {
      return next(httpError('Only completed projects can be showcased', 400));
    }

    const data = { projectId };
    for (const field of PUBLISH_FIELDS) {
      if (req.body[field] !== undefined) data[field] = req.body[field];
    }

    const showcase = await Showcase.create(data);

    res.status(201).json({
      success: true,
      data: { showcase: formatShowcase(showcase) },
    });
  } catch (error) {
    // Unique projectId violation -> one showcase per project.
    if (error && error.code === 11000) {
      return next(httpError('This project already has a showcase', 409));
    }
    next(error);
  }
};

// GET /api/showcases — public paginated feed, newest-first.
const listShowcases = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [totalCount, showcases] = await Promise.all([
      Showcase.countDocuments({}),
      Showcase.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: {
        results: showcases.map(formatShowcase),
        pagination: buildPagination({ totalCount, page, limit }),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/showcases/:id — public single showcase (includes comments).
const getShowcaseById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next(httpError('Showcase not found', 404));
    const showcase = await Showcase.findById(req.params.id);
    if (!showcase) return next(httpError('Showcase not found', 404));

    res.status(200).json({
      success: true,
      data: { showcase: formatShowcase(showcase) },
    });
  } catch (error) {
    next(error);
  }
};

// Keeps likesCount in sync with likedBy (the source of truth).
const syncLikes = async (showcase) => {
  if (showcase.likesCount !== showcase.likedBy.length) {
    showcase.likesCount = showcase.likedBy.length;
    await showcase.save();
  }
  return showcase;
};

// POST /api/showcases/:id/like — idempotent like.
const likeShowcase = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next(httpError('Showcase not found', 404));
    const showcase = await Showcase.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likedBy: req.user.userId } },
      { new: true }
    );
    if (!showcase) return next(httpError('Showcase not found', 404));
    await syncLikes(showcase);

    res.status(200).json({
      success: true,
      data: { showcase: formatShowcase(showcase) },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/showcases/:id/like — idempotent unlike.
const unlikeShowcase = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next(httpError('Showcase not found', 404));
    const showcase = await Showcase.findByIdAndUpdate(
      req.params.id,
      { $pull: { likedBy: req.user.userId } },
      { new: true }
    );
    if (!showcase) return next(httpError('Showcase not found', 404));
    await syncLikes(showcase);

    res.status(200).json({
      success: true,
      data: { showcase: formatShowcase(showcase) },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/showcases/:id/comments — public paginated comments, newest-first.
const listComments = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next(httpError('Showcase not found', 404));
    const showcase = await Showcase.findById(req.params.id);
    if (!showcase) return next(httpError('Showcase not found', 404));

    const { page, limit, skip } = parsePagination(req.query);
    const totalCount = showcase.comments.length;
    // Newest-first: comments are pushed in order, so reverse a shallow copy.
    const ordered = [...showcase.comments].reverse();
    const pageItems = ordered.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      data: {
        results: pageItems.map(formatComment),
        pagination: buildPagination({ totalCount, page, limit }),
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/showcases/:id/comments — add an embedded comment (authenticated).
const addComment = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next(httpError('Showcase not found', 404));
    const showcase = await Showcase.findById(req.params.id);
    if (!showcase) return next(httpError('Showcase not found', 404));

    // userId always from the token, never the body.
    showcase.comments.push({ userId: req.user.userId, text: req.body.text });
    await showcase.save();

    const created = showcase.comments[showcase.comments.length - 1];

    res.status(201).json({
      success: true,
      data: { comment: formatComment(created) },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  publishShowcase,
  listShowcases,
  getShowcaseById,
  likeShowcase,
  unlikeShowcase,
  listComments,
  addComment,
};
