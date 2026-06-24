import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../api/profile';
import { stagger, fadeUp } from '../lib/motion';
import '../styles/dashboard.css';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    profileAPI.get().then((p) => {
      setProfile(p);
      setForm({ name: p.name || '', email: p.email || '', phone: p.phone || '', bio: p.bio || '' });
    }).catch(() => {});
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await profileAPI.update({ name: form.name, phone: form.phone, bio: form.bio });
      setProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaved(false);
    }
  };

  const initial = (profile?.name || user?.name || 'U').charAt(0).toUpperCase();

  return (
    <motion.div className="page" initial="hidden" animate="show" variants={stagger}>
      <motion.h1 className="page-heading" variants={fadeUp}>Profile</motion.h1>
      <motion.p className="page-sub" variants={fadeUp}>Manage your personal information</motion.p>

      <motion.div className="settings-grid" variants={stagger}>
        <motion.div className="glass settings-card avatar-section" variants={fadeUp}>
          <div className="avatar lg" style={{ width: 88, height: 88, fontSize: 32 }}>{initial}</div>
          <h3 style={{ margin: '14px 0 4px', fontSize: 18 }}>{profile?.name || user?.name}</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>{profile?.email || user?.email}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn btn-primary" type="button" style={{ fontSize: 13, padding: '9px 16px' }}>Upload Photo</button>
            <button className="btn btn-ghost" type="button" style={{ fontSize: 13, padding: '9px 16px' }}>Remove</button>
          </div>
        </motion.div>

        <motion.form className="glass settings-card" onSubmit={handleSave} variants={fadeUp}>
          <h3 className="card-title">Personal Information</h3>
          <div className="settings-form">
            <div className="form-group"><label>Full Name</label><input type="text" value={form.name} onChange={set('name')} /></div>
            <div className="form-group"><label>Email Address</label><input type="email" value={form.email} readOnly style={{ opacity: 0.6 }} /></div>
            <div className="form-group"><label>Phone Number</label><input type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 234 567 8900" /></div>
            <div className="form-group"><label>Bio</label><textarea value={form.bio} onChange={set('bio')} placeholder="Tell us about yourself..." rows={3} style={{ resize: 'vertical' }} /></div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button className="btn btn-primary" type="submit">{saved ? 'Saved!' : 'Save Changes'}</button>
          </div>
        </motion.form>

        <motion.div className="glass settings-card" variants={fadeUp}>
          <h3 className="card-title">Account Information</h3>
          <div className="info-rows">
            <div className="info-row"><span className="info-label">Account Status</span><span className="badge green">{profile?.verified ? 'Verified' : 'Active'}</span></div>
            <div className="info-row"><span className="info-label">Member Since</span><span>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}</span></div>
            <div className="info-row"><span className="info-label">Last Login</span><span>{profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'N/A'}</span></div>
            <div className="info-row"><span className="info-label">Role</span><span style={{ textTransform: 'capitalize' }}>{profile?.role || 'Developer'}</span></div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
