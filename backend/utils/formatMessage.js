// Shared helper — builds the consistent message object sent in API responses
// and socket broadcasts. References are raw ObjectIds, consistent with prior phases.
const formatMessage = (msg) => ({
  _id: msg._id,
  projectId: msg.projectId,
  senderId: msg.senderId,
  message: msg.message,
  createdAt: msg.createdAt,
  updatedAt: msg.updatedAt,
});

module.exports = formatMessage;
