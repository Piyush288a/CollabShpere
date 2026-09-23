// Shared helpers — build the consistent showcase / comment objects sent in API
// responses. References are raw ObjectIds (no population), so no user/project
// profile fields (emails, passwords, etc.) are ever exposed.

const formatComment = (c) => ({
  _id: c._id,
  userId: c.userId,
  text: c.text,
  createdAt: c.createdAt,
});

const formatShowcase = (showcase) => ({
  _id: showcase._id,
  projectId: showcase.projectId,
  title: showcase.title,
  description: showcase.description,
  technologies: showcase.technologies,
  githubUrl: showcase.githubUrl,
  demoUrl: showcase.demoUrl,
  images: showcase.images,
  likesCount: showcase.likesCount,
  likedBy: showcase.likedBy,
  comments: (showcase.comments || []).map(formatComment),
  createdAt: showcase.createdAt,
  updatedAt: showcase.updatedAt,
});

module.exports = { formatShowcase, formatComment };
