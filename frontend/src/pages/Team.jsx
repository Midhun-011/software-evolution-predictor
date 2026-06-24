import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { stagger, fadeUp } from '../lib/motion';
import { IconPlus } from '../components/icons';
import '../styles/dashboard.css';

const members = [
  { name: 'Alex Johnson', email: 'alex@example.com', role: 'Admin', status: 'Active', joined: 'Jan 2025' },
  { name: 'Sarah Chen', email: 'sarah@example.com', role: 'Manager', status: 'Active', joined: 'Feb 2025' },
  { name: 'Mike Rodriguez', email: 'mike@example.com', role: 'Developer', status: 'Active', joined: 'Mar 2025' },
  { name: 'Emily Park', email: 'emily@example.com', role: 'Developer', status: 'Invited', joined: 'Jun 2025' },
];

const roleColors = { Admin: '#a78bfa', Manager: '#38bdf8', Developer: '#34d399' };

export default function Team() {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <motion.div className="page" initial="hidden" animate="show" variants={stagger}>
      <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-heading">Team</h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>Manage team members and roles</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setShowInvite(!showInvite)}><IconPlus size={16} /> Invite Member</button>
      </motion.div>

      {showInvite && (
        <motion.div className="glass" style={{ padding: 20, borderRadius: 'var(--radius)', marginTop: 18, marginBottom: 4 }} variants={fadeUp}>
          <h3 className="card-title">Invite New Member</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Email Address</label>
              <input type="email" placeholder="colleague@company.com" style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, width: '100%' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Role</label>
              <select style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, width: '100%' }}>
                <option value="developer">Developer</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="btn btn-primary" type="button" style={{ padding: '10px 20px' }}>Send Invite</button>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div className="stats-grid" variants={stagger} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <motion.div className="stat-card glass" variants={fadeUp}>
          <span className="stat-label">Total Members</span>
          <span className="stat-value">{members.length}</span>
        </motion.div>
        <motion.div className="stat-card glass" variants={fadeUp}>
          <span className="stat-label">Active</span>
          <span className="stat-value">{members.filter((m) => m.status === 'Active').length}</span>
        </motion.div>
        <motion.div className="stat-card glass" variants={fadeUp}>
          <span className="stat-label">Pending Invites</span>
          <span className="stat-value">{members.filter((m) => m.status === 'Invited').length}</span>
        </motion.div>
      </motion.div>

      {/* Members table */}
      <div className="section-title"><h2>Members</h2></div>
      <motion.div className="glass" style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }} variants={fadeUp}>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Member</th><th>Role</th><th>Status</th><th>Joined</th><th></th></tr></thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.email}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar" style={{ width: 34, height: 34, fontSize: 13 }}>{m.name.charAt(0)}</div>
                      <div><p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{m.name}</p><p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{m.email}</p></div>
                    </div>
                  </td>
                  <td><span className="badge" style={{ color: roleColors[m.role], background: `${roleColors[m.role]}22`, border: `1px solid ${roleColors[m.role]}44` }}>{m.role}</span></td>
                  <td><span className={`badge ${m.status === 'Active' ? 'green' : 'orange'}`}>{m.status}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{m.joined}</td>
                  <td><button className="btn btn-ghost" type="button" style={{ fontSize: 12, padding: '6px 12px' }}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
