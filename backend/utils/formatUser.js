// Shared helper — builds the safe user object sent in API responses.
// Password is never included. All controllers that return user data
// should use this function to ensure a consistent response shape.
const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  avatar: user.avatar,
  skills: user.skills,
  bio: user.bio,
  githubUrl: user.githubUrl,
  linkedinUrl: user.linkedinUrl,
  createdAt: user.createdAt,
});

module.exports = formatUser;
