import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IconGrid,
  IconChart,
  IconRepo,
  IconLogout,
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
        <div className="nav-label">Menu</div>
        <NavLink to="/dashboard">
          <IconGrid size={18} />
          <span className="nav-text">Dashboard</span>
        </NavLink>
        <NavLink to="/" end>
          <IconChart size={18} />
          <span className="nav-text">Overview</span>
        </NavLink>
        <NavLink to="/analysis">
          <IconRepo size={18} />
          <span className="nav-text">Repository Analysis</span>
        </NavLink>
      </nav>

      {user && (
        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar" aria-hidden="true">{initial}</div>
            <div className="user-meta">
              <p className="user-name">{user.name}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout-sidebar" type="button">
            <IconLogout size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
}
