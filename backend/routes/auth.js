const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { isConnected } = require('../config/db');
const { findUserByEmail, addUser } = require('../utils/userStorage');
const { logActivity } = require('../utils/logActivity');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

function makeToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (isConnected()) {
      const User = require('../models/User');
      const exists = await User.findOne({ email: email.toLowerCase() });
      if (exists) return res.status(400).json({ error: 'Email already in use' });

      const user = await User.create({ name, email, password });
      user.lastLogin = new Date();
      await user.save();

      const pub = user.toPublic();
      const token = makeToken({ id: pub.id, email: pub.email, name: pub.name });
      await logActivity(pub.id, 'Register', 'Account created', 'auth', req.ip);

      return res.status(201).json({ message: 'User registered successfully', token, user: pub });
    }

    // File-based fallback
    const existing = findUserByEmail(email);
    if (existing) return res.status(400).json({ error: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    const newUser = { id: uuidv4(), name, email, password: hashed, createdAt: new Date().toISOString() };
    addUser(newUser);
    const token = makeToken({ id: newUser.id, email: newUser.email, name: newUser.name });
    res.status(201).json({ message: 'User registered successfully', token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (isConnected()) {
      const User = require('../models/User');
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(401).json({ error: 'Invalid email or password' });

      const match = await user.comparePassword(password);
      if (!match) return res.status(401).json({ error: 'Invalid email or password' });

      user.lastLogin = new Date();
      await user.save();

      const pub = user.toPublic();
      const token = makeToken({ id: pub.id, email: pub.email, name: pub.name });
      await logActivity(pub.id, 'Login', `Logged in from ${req.ip}`, 'auth', req.ip);

      return res.json({ message: 'Login successful', token, user: pub });
    }

    // File-based fallback
    const user = findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });
    const token = makeToken({ id: user.id, email: user.email, name: user.name });
    res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify token
router.get('/verify', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
});

module.exports = router;
