const mongoose = require('mongoose');

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
