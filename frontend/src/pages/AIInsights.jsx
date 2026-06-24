import React from 'react';
import { motion } from 'framer-motion';
import DoughnutCard from '../components/charts/DoughnutCard';
import EvolutionTrendChart from '../components/charts/EvolutionTrendChart';
import { stagger, fadeUp } from '../lib/motion';
import { IconSpark, IconTarget, IconBulb, IconShield, IconAlert, IconTrendUp } from '../components/icons';
import '../styles/dashboard.css';

const insights = [
  { icon: <IconTarget size={20} />, title: 'Health Prediction', text: 'Overall repository health is trending upward by 8.2% this quarter. Two repositories show consistent improvement.', color: '#34d399' },
  { icon: <IconAlert size={20} />, title: 'Risk Assessment', text: 'rust-lang/rust shows elevated complexity metrics. Consider modularization to reduce maintenance risk.', color: '#f87171' },
  { icon: <IconBulb size={20} />, title: 'Optimization', text: 'Increasing test coverage in vercel/next.js by 15% would reduce predicted risk from Medium to Low.', color: '#38bdf8' },
  { icon: <IconShield size={20} />, title: 'Security Insight', text: 'All repositories maintain CI/CD pipelines. Recommend adding automated dependency scanning.', color: '#a78bfa' },
  { icon: <IconTrendUp size={20} />, title: 'Growth Forecast', text: 'Based on current trends, expect 12% increase in overall code quality scores by next quarter.', color: '#f59e0b' },
  { icon: <IconSpark size={20} />, title: 'AI Recommendation', text: 'Prioritize technical debt reduction in express.js — estimated 20% improvement in health score with targeted refactoring.', color: '#22d3ee' },
];

export default function AIInsights() {
  return (
    <motion.div className="page" initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div className="ai-page-header" variants={fadeUp}>
        <div>
          <h1 className="page-heading">AI-Powered Insights</h1>
          <p className="page-sub">Machine-learning driven analysis and predictions for your repositories</p>
        </div>
        <button className="btn btn-primary" type="button"><IconSpark size={16} /> Generate Report</button>
      </motion.div>

      {/* Summary cards */}
      <motion.div className="stats-grid" variants={stagger} style={{ marginTop: 0 }}>
        <motion.div className="stat-card glass" variants={fadeUp}>
          <span className="stat-label">AI Confidence</span>
          <span className="stat-value">94%</span>
          <span className="trend up">&#8593; 3%</span>
        </motion.div>
        <motion.div className="stat-card glass" variants={fadeUp}>
          <span className="stat-label">Predictions Made</span>
          <span className="stat-value">128</span>
          <span className="trend up">&#8593; 24</span>
        </motion.div>
        <motion.div className="stat-card glass" variants={fadeUp}>
          <span className="stat-label">Risk Alerts</span>
          <span className="stat-value">3</span>
          <span className="trend down">&#8593; Needs attention</span>
        </motion.div>
        <motion.div className="stat-card glass" variants={fadeUp}>
          <span className="stat-label">Recommendations</span>
          <span className="stat-value">12</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Actionable items</span>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <div className="section-title"><h2>Trend Analysis</h2></div>
      <motion.div className="charts-grid" variants={stagger}>
        <motion.div className="chart-card glass" variants={fadeUp}>
          <h3>Health Score Forecast</h3>
          <p className="chart-sub">Projected health vs risk for the next 8 months</p>
          <EvolutionTrendChart health={[72, 74, 76, 78, 80, 82, 84, 86]} risk={[35, 33, 31, 29, 28, 26, 25, 23]} />
        </motion.div>
        <motion.div className="chart-card glass" variants={fadeUp}>
          <h3>Risk Factors</h3>
          <p className="chart-sub">Key risk contributors</p>
          <DoughnutCard
            labels={['Complexity', 'Tech Debt', 'Coverage', 'Activity']}
            values={[35, 25, 22, 18]}
            colors={['#f87171', '#f59e0b', '#38bdf8', '#34d399']}
            centerNum="4"
            centerCap="Factors"
          />
        </motion.div>
        <motion.div className="chart-card glass" variants={fadeUp}>
          <h3>Improvement Areas</h3>
          <p className="chart-sub">Where to focus effort</p>
          <DoughnutCard
            labels={['Testing', 'Docs', 'Refactoring', 'CI/CD']}
            values={[40, 20, 25, 15]}
            colors={['#a78bfa', '#22d3ee', '#f59e0b', '#34d399']}
            centerNum="12"
            centerCap="Actions"
          />
        </motion.div>
      </motion.div>

      {/* Insights grid */}
      <div className="section-title"><h2>Detailed Insights</h2></div>
      <motion.div className="insights-grid" variants={stagger}>
        {insights.map((ins) => (
          <motion.div key={ins.title} className="glass insight-card" variants={fadeUp} whileHover={{ y: -3 }}>
            <div className="insight-icon" style={{ color: ins.color }}>{ins.icon}</div>
            <h4>{ins.title}</h4>
            <p>{ins.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
