const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { isConnected } = require('../config/db');

const router = express.Router();

const mockNotifications = [
  { _id: '1', type: 'risk', title: 'High Risk Detected', desc: 'rust-lang/rust shows elevated complexity', read: false, createdAt: new Date(Date.now() - 7200000) },
  { _id: '2', type: 'security', title: 'Security Alert', desc: 'New login detected from Chrome on Linux', read: false, createdAt: new Date(Date.now() - 18000000) },
  { _id: '3', type: 'repo', title: 'Repository Updated', desc: 'facebook/react analysis completed', read: true, createdAt: new Date(Date.now() - 86400000) },
  { _id: '4', type: 'system', title: 'Weekly Report Ready', desc: 'Your weekly analytics report is available', read: true, createdAt: new Date(Date.now() - 172800000) },
];

// List notifications
router.get('/', verifyToken, async (req, res) => {
  if (!isConnected()) return res.json(mockNotifications);
  try {
    const Notification = require('../models/Notification');
    const { type, read } = req.query;
    const filter = { user: req.user.id };
    if (type) filter.type = type;
    if (read !== undefined) filter.read = read === 'true';
    const notifs = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark as read
router.patch('/:id/read', verifyToken, async (req, res) => {
  if (!isConnected()) return res.json({ message: 'Marked (no DB)' });
  try {
    const Notification = require('../models/Notification');
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ error: 'Notification not found' });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark all read
router.patch('/read-all', verifyToken, async (req, res) => {
  if (!isConnected()) return res.json({ message: 'All marked read (no DB)' });
  try {
    const Notification = require('../models/Notification');
    await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
