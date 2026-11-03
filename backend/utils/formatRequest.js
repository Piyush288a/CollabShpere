// Shared helper — builds the consistent collaboration-request object sent in
// API responses. Preserves raw ObjectIds on senderId while exposing
// populated sender profile metadata when available.
const formatRequest = (reqDoc) => {
  const isPopulated = reqDoc.senderId && typeof reqDoc.senderId === 'object' && reqDoc.senderId.name;
  return {
    _id: reqDoc._id,
    projectId: reqDoc.projectId,
    senderId: isPopulated ? reqDoc.senderId._id : reqDoc.senderId,
    sender: isPopulated
      ? {
          _id: reqDoc.senderId._id,
          name: reqDoc.senderId.name,
          email: reqDoc.senderId.email,
          avatar: reqDoc.senderId.avatar,
          skills: reqDoc.senderId.skills || [],
          bio: reqDoc.senderId.bio || '',
          githubUrl: reqDoc.senderId.githubUrl || '',
          linkedinUrl: reqDoc.senderId.linkedinUrl || '',
          role: reqDoc.senderId.role,
        }
      : undefined,
    message: reqDoc.message,
    status: reqDoc.status,
    createdAt: reqDoc.createdAt,
    updatedAt: reqDoc.updatedAt,
  };
};

module.exports = formatRequest;
