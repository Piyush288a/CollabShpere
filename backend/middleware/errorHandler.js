// Centralized error-handling middleware.
// Must be registered LAST in app.js so it catches errors from all routes.
// Any route or middleware that calls next(error) will land here.
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose ValidationError — map to 400 with the first validation message
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)[0].message;
  }

  // Log the error in development to help with debugging
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error] ${statusCode} - ${message}`);
  }

  // Always respond with the agreed error envelope
  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
