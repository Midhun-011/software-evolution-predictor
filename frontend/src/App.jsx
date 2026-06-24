import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import { IconMenu, IconBell } from './components/icons';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Overview = lazy(() => import('./pages/Overview'));
const RepositoryAnalysis = lazy(() => import('./pages/RepositoryAnalysis'));
const Repositories = lazy(() => import('./pages/Repositories'));
const AIInsights = lazy(() => import('./pages/AIInsights'));
const Reports = lazy(() => import('./pages/Reports'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Team = lazy(() => import('./pages/Team'));
const Activity = lazy(() => import('./pages/Activity'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
      <div className="skeleton" style={{ height: 180, borderRadius: 18 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        <div className="skeleton" style={{ height: 120, borderRadius: 18 }} />
        <div className="skeleton" style={{ height: 120, borderRadius: 18 }} />
        <div className="skeleton" style={{ height: 120, borderRadius: 18 }} />
        <div className="skeleton" style={{ height: 120, borderRadius: 18 }} />
      </div>
    </div>
  );
}

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
      <ErrorBoundary>
        <Suspense fallback={<div className="loading">Loading&hellip;</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="app">
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

        {drawerOpen && <div className="scrim" onClick={closeDrawer} aria-hidden="true" />}

        <Sidebar open={drawerOpen} onClose={closeDrawer} />

        <main className="content">
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
                <Route path="/repositories" element={<ProtectedRoute><Repositories /></ProtectedRoute>} />
                <Route path="/analysis" element={<ProtectedRoute><RepositoryAnalysis /></ProtectedRoute>} />
                <Route path="/ai-insights" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
                <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
}
