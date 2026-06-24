import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import EvolutionTrendChart from '../components/charts/EvolutionTrendChart';
import DoughnutCard from '../components/charts/DoughnutCard';
import RepositoryPanel from '../components/RepositoryPanel';
import AIInsightsCard from '../components/AIInsightsCard';
import {
  IconRepo,
  IconCode,
  IconShield,
  IconAlert,
  IconPlus,
  IconBell,
  IconChart,
  IconTarget,
} from '../components/icons';
import { stagger, fadeUp } from '../lib/motion';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <motion.div className="page" initial="hidden" animate="show" variants={stagger}>
      {/* Hero */}
      <motion.section className="hero" variants={fadeUp}>
        <div className="hero-bg" />
        <div className="hero-inner">
          <div className="hero-welcome">
            <h1>Welcome back, {user?.name || 'User'} <span role="img" aria-label="wave">&#128075;</span></h1>
            <p>Track, analyze and predict your software evolution.</p>
          </div>
          <div className="hero-actions">
            <div className="hero-user">
              <div className="avatar">{initial}</div>
              <div>
                <p className="user-name">{user?.name}</p>
                <p className="user-role">Developer</p>
              </div>
            </div>
            <button className="btn btn-primary" type="button"><IconPlus size={16} /> Add Repository</button>
            <button className="icon-btn" type="button" aria-label="Notifications"><IconBell size={18} /><span className="dot" /></button>
          </div>
        </div>
      </motion.section>

      {/* Stat cards */}
      <motion.div className="stats-grid six" variants={stagger}>
        <StatCard icon={<IconRepo size={22} />} iconClass="indigo" label="Repositories" value="5" trend="12%" trendUp />
        <StatCard icon={<IconChart size={22} />} iconClass="cyan" label="Total Commits" value="2,847" trend="18%" trendUp />
        <StatCard icon={<IconTarget size={22} />} iconClass="green" label="Contributors" value="42" trend="6%" trendUp />
        <StatCard icon={<IconCode size={22} />} iconClass="amber" label="Lines of Code" value="1.2M" trend="8%" trendUp />
        <StatCard icon={<IconShield size={22} />} iconClass="indigo" label="Code Quality" value="78" trend="5%" trendUp />
        <StatCard icon={<IconAlert size={22} />} iconClass="amber" label="Predicted Risk" value="Low" trend="3%" trendUp={false} />
      </motion.div>

      {/* Charts */}
      <div className="section-title"><h2>Analytics</h2><span className="sub">Last 8 months</span></div>
      <motion.div className="charts-grid" variants={stagger}>
        <motion.div className="chart-card glass" variants={fadeUp}>
          <h3>Evolution Trend</h3>
          <p className="chart-sub">Health score vs risk index over time</p>
          <EvolutionTrendChart />
        </motion.div>
        <motion.div className="chart-card glass" variants={fadeUp}>
          <h3>Code Quality</h3>
          <p className="chart-sub">Distribution</p>
          <DoughnutCard
            labels={['Excellent', 'Good', 'Needs Work']}
            values={[45, 35, 20]}
            colors={['#34d399', '#38bdf8', '#f59e0b']}
            centerNum="78"
            centerCap="Score"
          />
        </motion.div>
        <motion.div className="chart-card glass" variants={fadeUp}>
          <h3>Risk Distribution</h3>
          <p className="chart-sub">Across repositories</p>
          <DoughnutCard
            labels={['Low', 'Medium', 'High']}
            values={[2, 2, 1]}
            colors={['#34d399', '#f59e0b', '#f87171']}
            centerNum="5"
            centerCap="Repos"
          />
        </motion.div>
      </motion.div>

      {/* Lower grid: repos + AI */}
      <div className="section-title"><h2>Recent Repositories</h2></div>
      <motion.div className="lower-grid" variants={stagger}>
        <motion.div className="repo-panel glass" variants={fadeUp}>
          <RepositoryPanel />
        </motion.div>
        <AIInsightsCard />
      </motion.div>
    </motion.div>
  );
}
