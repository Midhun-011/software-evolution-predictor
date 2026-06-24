const { isConnected } = require('../config/db');

async function logActivity(userId, action, detail, type, ip) {
  if (!isConnected()) return;
  try {
    const ActivityLog = require('../models/ActivityLog');
    await ActivityLog.create({ user: userId, action, detail, type, ip: ip || '' });
  } catch (err) {
    console.error('[Activity] log failed:', err.message);
  }
}

module.exports = { logActivity };
