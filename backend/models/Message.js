const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
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
      required: [true, 'Message is required'],
      trim: true,
      minlength: [1, 'Message must not be empty'],
      maxlength: [2000, 'Message must be at most 2000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Supports team-scoped, newest-first paginated history.
messageSchema.index({ projectId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
