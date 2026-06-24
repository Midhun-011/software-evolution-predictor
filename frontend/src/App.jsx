import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import RepositoryAnalysis from './pages/RepositoryAnalysis';
import { IconMenu, IconBell } from './components/icons';

export default function App() {
  const { user, loading } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => { closeDrawer(); }, [location.pathname, closeDrawer]);

  if (loading) {
    return <div className="loading">Loading&hellip;</div>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app">
      {/* Mobile top bar */}
      <header className="mobile-topbar">
        <button className="icon-btn" onClick={() => setDrawerOpen(true)} aria-label="Open menu" type="button">
          <IconMenu size={20} />
        </button>
        <div className="brand">
          <div className="brand-logo" aria-hidden="true" style={{ width: 34, height: 34, borderRadius: 10 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16l3-4 3 2 4-6"/></svg>
          </div>
          <div className="brand-text">
            <strong>Evolution</strong>
            <span>Predictor</span>
          </div>
        </div>
        <button className="icon-btn" aria-label="Notifications" type="button">
          <IconBell size={18} />
          <span className="dot" />
        </button>
      </header>

      {/* Scrim for mobile drawer */}
      {drawerOpen && (
        <div className="scrim" onClick={closeDrawer} aria-hidden="true" />
      )}

      <Sidebar open={drawerOpen} onClose={closeDrawer} />

      <main className="content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Overview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analysis"
              element={
                <ProtectedRoute>
                  <RepositoryAnalysis />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
