const Report = require('../models/Report');
const formatReport = require('../utils/formatReport');

// POST /api/reports — file a report (any authenticated user).
const createReport = async (req, res, next) => {
  try {
    const { targetType, targetId, reason } = req.body;

    // reporterId always from the token; status defaults to PENDING.
    const report = await Report.create({
      reporterId: req.user.userId,
      targetType,
      targetId,
      reason,
    });

    res.status(201).json({
      success: true,
      data: { report: formatReport(report) },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReport };
