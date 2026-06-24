require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { predictFromMetrics, sampleRepos, summaryMetrics } = require('./predictor');
const { verifyToken } = require('./middleware/auth');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// Public routes
app.get('/api/repositories', (req, res) => {
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

// Protected routes example
app.get('/api/user/dashboard', verifyToken, (req, res) => {
  res.json({
    message: 'Welcome to your dashboard',
    user: req.user
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
