const express = require('express');
const cors = require('cors');
const { predictFromMetrics, sampleRepos, summaryMetrics } = require('./predictor');

const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
