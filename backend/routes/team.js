const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { isConnected } = require('../config/db');
const { logActivity } = require('../utils/logActivity');

const router = express.Router();

const mockTeam = {
  name: 'Default Team',
  members: [
    { email: 'alex@example.com', name: 'Alex Johnson', role: 'admin', status: 'active', joinedAt: '2025-01-15' },
    { email: 'sarah@example.com', name: 'Sarah Chen', role: 'manager', status: 'active', joinedAt: '2025-02-20' },
    { email: 'mike@example.com', name: 'Mike Rodriguez', role: 'developer', status: 'active', joinedAt: '2025-03-10' },
  ],
};

// Get team
router.get('/', verifyToken, async (req, res) => {
  if (!isConnected()) return res.json(mockTeam);
  try {
    const Team = require('../models/Team');
    let team = await Team.findOne({ owner: req.user.id }).populate('members.user', 'name email');
    if (!team) {
      team = await Team.create({ name: 'My Team', owner: req.user.id, members: [{ email: req.user.email, role: 'admin', status: 'active', joinedAt: new Date() }] });
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Invite member
router.post('/invite', verifyToken, async (req, res) => {
  if (!isConnected()) return res.status(201).json({ message: 'Invited (no DB)' });
  try {
    const Team = require('../models/Team');
    const { email, role } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const team = await Team.findOne({ owner: req.user.id });
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const exists = team.members.find((m) => m.email === email);
    if (exists) return res.status(400).json({ error: 'Member already in team' });

    team.members.push({ email, role: role || 'developer', status: 'invited' });
    await team.save();

    await logActivity(req.user.id, 'Team Invite', `Invited ${email} as ${role || 'developer'}`, 'team', req.ip);
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update member role
router.put('/members/:email', verifyToken, async (req, res) => {
  if (!isConnected()) return res.json({ message: 'Updated (no DB)' });
  try {
    const Team = require('../models/Team');
    const { role } = req.body;
    const team = await Team.findOne({ owner: req.user.id });
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const member = team.members.find((m) => m.email === req.params.email);
    if (!member) return res.status(404).json({ error: 'Member not found' });

    member.role = role || member.role;
    await team.save();
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove member
router.delete('/members/:email', verifyToken, async (req, res) => {
  if (!isConnected()) return res.json({ message: 'Removed (no DB)' });
  try {
    const Team = require('../models/Team');
    const team = await Team.findOne({ owner: req.user.id });
    if (!team) return res.status(404).json({ error: 'Team not found' });

    team.members = team.members.filter((m) => m.email !== req.params.email);
    await team.save();
    await logActivity(req.user.id, 'Member Removed', `Removed ${req.params.email}`, 'team', req.ip);
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
