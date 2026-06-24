import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motion';

export default function StatCard({ icon, iconClass, label, value, trend, trendUp }) {
  return (
    <motion.div className="stat-card glass" variants={fadeUp}>
      <div className="stat-top">
        <div className={`stat-icon ${iconClass}`}>{icon}</div>
        {trend != null && (
          <span className={`trend ${trendUp ? 'up' : 'down'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </motion.div>
  );
}
