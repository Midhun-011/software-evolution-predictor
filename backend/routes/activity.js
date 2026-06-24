const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { isConnected } = require('../config/db');

const router = express.Router();

const mockLogs = [
  { _id: '1', action: 'Login', user: 'You', detail: 'Logged in from Chrome on Linux', type: 'auth', createdAt: new Date(Date.now() - 120000) },
  { _id: '2', action: 'Repository Analysis', user: 'You', detail: 'Ran analysis on facebook/react', type: 'repo', createdAt: new Date(Date.now() - 900000) },
  { _id: '3', action: 'Settings Changed', user: 'You', detail: 'Updated notification preferences', type: 'settings', createdAt: new Date(Date.now() - 3600000) },
  { _id: '4', action: 'Report Generated', user: 'You', detail: 'Generated Q4 Risk Assessment PDF', type: 'report', createdAt: new Date(Date.now() - 10800000) },
  { _id: '5', action: 'Repository Added', user: 'Alex Johnson', detail: 'Added vercel/next.js', type: 'repo', createdAt: new Date(Date.now() - 18000000) },
];

// List activity logs
router.get('/', verifyToken, async (req, res) => {
  if (!isConnected()) return res.json(mockLogs);
  try {
    const ActivityLog = require('../models/ActivityLog');
    const { type } = req.query;
    const filter = { user: req.user.id };
    if (type && type !== 'all') filter.type = type;
    const logs = await ActivityLog.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
