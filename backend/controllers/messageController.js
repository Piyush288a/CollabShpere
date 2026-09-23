const mongoose = require('mongoose');
const Message = require('../models/Message');
const Project = require('../models/Project');
const formatMessage = require('../utils/formatMessage');
const { parsePagination, buildPagination } = require('../utils/paginate');
const { isTeamMember } = require('../utils/teamAccess');
const { getIo, roomName } = require('../socket');

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// Loads the project and enforces team-member access. Returns the project or calls next().
const loadTeamProject = async (projectId, userId, next) => {
  if (!mongoose.isValidObjectId(projectId)) {
    next(httpError('Project not found', 404));
    return null;
  }
  const project = await Project.findById(projectId);
  if (!project) {
    next(httpError('Project not found', 404));
    return null;
  }
  if (!isTeamMember(project, userId)) {
    next(httpError('Access denied — project team members only', 403));
    return null;
  }
  return project;
};

// POST /api/projects/:id/messages — send a message (team members only).
// The REST handler is the single write path; the socket layer never persists.
const sendMessage = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await loadTeamProject(projectId, req.user.userId, next);
    if (!project) return;

    // senderId always comes from the token, never the request body.
    const message = await Message.create({
      projectId,
      senderId: req.user.userId,
      message: req.body.message,
    });

    const payload = formatMessage(message);

    // Broadcast to the project room (no-op if sockets are not initialized, e.g. REST tests).
    const io = getIo();
    if (io) io.to(roomName(projectId)).emit('message:new', payload);

    res.status(201).json({
      success: true,
      data: { message: payload },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:id/messages — paginated history, newest-first (team members only).
const listMessages = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await loadTeamProject(projectId, req.user.userId, next);
    if (!project) return;

    const { page, limit, skip } = parsePagination(req.query);
    const [totalCount, messages] = await Promise.all([
      Message.countDocuments({ projectId }),
      Message.find({ projectId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: {
        results: messages.map(formatMessage),
        pagination: buildPagination({ totalCount, page, limit }),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, listMessages };
