// Load environment variables from .env before anything else
require('dotenv').config();

const http = require('http');
const connectDB = require('./config/db');
const app = require('./app');
const { initSocket } = require('./socket');

const PORT = process.env.PORT || 5000;

// Wrap the Express app in an HTTP server so Socket.IO can share the same port.
const server = http.createServer(app);
initSocket(server);

// Connect to MongoDB first, then start the HTTP server.
// If the database connection fails, connectDB calls process.exit(1)
// and the server never starts.
const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
};

startServer();
