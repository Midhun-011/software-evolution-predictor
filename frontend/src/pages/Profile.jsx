import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { stagger, fadeUp } from '../lib/motion';
import '../styles/dashboard.css';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
  });
  const [saved, setSaved] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <motion.div className="page" initial="hidden" animate="show" variants={stagger}>
      <motion.h1 className="page-heading" variants={fadeUp}>Profile</motion.h1>
      <motion.p className="page-sub" variants={fadeUp}>Manage your personal information</motion.p>

      <motion.div className="settings-grid" variants={stagger}>
        {/* Avatar section */}
        <motion.div className="glass settings-card avatar-section" variants={fadeUp}>
          <div className="avatar lg" style={{ width: 88, height: 88, fontSize: 32 }}>{initial}</div>
          <h3 style={{ margin: '14px 0 4px', fontSize: 18 }}>{user?.name}</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>{user?.email}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn btn-primary" type="button" style={{ fontSize: 13, padding: '9px 16px' }}>Upload Photo</button>
            <button className="btn btn-ghost" type="button" style={{ fontSize: 13, padding: '9px 16px' }}>Remove</button>
          </div>
        </motion.div>

        {/* Info form */}
        <motion.form className="glass settings-card" onSubmit={handleSave} variants={fadeUp}>
          <h3 className="card-title">Personal Information</h3>
          <div className="settings-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={form.name} onChange={set('name')} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={form.email} onChange={set('email')} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 234 567 8900" />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea value={form.bio} onChange={set('bio')} placeholder="Tell us about yourself..." rows={3} style={{ resize: 'vertical' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button className="btn btn-primary" type="submit">{saved ? 'Saved!' : 'Save Changes'}</button>
          </div>
        </motion.form>

        {/* Account info */}
        <motion.div className="glass settings-card" variants={fadeUp}>
          <h3 className="card-title">Account Information</h3>
          <div className="info-rows">
            <div className="info-row"><span className="info-label">Account Status</span><span className="badge green">Active</span></div>
            <div className="info-row"><span className="info-label">Member Since</span><span>January 2025</span></div>
            <div className="info-row"><span className="info-label">Last Login</span><span>Today, 2:30 PM</span></div>
            <div className="info-row"><span className="info-label">Role</span><span>Developer</span></div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
