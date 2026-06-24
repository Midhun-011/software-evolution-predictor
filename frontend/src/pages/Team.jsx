import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { teamAPI } from '../api/team';
import { stagger, fadeUp } from '../lib/motion';
import { IconPlus } from '../components/icons';
import '../styles/dashboard.css';

const fallbackMembers = [
  { name: 'Alex Johnson', email: 'alex@example.com', role: 'admin', status: 'active', joinedAt: '2025-01-15' },
  { name: 'Sarah Chen', email: 'sarah@example.com', role: 'manager', status: 'active', joinedAt: '2025-02-20' },
  { name: 'Mike Rodriguez', email: 'mike@example.com', role: 'developer', status: 'active', joinedAt: '2025-03-10' },
  { name: 'Emily Park', email: 'emily@example.com', role: 'developer', status: 'invited', joinedAt: '2025-06-01' },
];

const roleColors = { admin: '#a78bfa', manager: '#38bdf8', developer: '#34d399' };

export default function Team() {
  const [members, setMembers] = useState(fallbackMembers);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('developer');

  useEffect(() => {
    teamAPI.get().then((team) => {
      if (team?.members) setMembers(team.members);
    }).catch(() => {});
  }, []);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      const team = await teamAPI.invite({ email: inviteEmail, role: inviteRole });
      if (team?.members) setMembers(team.members);
      setInviteEmail('');
      setShowInvite(false);
    } catch (e) {
      setMembers((m) => [...m, { email: inviteEmail, role: inviteRole, status: 'invited', name: inviteEmail.split('@')[0] }]);
      setInviteEmail('');
      setShowInvite(false);
    }
  };

  const active = members.filter((m) => m.status === 'active');
  const invited = members.filter((m) => m.status === 'invited');

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
              <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@company.com" style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, width: '100%' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Role</label>
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, width: '100%' }}>
                <option value="developer">Developer</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="btn btn-primary" type="button" onClick={handleInvite} style={{ padding: '10px 20px' }}>Send Invite</button>
          </div>
        </motion.div>
      )}

      <motion.div className="stats-grid" variants={stagger} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <motion.div className="stat-card glass" variants={fadeUp}><span className="stat-label">Total Members</span><span className="stat-value">{members.length}</span></motion.div>
        <motion.div className="stat-card glass" variants={fadeUp}><span className="stat-label">Active</span><span className="stat-value">{active.length}</span></motion.div>
        <motion.div className="stat-card glass" variants={fadeUp}><span className="stat-label">Pending Invites</span><span className="stat-value">{invited.length}</span></motion.div>
      </motion.div>

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
                      <div className="avatar" style={{ width: 34, height: 34, fontSize: 13 }}>{(m.name || m.email).charAt(0).toUpperCase()}</div>
                      <div><p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{m.name || m.email}</p><p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{m.email}</p></div>
                    </div>
                  </td>
                  <td><span className="badge" style={{ color: roleColors[m.role] || '#9aa6c2', background: `${roleColors[m.role] || '#9aa6c2'}22`, border: `1px solid ${roleColors[m.role] || '#9aa6c2'}44`, textTransform: 'capitalize' }}>{m.role}</span></td>
                  <td><span className={`badge ${m.status === 'active' ? 'green' : 'orange'}`} style={{ textTransform: 'capitalize' }}>{m.status}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{m.joinedAt ? new Date(m.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '-'}</td>
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
