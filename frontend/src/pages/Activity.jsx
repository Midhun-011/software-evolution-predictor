import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { stagger, fadeUp } from '../lib/motion';
import '../styles/dashboard.css';

const logs = [
  { id: 1, action: 'Login', user: 'Test User', detail: 'Logged in from Chrome on Linux', time: '2 min ago', type: 'auth' },
  { id: 2, action: 'Repository Analysis', user: 'Test User', detail: 'Ran analysis on facebook/react', time: '15 min ago', type: 'repo' },
  { id: 3, action: 'Settings Changed', user: 'Test User', detail: 'Updated notification preferences', time: '1 hour ago', type: 'settings' },
  { id: 4, action: 'Report Generated', user: 'Test User', detail: 'Generated Q4 Risk Assessment PDF', time: '3 hours ago', type: 'report' },
  { id: 5, action: 'Repository Added', user: 'Alex Johnson', detail: 'Added vercel/next.js repository', time: '5 hours ago', type: 'repo' },
  { id: 6, action: 'Team Invite', user: 'Test User', detail: 'Invited emily@example.com as Developer', time: '1 day ago', type: 'team' },
  { id: 7, action: 'Password Changed', user: 'Test User', detail: 'Password updated successfully', time: '2 days ago', type: 'auth' },
  { id: 8, action: 'Login Failed', user: 'Unknown', detail: 'Failed login attempt from 192.168.1.50', time: '3 days ago', type: 'security' },
  { id: 9, action: 'Report Downloaded', user: 'Sarah Chen', detail: 'Downloaded Monthly Analytics - November', time: '5 days ago', type: 'report' },
  { id: 10, action: 'Login', user: 'Mike Rodriguez', detail: 'Logged in from Safari on macOS', time: '1 week ago', type: 'auth' },
];

const typeColors = { auth: '#38bdf8', repo: '#34d399', settings: '#a78bfa', report: '#f59e0b', team: '#22d3ee', security: '#f87171' };

export default function Activity() {
  const [filter, setFilter] = useState('all');
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
                <tr key={l.id}>
                  <td style={{ fontWeight: 600 }}>{l.action}</td>
                  <td>{l.user}</td>
                  <td style={{ color: 'var(--text-muted)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.detail}</td>
                  <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{l.time}</td>
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
