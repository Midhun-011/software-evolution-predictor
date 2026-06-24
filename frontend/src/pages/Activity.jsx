import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { activityAPI } from '../api/activity';
import { stagger, fadeUp } from '../lib/motion';
import '../styles/dashboard.css';

const fallbackLogs = [
  { _id: '1', action: 'Login', user: 'Test User', detail: 'Logged in from Chrome on Linux', createdAt: new Date(Date.now() - 120000), type: 'auth' },
  { _id: '2', action: 'Repository Analysis', user: 'Test User', detail: 'Ran analysis on facebook/react', createdAt: new Date(Date.now() - 900000), type: 'repo' },
  { _id: '3', action: 'Settings Changed', user: 'Test User', detail: 'Updated notification preferences', createdAt: new Date(Date.now() - 3600000), type: 'settings' },
  { _id: '4', action: 'Report Generated', user: 'Test User', detail: 'Generated Q4 Risk Assessment PDF', createdAt: new Date(Date.now() - 10800000), type: 'report' },
  { _id: '5', action: 'Repository Added', user: 'Alex Johnson', detail: 'Added vercel/next.js', createdAt: new Date(Date.now() - 18000000), type: 'repo' },
  { _id: '6', action: 'Team Invite', user: 'Test User', detail: 'Invited emily@example.com as Developer', createdAt: new Date(Date.now() - 86400000), type: 'team' },
  { _id: '7', action: 'Password Changed', user: 'Test User', detail: 'Password updated successfully', createdAt: new Date(Date.now() - 172800000), type: 'auth' },
  { _id: '8', action: 'Login Failed', user: 'Unknown', detail: 'Failed login attempt from 192.168.1.50', createdAt: new Date(Date.now() - 259200000), type: 'security' },
];

const typeColors = { auth: '#38bdf8', repo: '#34d399', settings: '#a78bfa', report: '#f59e0b', team: '#22d3ee', security: '#f87171' };

function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hours ago`;
  return `${Math.floor(s / 86400)} days ago`;
}

export default function Activity() {
  const [logs, setLogs] = useState(fallbackLogs);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    activityAPI.list().then(setLogs).catch(() => {});
  }, []);

  const filtered = filter === 'all' ? logs : logs.filter((l) => l.type === filter);

  return (
    <motion.div className="page" initial="hidden" animate="show" variants={stagger}>
      <motion.h1 className="page-heading" variants={fadeUp}>Activity Log</motion.h1>
      <motion.p className="page-sub" variants={fadeUp}>Audit trail of all actions and events</motion.p>

      <motion.div className="filter-bar" variants={fadeUp}>
        {['all', 'auth', 'repo', 'settings', 'report', 'team', 'security'].map((f) => (
          <button key={f} className={`filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)} type="button">
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </motion.div>

      <motion.div className="glass" style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }} variants={fadeUp}>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Action</th><th>User</th><th>Detail</th><th>Time</th><th>Type</th></tr></thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l._id}>
                  <td style={{ fontWeight: 600 }}>{l.action}</td>
                  <td>{l.user || 'You'}</td>
                  <td style={{ color: 'var(--text-muted)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.detail}</td>
                  <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{timeAgo(l.createdAt)}</td>
                  <td>
                    <span className="badge" style={{ color: typeColors[l.type], background: `${typeColors[l.type]}22`, border: `1px solid ${typeColors[l.type]}44` }}>
                      {l.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
