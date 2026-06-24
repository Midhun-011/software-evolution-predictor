import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DoughnutCard from '../components/charts/DoughnutCard';
import { stagger, fadeUp } from '../lib/motion';
import '../styles/dashboard.css';

export default function Overview() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch('/api/analysis/summary')
      .then((r) => r.json())
      .then(setSummary)
      .catch(() => {});
  }, []);

  const health = summary ? summary.averageHealthScore : 72;
  const total = summary ? summary.totalRepositories : 5;
  const risk = summary?.riskDistribution || { Low: 2, Medium: 2, High: 1 };

  return (
    <motion.div className="page" initial="hidden" animate="show" variants={stagger}>
      <motion.h1 className="page-heading" variants={fadeUp}>Overview</motion.h1>
      <motion.p className="page-sub" variants={fadeUp}>
        Aggregate metrics across all tracked repositories.
      </motion.p>

      <motion.div className="overview-grid" variants={stagger}>
        <motion.div className="stat-card glass" variants={fadeUp}>
          <span className="stat-label">Average Health Score</span>
          <span className="stat-value">{health}</span>
          <span className="trend up">&#8593; Good</span>
        </motion.div>

        <motion.div className="stat-card glass" variants={fadeUp}>
          <span className="stat-label">Total Repositories</span>
          <span className="stat-value">{total}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Sample repositories analyzed</span>
        </motion.div>

        <motion.div className="chart-card glass" variants={fadeUp}>
          <h3>Risk Distribution</h3>
          <p className="chart-sub">Across all repositories</p>
          <DoughnutCard
            labels={['Low', 'Medium', 'High']}
            values={[risk.Low, risk.Medium, risk.High]}
            colors={['#34d399', '#f59e0b', '#f87171']}
            centerNum={total}
            centerCap="Repos"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
