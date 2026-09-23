const mongoose = require('mongoose');
const Task = require('../models/Task');
const Project = require('../models/Project');
const formatTask = require('../utils/formatTask');
const { parsePagination, buildPagination } = require('../utils/paginate');
const { isTeamMember } = require('../utils/teamAccess');

const STATUSES = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

// Forward-only status transition map (mirrors the project-status convention).
const ALLOWED_TRANSITIONS = {
  TODO: ['IN_PROGRESS'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
};

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// Editable fields on a task update.
const EDITABLE_FIELDS = ['title', 'description', 'assignedTo', 'dueDate'];

// POST /api/projects/:id/tasks — create a task (team members only).
const createTask = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    if (!mongoose.isValidObjectId(projectId)) return next(httpError('Project not found', 404));

    const project = await Project.findById(projectId);
    if (!project) return next(httpError('Project not found', 404));

    if (!isTeamMember(project, req.user.userId)) {
      return next(httpError('Access denied — project team members only', 403));
    }

    const { title, description, assignedTo, dueDate } = req.body;

    // If an assignee is provided, it must be a current team member.
    if (assignedTo !== undefined && assignedTo !== null) {
      if (!isTeamMember(project, String(assignedTo))) {
        return next(httpError('Assignee must be a current team member', 400));
      }
    }

    const task = await Task.create({
      projectId,
      title,
      description,
      assignedTo: assignedTo ?? null,
      dueDate: dueDate ?? null,
    });

    res.status(201).json({
      success: true,
      data: { task: formatTask(task) },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:id/tasks — list tasks (team members only, paginated).
const listTasks = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    if (!mongoose.isValidObjectId(projectId)) return next(httpError('Project not found', 404));

    const project = await Project.findById(projectId);
    if (!project) return next(httpError('Project not found', 404));

    if (!isTeamMember(project, req.user.userId)) {
      return next(httpError('Access denied — project team members only', 403));
    }

    const filter = { projectId };
    if (req.query.status !== undefined) {
      if (!STATUSES.includes(req.query.status)) {
        return next(httpError('Invalid status filter', 400));
      }
      filter.status = req.query.status;
    }

    const { page, limit, skip } = parsePagination(req.query);
    const [totalCount, tasks] = await Promise.all([
      Task.countDocuments(filter),
      Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: {
        results: tasks.map(formatTask),
        pagination: buildPagination({ totalCount, page, limit }),
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/tasks/:id — update task details/assignee/status (team members only).
const updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.isValidObjectId(taskId)) return next(httpError('Task not found', 404));

    const task = await Task.findById(taskId);
    if (!task) return next(httpError('Task not found', 404));

    const project = await Project.findById(task.projectId);
    if (!project) return next(httpError('Project not found', 404));

    if (!isTeamMember(project, req.user.userId)) {
      return next(httpError('Access denied — project team members only', 403));
    }

    // Assignee (if provided and not null) must be a current team member.
    if (req.body.assignedTo !== undefined && req.body.assignedTo !== null) {
      if (!isTeamMember(project, String(req.body.assignedTo))) {
        return next(httpError('Assignee must be a current team member', 400));
      }
    }

    // Status change: forward-only transitions.
    if (req.body.status !== undefined) {
      if (!STATUSES.includes(req.body.status)) {
        return next(httpError('Invalid status value', 400));
      }
      if (
        req.body.status !== task.status &&
        !ALLOWED_TRANSITIONS[task.status].includes(req.body.status)
      ) {
        return next(httpError(`Invalid status transition from ${task.status} to ${req.body.status}`, 400));
      }
      task.status = req.body.status;
    }

    for (const field of EDITABLE_FIELDS) {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    }

    await task.save();

    res.status(200).json({
      success: true,
      data: { task: formatTask(task) },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id — delete a task (team members only).
const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.isValidObjectId(taskId)) return next(httpError('Task not found', 404));

    const task = await Task.findById(taskId);
    if (!task) return next(httpError('Task not found', 404));

    const project = await Project.findById(task.projectId);
    if (!project) return next(httpError('Project not found', 404));

    if (!isTeamMember(project, req.user.userId)) {
      return next(httpError('Access denied — project team members only', 403));
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({
      success: true,
      data: { message: 'Task deleted', id: taskId },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, listTasks, updateTask, deleteTask };
