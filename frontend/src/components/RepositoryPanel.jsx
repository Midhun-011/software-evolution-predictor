import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../lib/motion';

const repos = [
  { name: 'facebook/react', updated: '2 hours ago', quality: 'High Quality' },
  { name: 'microsoft/typescript', updated: '5 hours ago', quality: 'High Quality' },
  { name: 'vercel/next.js', updated: '1 day ago', quality: 'Medium Risk' },
  { name: 'expressjs/express', updated: '3 days ago', quality: 'High Quality' },
  { name: 'rust-lang/rust', updated: '6 hours ago', quality: 'High Risk' },
];

const badgeMap = {
  'High Quality': 'green',
  'Medium Risk': 'orange',
  'High Risk': 'red',
};

export default function RepositoryPanel() {
  return (
    <div className="repo-list">
      {repos.map((r, i) => (
        <motion.div
          key={r.name}
          className="repo-row"
          variants={fadeUp}
          custom={i}
          whileHover={{ x: 3 }}
        >
          <div className="repo-id">
            <div className="repo-mark">{r.name[0].toUpperCase()}</div>
            <div>
              <p className="repo-name">{r.name}</p>
              <p className="repo-updated">{r.updated}</p>
            </div>
          </div>
          <span className={`badge ${badgeMap[r.quality]}`}>{r.quality}</span>
        </motion.div>
      ))}
    </div>
  );
}
