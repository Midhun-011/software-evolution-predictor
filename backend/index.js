require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');
const { predictFromMetrics, sampleRepos, summaryMetrics } = require('./predictor');
const { verifyToken } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const repoRoutes = require('./routes/repositories');
const teamRoutes = require('./routes/team');
const notifRoutes = require('./routes/notifications');
const activityRoutes = require('./routes/activity');
const reportRoutes = require('./routes/reports');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/repositories', repoRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/notifications', notifRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/reports', reportRoutes);

// Legacy public routes
app.get('/api/repos', (req, res) => {
  res.json(sampleRepos);
});

app.get('/api/analysis/summary', (req, res) => {
  res.json(summaryMetrics);
});

app.post('/api/predict', (req, res) => {
  try {
    const input = req.body;
    const result = predictFromMetrics(input);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: 'Invalid input' });
  }
});

app.get('/api/user/dashboard', verifyToken, (req, res) => {
  res.json({ message: 'Welcome to your dashboard', user: req.user });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

start();
