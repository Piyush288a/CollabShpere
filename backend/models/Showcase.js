const mongoose = require('mongoose');

// Allows an empty string (optional URL) OR a well-formed http(s) URL.
const optionalUrlValidator = {
  validator: (value) => value === '' || /^https?:\/\/.+/.test(value),
  message: 'Please provide a valid URL',
};

// Embedded comment subdocument — stored inside the Showcase document.
// No separate Comments collection.
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment author is required'],
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      minlength: [1, 'Comment must not be empty'],
      maxlength: [1000, 'Comment must be at most 1000 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const showcaseSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
      unique: true, // one showcase per project
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
    technologies: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      default: '',
      trim: true,
      validate: optionalUrlValidator,
    },
    demoUrl: {
      type: String,
      default: '',
      trim: true,
      validate: optionalUrlValidator,
    },
    // Array of image URL strings. Cloudinary upload deferred (Phase 8/10);
    // accepts manually provided URL strings in the interim.
    images: {
      type: [String],
      default: [],
    },
    // likedBy is the source of truth; likesCount is kept in sync on each toggle.
    likesCount: {
      type: Number,
      default: 0,
      min: [0, 'likesCount cannot be negative'],
    },
    likedBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

showcaseSchema.index({ createdAt: -1 }); // feed ordering
// projectId already has a unique index from `unique: true` above.

module.exports = mongoose.model('Showcase', showcaseSchema);
