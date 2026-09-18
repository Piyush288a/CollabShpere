// Shared helper — builds the consistent project object sent in API responses.
// References (ownerId, memberIds, bookmarkedBy) are returned as raw ObjectIds
// in Phase 4 (no population). All project-returning controllers should use
// this function to ensure a consistent response shape.
const formatProject = (project) => ({
  _id: project._id,
  ownerId: project.ownerId,
  memberIds: project.memberIds,
  title: project.title,
  description: project.description,
  category: project.category,
  requiredSkills: project.requiredSkills,
  teamSize: project.teamSize,
  deadline: project.deadline,
  difficulty: project.difficulty,
  repositoryUrl: project.repositoryUrl,
  projectImage: project.projectImage,
  status: project.status,
  bookmarkedBy: project.bookmarkedBy,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

module.exports = formatProject;
