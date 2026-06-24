import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { stagger, fadeUp } from '../lib/motion';
import { IconCheck } from '../components/icons';
import '../styles/dashboard.css';

const fallbackRepos = [
  { fullName: 'facebook/react' },
  { fullName: 'microsoft/typescript' },
  { fullName: 'vercel/next.js' },
  { fullName: 'expressjs/express' },
  { fullName: 'rust-lang/rust' },
];

const badgeFor = (lvl) => {
  if (lvl === 'High') return 'red';
  if (lvl === 'Medium') return 'orange';
  return 'green';
};

export default function RepositoryAnalysis() {
  const [repos, setRepos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    fetch('/api/repositories')
      .then((r) => r.json())
      .then(setRepos)
      .catch(() => setRepos(fallbackRepos));
  }, []);

  function analyze(repo) {
    const mock = {
      projectName: repo.fullName,
      language: repo.fullName.includes('rust') ? 'Rust' : 'JS',
      linesOfCode: Math.floor(Math.random() * 500000),
      ageInMonths: Math.floor(Math.random() * 200),
      numberOfContributors: Math.floor(Math.random() * 200),
      openIssues: Math.floor(Math.random() * 1000),
      testCoverage: Math.floor(Math.random() * 100),
      hasCI: Math.random() > 0.2,
      commitFrequencyPerMonth: Math.floor(Math.random() * 200),
    };
    fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mock),
    })
      .then((r) => r.json())
      .then(setPrediction)
      .catch(() => {});
    setSelected(repo.fullName);
  }

  return (
    <motion.div className="page" initial="hidden" animate="show" variants={stagger}>
      <motion.h1 className="page-heading" variants={fadeUp}>Repository Analysis</motion.h1>
      <motion.p className="page-sub" variants={fadeUp}>
        Select a repository to run an evolution health analysis.
      </motion.p>

      <motion.div className="analysis-grid" variants={stagger}>
        <motion.div className="repo-picker glass" variants={fadeUp}>
          <h4 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-dim)' }}>Repositories</h4>
          <div className="repo-picker-list">
            {repos.map((r) => (
              <button
                key={r.fullName}
                className={`repo-pick-btn${selected === r.fullName ? ' active' : ''}`}
                onClick={() => analyze(r)}
                type="button"
              >
                {r.fullName}
              </button>
            ))}
          </div>
        </motion.div>

        {prediction ? (
          <motion.div className="metric-card glass" variants={fadeUp}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{prediction.projectName}</h3>
              <span className={`badge ${badgeFor(prediction.riskLevel)}`}>{prediction.riskLevel} Risk</span>
            </div>
            <div className="metric-score">
              <span className="big">{prediction.healthScore}</span>
              <span className="max">/ 100</span>
            </div>
            {prediction.recommendations.length > 0 && (
              <ul className="rec-list">
                {prediction.recommendations.map((rec) => (
                  <li key={rec}><IconCheck size={16} style={{ color: 'var(--accent-2)', marginTop: 2 }} /> {rec}</li>
                ))}
              </ul>
            )}
          </motion.div>
        ) : (
          <motion.div className="empty-state glass" variants={fadeUp}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><path d="M4 4h11a3 3 0 0 1 3 3v13"/><path d="M7 20h11"/><path d="M7 4v16"/><path d="M18 17H8a1 1 0 0 0-1 1"/></svg>
            <span>Select a repository to run analysis.</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
