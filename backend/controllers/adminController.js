const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Message = require('../models/Message');
const CollaborationRequest = require('../models/CollaborationRequest');
const Showcase = require('../models/Showcase');
const Report = require('../models/Report');
const formatUser = require('../utils/formatUser');
const formatProject = require('../utils/formatProject');
const formatReport = require('../utils/formatReport');
const { parsePagination, buildPagination } = require('../utils/paginate');

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// GET /api/admin/users — paginated user list.
const listUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [totalCount, users] = await Promise.all([
      User.countDocuments({}),
      User.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);
    res.status(200).json({
      success: true,
      data: { results: users.map(formatUser), pagination: buildPagination({ totalCount, page, limit }) },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/status — suspend or restore a user.
const setUserStatus = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next(httpError('User not found', 404));

    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return next(httpError('Status must be active or suspended', 400));
    }

    // Admins cannot suspend their own account.
    if (req.params.id === req.user.userId && status === 'suspended') {
      return next(httpError('Admins cannot suspend their own account', 400));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!user) return next(httpError('User not found', 404));

    res.status(200).json({ success: true, data: { user: formatUser(user) } });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/projects — paginated project list.
const listProjects = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [totalCount, projects] = await Promise.all([
      Project.countDocuments({}),
      Project.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);
    res.status(200).json({
      success: true,
      data: { results: projects.map(formatProject), pagination: buildPagination({ totalCount, page, limit }) },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/projects/:id — remove a project and cascade its dependents.
// Order: dependents first (Tasks, Messages, CollaborationRequests, Showcase), then the Project.
const deleteProject = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next(httpError('Project not found', 404));

    const project = await Project.findById(req.params.id);
    if (!project) return next(httpError('Project not found', 404));

    const projectId = project._id;
    await Task.deleteMany({ projectId });
    await Message.deleteMany({ projectId });
    await CollaborationRequest.deleteMany({ projectId });
    await Showcase.deleteOne({ projectId });
    await Project.findByIdAndDelete(projectId);

    res.status(200).json({
      success: true,
      data: { message: 'Project and related data deleted', id: String(projectId) },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/reports — paginated report list, newest-first.
const listReports = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [totalCount, reports] = await Promise.all([
      Report.countDocuments({}),
      Report.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);
    res.status(200).json({
      success: true,
      data: { results: reports.map(formatReport), pagination: buildPagination({ totalCount, page, limit }) },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/reports/:id — resolve or dismiss a report.
const decideReport = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return next(httpError('Report not found', 404));

    const { status } = req.body;
    if (!['RESOLVED', 'DISMISSED'].includes(status)) {
      return next(httpError('Status must be RESOLVED or DISMISSED', 400));
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!report) return next(httpError('Report not found', 404));

    res.status(200).json({ success: true, data: { report: formatReport(report) } });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/statistics — platform statistics.
const getStatistics = async (req, res, next) => {
  try {
    const [
      usersTotal, studentCount, adminCount, activeCount, suspendedCount,
      projectsTotal, openCount, inProgressCount, completedCount,
      showcasesTotal,
      reportsTotal, pendingCount, resolvedCount, dismissedCount,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ status: 'suspended' }),
      Project.countDocuments({}),
      Project.countDocuments({ status: 'OPEN' }),
      Project.countDocuments({ status: 'IN_PROGRESS' }),
      Project.countDocuments({ status: 'COMPLETED' }),
      Showcase.countDocuments({}),
      Report.countDocuments({}),
      Report.countDocuments({ status: 'PENDING' }),
      Report.countDocuments({ status: 'RESOLVED' }),
      Report.countDocuments({ status: 'DISMISSED' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        statistics: {
          users: {
            total: usersTotal,
            byRole: { student: studentCount, admin: adminCount },
            byStatus: { active: activeCount, suspended: suspendedCount },
          },
          projects: {
            total: projectsTotal,
            byStatus: { OPEN: openCount, IN_PROGRESS: inProgressCount, COMPLETED: completedCount },
          },
          showcases: { total: showcasesTotal },
          reports: {
            total: reportsTotal,
            byStatus: { PENDING: pendingCount, RESOLVED: resolvedCount, DISMISSED: dismissedCount },
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listUsers,
  setUserStatus,
  listProjects,
  deleteProject,
  listReports,
  decideReport,
  getStatistics,
};
