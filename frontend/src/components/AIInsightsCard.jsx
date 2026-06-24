import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motion';
import { IconSpark, IconTarget, IconBulb } from './icons';

const items = [
  {
    icon: <IconTarget size={16} />,
    title: 'Prediction',
    text: 'Repository health trending upward by 8% this quarter.',
  },
  {
    icon: <IconBulb size={16} />,
    title: 'Recommendation',
    text: 'Increase test coverage in vercel/next.js to reduce risk.',
  },
  {
    icon: <IconSpark size={16} />,
    title: 'Risk Alert',
    text: 'rust-lang/rust shows elevated complexity — consider modularization.',
  },
];

export default function AIInsightsCard() {
  return (
    <motion.div className="ai-card" variants={fadeUp}>
      <div className="ai-head">
        <div className="ai-icon"><IconSpark size={22} /></div>
        <div>
          <h3>AI-Powered Insights</h3>
          <p className="ai-sub">Machine-learning driven analysis</p>
        </div>
      </div>
      <div className="ai-list">
        {items.map((it) => (
          <div key={it.title} className="ai-item">
            <span className="ai-item-icon">{it.icon}</span>
            <div>
              <p className="ai-item-title">{it.title}</p>
              <p className="ai-item-text">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="btn" type="button">View Insights</button>
    </motion.div>
  );
}
