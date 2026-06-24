import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IconGrid, IconChart, IconRepo, IconLogout, IconSpark, IconBell,
  IconShield, IconCode, IconTarget, IconAlert,
} from './icons';

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <aside className={`sidebar${open ? ' open' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="brand">
        <div className="brand-logo" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16l3-4 3 2 4-6"/></svg>
        </div>
        <div className="brand-text">
          <strong>Evolution</strong>
          <span>Predictor</span>
        </div>
      </div>

      <nav className="nav" onClick={onClose}>
        <div className="nav-label">Main</div>
        <NavLink to="/dashboard">
          <IconGrid size={18} />
          <span className="nav-text">Dashboard</span>
        </NavLink>
        <NavLink to="/" end>
          <IconChart size={18} />
          <span className="nav-text">Overview</span>
        </NavLink>
        <NavLink to="/repositories">
          <IconRepo size={18} />
          <span className="nav-text">Repositories</span>
        </NavLink>
        <NavLink to="/analysis">
          <IconCode size={18} />
          <span className="nav-text">Analysis</span>
        </NavLink>

        <div className="nav-label">Intelligence</div>
        <NavLink to="/ai-insights">
          <IconSpark size={18} />
          <span className="nav-text">AI Insights</span>
        </NavLink>
        <NavLink to="/reports">
          <IconTarget size={18} />
          <span className="nav-text">Reports</span>
        </NavLink>

        <div className="nav-label">Workspace</div>
        <NavLink to="/team">
          <IconShield size={18} />
          <span className="nav-text">Team</span>
        </NavLink>
        <NavLink to="/notifications">
          <IconBell size={18} />
          <span className="nav-text">Notifications</span>
        </NavLink>
        <NavLink to="/activity">
          <IconAlert size={18} />
          <span className="nav-text">Activity Log</span>
        </NavLink>
      </nav>

      {user && (
        <div className="sidebar-footer">
          <NavLink to="/profile" className="user-chip" onClick={onClose} style={{ textDecoration: 'none' }}>
            <div className="avatar" aria-hidden="true">{initial}</div>
            <div className="user-meta">
              <p className="user-name">{user.name}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </NavLink>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <NavLink to="/settings" className="btn-logout-sidebar" onClick={onClose} style={{ textDecoration: 'none', background: 'rgba(139,92,246,0.12)', color: '#c4b5fd', borderColor: 'rgba(139,92,246,0.25)' }}>
              <IconGrid size={14} />
              <span>Settings</span>
            </NavLink>
            <button onClick={handleLogout} className="btn-logout-sidebar" type="button">
              <IconLogout size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
