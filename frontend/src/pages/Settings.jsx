import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { stagger, fadeUp } from '../lib/motion';
import { IconShield, IconBell, IconGrid, IconLogout } from '../components/icons';
import '../styles/dashboard.css';

const tabs = [
  { id: 'security', label: 'Security', icon: <IconShield size={18} /> },
  { id: 'notifications', label: 'Notifications', icon: <IconBell size={18} /> },
  { id: 'theme', label: 'Appearance', icon: <IconGrid size={18} /> },
  { id: 'account', label: 'Account', icon: <IconLogout size={18} /> },
];

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`toggle-switch${on ? ' on' : ''}`}
      role="switch"
      aria-checked={on}
    >
      <span className="toggle-thumb" />
    </button>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const [tab, setTab] = useState('security');
  const [twoFa, setTwoFa] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  return (
    <motion.div className="page" initial="hidden" animate="show" variants={stagger}>
      <motion.h1 className="page-heading" variants={fadeUp}>Settings</motion.h1>
      <motion.p className="page-sub" variants={fadeUp}>Configure your account preferences</motion.p>

      <motion.div className="settings-layout" variants={stagger}>
        <motion.nav className="glass settings-nav" variants={fadeUp}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`settings-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
              type="button"
            >
              {t.icon}<span>{t.label}</span>
            </button>
          ))}
        </motion.nav>

        <motion.div className="glass settings-panel" variants={fadeUp}>
          {tab === 'security' && (
            <div>
              <h3 className="card-title">Security Settings</h3>
              <div className="setting-row">
                <div><p className="setting-name">Two-Factor Authentication</p><p className="setting-desc">Add an extra layer of security to your account</p></div>
                <Toggle on={twoFa} onChange={setTwoFa} />
              </div>
              <div className="setting-row">
                <div><p className="setting-name">Change Password</p><p className="setting-desc">Update your password regularly for better security</p></div>
                <button className="btn btn-ghost" type="button" style={{ fontSize: 13 }}>Change</button>
              </div>
              <div className="setting-row">
                <div><p className="setting-name">Active Sessions</p><p className="setting-desc">Manage your active login sessions</p></div>
                <button className="btn btn-ghost" type="button" style={{ fontSize: 13 }}>View</button>
              </div>
              <div className="setting-row">
                <div><p className="setting-name">Login History</p><p className="setting-desc">Review recent login activity</p></div>
                <button className="btn btn-ghost" type="button" style={{ fontSize: 13 }}>View</button>
              </div>
              <div className="setting-row" style={{ borderBottom: 'none' }}>
                <div><p className="setting-name">Logout from All Devices</p><p className="setting-desc">Sign out of all active sessions</p></div>
                <button className="btn" type="button" style={{ fontSize: 13, background: 'rgba(248,113,113,0.12)', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.25)' }}>Logout All</button>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div>
              <h3 className="card-title">Notification Preferences</h3>
              <div className="setting-row">
                <div><p className="setting-name">Email Notifications</p><p className="setting-desc">Receive important updates via email</p></div>
                <Toggle on={emailNotif} onChange={setEmailNotif} />
              </div>
              <div className="setting-row">
                <div><p className="setting-name">Risk Alerts</p><p className="setting-desc">Get notified when repositories show elevated risk</p></div>
                <Toggle on={riskAlerts} onChange={setRiskAlerts} />
              </div>
              <div className="setting-row" style={{ borderBottom: 'none' }}>
                <div><p className="setting-name">Weekly Reports</p><p className="setting-desc">Receive weekly analytics summary</p></div>
                <Toggle on={weeklyReport} onChange={setWeeklyReport} />
              </div>
            </div>
          )}

          {tab === 'theme' && (
            <div>
              <h3 className="card-title">Appearance</h3>
              <div className="theme-options">
                <button className="theme-card active" type="button">
                  <div className="theme-preview dark" /><span>Dark</span>
                </button>
                <button className="theme-card" type="button">
                  <div className="theme-preview light" /><span>Light</span>
                </button>
                <button className="theme-card" type="button">
                  <div className="theme-preview system" /><span>System</span>
                </button>
              </div>
            </div>
          )}

          {tab === 'account' && (
            <div>
              <h3 className="card-title">Account Settings</h3>
              <div className="setting-row">
                <div><p className="setting-name">Export Data</p><p className="setting-desc">Download all your data in JSON format</p></div>
                <button className="btn btn-ghost" type="button" style={{ fontSize: 13 }}>Export</button>
              </div>
              <div className="setting-row" style={{ borderBottom: 'none' }}>
                <div><p className="setting-name" style={{ color: '#fca5a5' }}>Delete Account</p><p className="setting-desc">Permanently delete your account and all data</p></div>
                <button className="btn" type="button" style={{ fontSize: 13, background: 'rgba(248,113,113,0.12)', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.25)' }}>Delete</button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
