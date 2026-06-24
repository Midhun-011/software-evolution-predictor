import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-code">404</div>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link to="/dashboard" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>Back to Dashboard</Link>
    </div>
  );
}
