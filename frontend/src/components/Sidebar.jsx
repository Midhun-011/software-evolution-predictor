import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Evolution Predictor</h1>
      </div>
      <nav className="nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/">Overview</NavLink>
        <NavLink to="/analysis">Repository Analysis</NavLink>
      </nav>
      {user && (
        <div className="sidebar-footer">
          <div className="user-info">
            <p className="user-name">{user.name}</p>
            <p className="user-email">{user.email}</p>
          </div>
          <button onClick={handleLogout} className="btn-logout-sidebar">
            Logout
          </button>
        </div>
      )}
    </aside>
  )
}
