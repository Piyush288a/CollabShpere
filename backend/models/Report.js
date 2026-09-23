const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter is required'],
    },
    targetType: {
      type: String,
      required: [true, 'Target type is required'],
      enum: {
        values: ['USER', 'PROJECT', 'SHOWCASE', 'COMMENT'],
        message: 'Target type must be USER, PROJECT, SHOWCASE, or COMMENT',
      },
    },
    // Any valid ObjectId; target existence is not verified (moderators judge manually).
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Target id is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      minlength: [3, 'Reason must be at least 3 characters'],
      maxlength: [1000, 'Reason must be at most 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'RESOLVED', 'DISMISSED'],
        message: 'Status must be PENDING, RESOLVED, or DISMISSED',
      },
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
