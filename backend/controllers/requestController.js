const mongoose = require('mongoose');
const CollaborationRequest = require('../models/CollaborationRequest');
const Project = require('../models/Project');
const User = require('../models/User');
const formatRequest = require('../utils/formatRequest');
const formatUser = require('../utils/formatUser');
const { parsePagination, buildPagination } = require('../utils/paginate');

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// POST /api/projects/:id/requests — send a request to join an OPEN project.
const createRequest = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    if (!mongoose.isValidObjectId(projectId)) return next(httpError('Project not found', 404));

    const project = await Project.findById(projectId);
    if (!project) return next(httpError('Project not found', 404));

    // Only open projects accept requests.
    if (project.status !== 'OPEN') {
      return next(httpError('Project is not open for collaboration requests', 400));
    }

    const senderId = req.user.userId;

    // No self-requests.
    if (String(project.ownerId) === senderId) {
      return next(httpError('You cannot request to join your own project', 400));
    }

    // Already a member.
    if (project.memberIds.some((m) => String(m) === senderId)) {
      return next(httpError('You are already a member of this project', 400));
    }

    // No duplicate active (PENDING) request.
    const existing = await CollaborationRequest.findOne({
      projectId,
      senderId,
      status: 'PENDING',
    });
    if (existing) {
      return next(httpError('You already have a pending request for this project', 409));
    }

    const request = await CollaborationRequest.create({
      projectId,
      senderId,
      message: req.body.message,
    });

    res.status(201).json({
      success: true,
      data: { request: formatRequest(request) },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:id/requests — owner lists incoming requests (paginated).
const listProjectRequests = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    if (!mongoose.isValidObjectId(projectId)) return next(httpError('Project not found', 404));

    const project = await Project.findById(projectId);
    if (!project) return next(httpError('Project not found', 404));

    if (String(project.ownerId) !== req.user.userId) {
      return next(httpError('Access denied — project owner only', 403));
    }

    const filter = { projectId };
    if (req.query.status !== undefined) {
      if (!['PENDING', 'ACCEPTED', 'REJECTED'].includes(req.query.status)) {
        return next(httpError('Invalid status filter', 400));
      }
      filter.status = req.query.status;
    }

    const { page, limit, skip } = parsePagination(req.query);
    const [totalCount, requests] = await Promise.all([
      CollaborationRequest.countDocuments(filter),
      CollaborationRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: {
        results: requests.map(formatRequest),
        pagination: buildPagination({ totalCount, page, limit }),
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/requests/:id — owner accepts or rejects a pending request.
const decideRequest = async (req, res, next) => {
  try {
    const requestId = req.params.id;
    if (!mongoose.isValidObjectId(requestId)) return next(httpError('Request not found', 404));

    const { status } = req.body;
    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return next(httpError('Status must be ACCEPTED or REJECTED', 400));
    }

    const request = await CollaborationRequest.findById(requestId);
    if (!request) return next(httpError('Request not found', 404));

    const project = await Project.findById(request.projectId);
    if (!project) return next(httpError('Project not found', 404));

    // Only the project owner can decide.
    if (String(project.ownerId) !== req.user.userId) {
      return next(httpError('Access denied — project owner only', 403));
    }

    // Only pending requests can be decided.
    if (request.status !== 'PENDING') {
      return next(httpError(`Request has already been ${request.status.toLowerCase()}`, 400));
    }

    if (status === 'ACCEPTED') {
      // Capacity check: owner + members must not exceed teamSize.
      if (project.memberIds.length >= project.teamSize) {
        return next(httpError('Project team is already at full capacity', 400));
      }

      // Sync membership (idempotent) and persist the decision.
      await Project.findByIdAndUpdate(project._id, {
        $addToSet: { memberIds: request.senderId },
      });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      data: { request: formatRequest(request) },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:id/team — team members (owner + memberIds). Private.
const getProjectTeam = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    if (!mongoose.isValidObjectId(projectId)) return next(httpError('Project not found', 404));

    const project = await Project.findById(projectId);
    if (!project) return next(httpError('Project not found', 404));

    // memberIds already includes the owner (owner is added on project create).
    const members = await User.find({ _id: { $in: project.memberIds } });

    res.status(200).json({
      success: true,
      data: {
        projectId: project._id,
        ownerId: project.ownerId,
        members: members.map(formatUser),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  listProjectRequests,
  decideRequest,
  getProjectTeam,
};
