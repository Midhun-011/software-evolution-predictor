import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { notifAPI } from '../api/notifications';
import { stagger, fadeUp } from '../lib/motion';
import { IconBell, IconAlert, IconShield, IconRepo } from '../components/icons';
import '../styles/dashboard.css';

const fallback = [
  { _id: '1', type: 'risk', title: 'High Risk Detected', desc: 'rust-lang/rust shows elevated complexity metrics', createdAt: new Date(Date.now() - 7200000), read: false },
  { _id: '2', type: 'security', title: 'Security Alert', desc: 'New login detected from Chrome on Linux', createdAt: new Date(Date.now() - 18000000), read: false },
  { _id: '3', type: 'repo', title: 'Repository Updated', desc: 'facebook/react analysis completed successfully', createdAt: new Date(Date.now() - 86400000), read: true },
  { _id: '4', type: 'system', title: 'Weekly Report Ready', desc: 'Your weekly analytics report is available for download', createdAt: new Date(Date.now() - 172800000), read: true },
  { _id: '5', type: 'risk', title: 'Risk Level Changed', desc: 'vercel/next.js risk downgraded from High to Medium', createdAt: new Date(Date.now() - 259200000), read: true },
  { _id: '6', type: 'system', title: 'System Maintenance', desc: 'Scheduled maintenance completed successfully', createdAt: new Date(Date.now() - 432000000), read: true },
];

const typeColors = { risk: '#f87171', security: '#a78bfa', repo: '#38bdf8', system: '#9aa6c2' };
const typeIcons = { risk: <IconAlert size={18} />, security: <IconShield size={18} />, repo: <IconRepo size={18} />, system: <IconBell size={18} /> };

function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hours ago`;
  return `${Math.floor(s / 86400)} days ago`;
}

export default function Notifications() {
  const [notifs, setNotifs] = useState(fallback);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    notifAPI.list().then(setNotifs).catch(() => {});
  }, []);

  const filtered = filter === 'all' ? notifs : filter === 'unread' ? notifs.filter((n) => !n.read) : notifs.filter((n) => n.type === filter);

  const markAllRead = async () => {
    try {
      await notifAPI.markAllRead();
      setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
    } catch (e) {
      setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <motion.div className="page" initial="hidden" animate="show" variants={stagger}>
      <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-heading">Notifications</h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>{notifs.filter((n) => !n.read).length} unread notifications</p>
        </div>
        <button className="btn btn-ghost" type="button" style={{ fontSize: 13 }} onClick={markAllRead}>Mark All Read</button>
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
          <motion.div key={n._id} className={`glass notif-item${n.read ? '' : ' unread'}`} variants={fadeUp} whileHover={{ x: 3 }}>
            <div className="notif-icon" style={{ color: typeColors[n.type] }}>{typeIcons[n.type] || <IconBell size={18} />}</div>
            <div className="notif-body">
              <p className="notif-title">{n.title}</p>
              <p className="notif-desc">{n.desc}</p>
            </div>
            <span className="notif-time">{timeAgo(n.createdAt)}</span>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state glass"><span>No notifications found.</span></div>
        )}
      </motion.div>
    </motion.div>
  );
}
