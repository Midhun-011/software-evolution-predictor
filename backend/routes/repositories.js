const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { isConnected } = require('../config/db');
const { predictFromMetrics, sampleRepos } = require('../predictor');
const { logActivity } = require('../utils/logActivity');

const router = express.Router();

// List repositories
router.get('/', verifyToken, async (req, res) => {
  if (!isConnected()) return res.json(sampleRepos);
  try {
    const Repository = require('../models/Repository');
    const { search, risk, favorite } = req.query;
    const filter = { owner: req.user.id };
    if (risk && risk !== 'all') filter.risk = risk;
    if (favorite === 'true') filter.favorite = true;
    if (search) filter.fullName = { $regex: search, $options: 'i' };
    const repos = await Repository.find(filter).sort({ updatedAt: -1 });
    res.json(repos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add repository
router.post('/', verifyToken, async (req, res) => {
  if (!isConnected()) return res.status(201).json({ message: 'Repository added (no DB)' });
  try {
    const Repository = require('../models/Repository');
    const { fullName, source, url, language, tags, category } = req.body;
    if (!fullName) return res.status(400).json({ error: 'Repository name is required' });

    const exists = await Repository.findOne({ owner: req.user.id, fullName });
    if (exists) return res.status(400).json({ error: 'Repository already tracked' });

    const metrics = {
      projectName: fullName,
      language: language || 'Unknown',
      linesOfCode: Math.floor(Math.random() * 300000),
      ageInMonths: Math.floor(Math.random() * 100),
      numberOfContributors: Math.floor(Math.random() * 50),
      openIssues: Math.floor(Math.random() * 200),
      testCoverage: Math.floor(Math.random() * 100),
      hasCI: true,
      commitFrequencyPerMonth: Math.floor(Math.random() * 100),
    };
    const prediction = predictFromMetrics(metrics);

    const repo = await Repository.create({
      owner: req.user.id,
      fullName,
      source: source || 'GitHub',
      url: url || '',
      language: language || '',
      linesOfCode: metrics.linesOfCode,
      health: prediction.healthScore,
      risk: prediction.riskLevel,
      tags: tags || [],
      category: category || '',
      lastAnalyzed: new Date(),
    });

    await logActivity(req.user.id, 'Repository Added', `Added ${fullName}`, 'repo', req.ip);
    res.status(201).json(repo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update repository
router.put('/:id', verifyToken, async (req, res) => {
  if (!isConnected()) return res.json({ message: 'Updated (no DB)' });
  try {
    const Repository = require('../models/Repository');
    const repo = await Repository.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!repo) return res.status(404).json({ error: 'Repository not found' });
    await logActivity(req.user.id, 'Repository Updated', `Updated ${repo.fullName}`, 'repo', req.ip);
    res.json(repo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle favorite
router.patch('/:id/favorite', verifyToken, async (req, res) => {
  if (!isConnected()) return res.json({ message: 'Toggled (no DB)' });
  try {
    const Repository = require('../models/Repository');
    const repo = await Repository.findOne({ _id: req.params.id, owner: req.user.id });
    if (!repo) return res.status(404).json({ error: 'Repository not found' });
    repo.favorite = !repo.favorite;
    await repo.save();
    res.json(repo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete repository
router.delete('/:id', verifyToken, async (req, res) => {
  if (!isConnected()) return res.json({ message: 'Deleted (no DB)' });
  try {
    const Repository = require('../models/Repository');
    const repo = await Repository.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!repo) return res.status(404).json({ error: 'Repository not found' });
    await logActivity(req.user.id, 'Repository Deleted', `Deleted ${repo.fullName}`, 'repo', req.ip);
    res.json({ message: 'Repository deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analyze / re-analyze a repository
router.post('/:id/analyze', verifyToken, async (req, res) => {
  if (!isConnected()) return res.json(predictFromMetrics(req.body));
  try {
    const Repository = require('../models/Repository');
    const repo = await Repository.findOne({ _id: req.params.id, owner: req.user.id });
    if (!repo) return res.status(404).json({ error: 'Repository not found' });

    const metrics = {
      projectName: repo.fullName,
      language: repo.language,
      linesOfCode: repo.linesOfCode || Math.floor(Math.random() * 300000),
      ageInMonths: Math.floor((Date.now() - new Date(repo.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)),
      numberOfContributors: Math.floor(Math.random() * 50),
      openIssues: Math.floor(Math.random() * 200),
      testCoverage: Math.floor(Math.random() * 100),
      hasCI: true,
      commitFrequencyPerMonth: Math.floor(Math.random() * 100),
    };
    const prediction = predictFromMetrics(metrics);
    repo.health = prediction.healthScore;
    repo.risk = prediction.riskLevel;
    repo.lastAnalyzed = new Date();
    await repo.save();

    await logActivity(req.user.id, 'Repository Analysis', `Analyzed ${repo.fullName}`, 'repo', req.ip);
    res.json({ ...prediction, repository: repo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
