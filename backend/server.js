// Load environment variables from .env before anything else
require('dotenv').config();

const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start the HTTP server.
// If the database connection fails, connectDB calls process.exit(1)
// and the server never starts.
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
};

startServer();
