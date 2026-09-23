// Shared authorization helper — true if the given userId is the project owner
// or a listed member. Used by task, message, and socket layers.
// (Extracted verbatim from the Phase 6 task controller; behavior unchanged.)
const isTeamMember = (project, userId) =>
  String(project.ownerId) === userId ||
  project.memberIds.some((m) => String(m) === userId);

module.exports = { isTeamMember };
