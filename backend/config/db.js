const dns = require('dns');
const mongoose = require('mongoose');

// Resolve Atlas SRV records reliably across all local ISP / Windows environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where setting DNS servers is restricted
}

// Connects to MongoDB using the URI from environment variables.
// Exits the process if the connection fails so the server never
// starts in a broken state.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
