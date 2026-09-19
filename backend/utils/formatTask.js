// Shared helper — builds the consistent task object sent in API responses.
// References are returned as raw ObjectIds (no population), consistent with the
// project/request response conventions.
const formatTask = (task) => ({
  _id: task._id,
  projectId: task.projectId,
  title: task.title,
  description: task.description,
  assignedTo: task.assignedTo,
  status: task.status,
  dueDate: task.dueDate,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

module.exports = formatTask;
