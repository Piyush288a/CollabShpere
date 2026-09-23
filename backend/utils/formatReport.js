// Shared helper — builds the consistent report object sent in API responses.
// References are raw ObjectIds, consistent with prior phases.
const formatReport = (report) => ({
  _id: report._id,
  reporterId: report.reporterId,
  targetType: report.targetType,
  targetId: report.targetId,
  reason: report.reason,
  status: report.status,
  createdAt: report.createdAt,
  updatedAt: report.updatedAt,
});

module.exports = formatReport;
