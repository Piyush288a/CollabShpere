const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title must be at most 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'Description must be at most 5000 characters'],
      default: '',
    },
    // Optional assignee. When set, must be a current team member (enforced in controller).
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['TODO', 'IN_PROGRESS', 'COMPLETED'],
        message: 'Status must be TODO, IN_PROGRESS, or COMPLETED',
      },
      default: 'TODO',
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ projectId: 1 });

module.exports = mongoose.model('Task', taskSchema);
