const express = require('express');
const bcrypt = require('bcryptjs');
const { verifyToken } = require('../middleware/auth');
const { isConnected } = require('../config/db');
const { logActivity } = require('../utils/logActivity');

const router = express.Router();

// Get profile
router.get('/', verifyToken, async (req, res) => {
  if (!isConnected()) return res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.toPublic());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update profile
router.put('/', verifyToken, async (req, res) => {
  if (!isConnected()) return res.json({ message: 'Profile updated (no DB)' });
  try {
    const User = require('../models/User');
    const { name, phone, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, phone, bio } },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    await logActivity(req.user.id, 'Profile Updated', 'Updated profile information', 'settings', req.ip);
    res.json(user.toPublic());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change password
router.put('/password', verifyToken, async (req, res) => {
  if (!isConnected()) return res.json({ message: 'Password changed (no DB)' });
  try {
    const User = require('../models/User');
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both passwords required' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await user.comparePassword(currentPassword);
    if (!match) return res.status(401).json({ error: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    await logActivity(req.user.id, 'Password Changed', 'Password updated successfully', 'security', req.ip);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
