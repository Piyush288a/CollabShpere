// Shared helper — builds the consistent collaboration-request object sent in
// API responses. References are returned as raw ObjectIds (no population),
// consistent with the Phase 4 project/user response conventions.
const formatRequest = (reqDoc) => ({
  _id: reqDoc._id,
  projectId: reqDoc.projectId,
  senderId: reqDoc.senderId,
  message: reqDoc.message,
  status: reqDoc.status,
  createdAt: reqDoc.createdAt,
  updatedAt: reqDoc.updatedAt,
});

module.exports = formatRequest;
