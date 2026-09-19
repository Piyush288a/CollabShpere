const mongoose = require('mongoose');

const collaborationRequestSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message must be at most 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'ACCEPTED', 'REJECTED'],
        message: 'Status must be PENDING, ACCEPTED, or REJECTED',
      },
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

// Helps duplicate-request lookups by project + sender.
collaborationRequestSchema.index({ projectId: 1, senderId: 1 });

module.exports = mongoose.model('CollaborationRequest', collaborationRequestSchema);
