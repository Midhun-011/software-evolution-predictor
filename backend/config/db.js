const mongoose = require('mongoose');

let connected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[DB] MONGODB_URI not set — running without database (file-based fallback)');
    return false;
  }
  try {
    await mongoose.connect(uri);
    connected = true;
    console.log('[DB] MongoDB connected');
    return true;
  } catch (err) {
    console.error('[DB] MongoDB connection failed:', err.message);
    return false;
  }
}

function isConnected() {
  return connected && mongoose.connection.readyState === 1;
}

module.exports = { connectDB, isConnected };
