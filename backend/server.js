// Load environment variables from .env before anything else
require('dotenv').config();

const http = require('http');
const mongoose = require('mongoose');
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

// Graceful shutdown handling for cloud orchestrators (Render, Docker, Kubernetes)
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await mongoose.connection.close(false);
      console.log('MongoDB connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds if hanging
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
