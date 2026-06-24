import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-header">
      <div className="welcome-section">
        <h1>Welcome, {user?.name}!</h1>
        <p>Email: {user?.email}</p>
      </div>
      <button onClick={handleLogout} className="btn-logout">
        Logout
      </button>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Dashboard</h2>
          <p>You are now logged in to the Software Evolution Predictor.</p>
          <p>Use the navigation menu to explore repositories and analyze software metrics.</p>
        </div>

        <div className="dashboard-card">
          <h2>Features</h2>
          <ul>
            <li>Repository Analysis</li>
            <li>Software Metrics</li>
            <li>Evolution Prediction</li>
            <li>Performance Tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
