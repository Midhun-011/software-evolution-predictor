import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { stagger, fadeUp } from '../lib/motion';
import { IconBell, IconAlert, IconShield, IconRepo } from '../components/icons';
import '../styles/dashboard.css';

const notifications = [
  { id: 1, type: 'risk', icon: <IconAlert size={18} />, title: 'High Risk Detected', desc: 'rust-lang/rust shows elevated complexity metrics', time: '2 hours ago', read: false },
  { id: 2, type: 'security', icon: <IconShield size={18} />, title: 'Security Alert', desc: 'New login detected from Chrome on Linux', time: '5 hours ago', read: false },
  { id: 3, type: 'repo', icon: <IconRepo size={18} />, title: 'Repository Updated', desc: 'facebook/react analysis completed successfully', time: '1 day ago', read: true },
  { id: 4, type: 'system', icon: <IconBell size={18} />, title: 'Weekly Report Ready', desc: 'Your weekly analytics report is available for download', time: '2 days ago', read: true },
  { id: 5, type: 'risk', icon: <IconAlert size={18} />, title: 'Risk Level Changed', desc: 'vercel/next.js risk downgraded from High to Medium', time: '3 days ago', read: true },
  { id: 6, type: 'system', icon: <IconBell size={18} />, title: 'System Maintenance', desc: 'Scheduled maintenance completed successfully', time: '5 days ago', read: true },
];

const typeColors = { risk: '#f87171', security: '#a78bfa', repo: '#38bdf8', system: '#9aa6c2' };

export default function Notifications() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter((n) => !n.read) : notifications.filter((n) => n.type === filter);

  return (
    <motion.div className="page" initial="hidden" animate="show" variants={stagger}>
      <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-heading">Notifications</h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>{notifications.filter((n) => !n.read).length} unread notifications</p>
        </div>
        <button className="btn btn-ghost" type="button" style={{ fontSize: 13 }}>Mark All Read</button>
      </motion.div>

      <motion.div className="filter-bar" variants={fadeUp}>
        {['all', 'unread', 'risk', 'security', 'repo', 'system'].map((f) => (
          <button key={f} className={`filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)} type="button">
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </motion.div>

      <motion.div className="notif-list" variants={stagger}>
        {filtered.map((n) => (
          <motion.div key={n.id} className={`glass notif-item${n.read ? '' : ' unread'}`} variants={fadeUp} whileHover={{ x: 3 }}>
            <div className="notif-icon" style={{ color: typeColors[n.type] }}>{n.icon}</div>
            <div className="notif-body">
              <p className="notif-title">{n.title}</p>
              <p className="notif-desc">{n.desc}</p>
            </div>
            <span className="notif-time">{n.time}</span>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state glass"><span>No notifications found.</span></div>
        )}
      </motion.div>
    </motion.div>
  );
}
