const mongoose = require('mongoose');

// Allows an empty string (optional URL) OR a well-formed http(s) URL.
const optionalUrlValidator = {
  validator: (value) => value === '' || /^https?:\/\/.+/.test(value),
  message: 'Please provide a valid URL',
};

const projectSchema = new mongoose.Schema(
  {
    // Creator of the project. Set from req.user.userId in the controller.
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    // Team members. Initialized to [ownerId] by the controller on create.
    memberIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
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
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [5000, 'Description must be at most 5000 characters'],
    },
    // Free-form domain category (e.g. Web Development, Mobile, AI).
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    teamSize: {
      type: Number,
      required: [true, 'Team size is required'],
      min: [1, 'Team size must be at least 1'],
      max: [50, 'Team size must be at most 50'],
      validate: {
        validator: Number.isInteger,
        message: 'Team size must be an integer',
      },
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced'],
        message: 'Difficulty must be Beginner, Intermediate, or Advanced',
      },
    },
    // Optional URL fields.
    repositoryUrl: {
      type: String,
      default: '',
      trim: true,
      validate: optionalUrlValidator,
    },
    projectImage: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['OPEN', 'IN_PROGRESS', 'COMPLETED'],
        message: 'Status must be OPEN, IN_PROGRESS, or COMPLETED',
      },
      default: 'OPEN',
    },
    bookmarkedBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
