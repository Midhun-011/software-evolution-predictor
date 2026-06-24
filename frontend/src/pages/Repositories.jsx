import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { stagger, fadeUp } from '../lib/motion';
import { IconPlus, IconRepo } from '../components/icons';
import '../styles/dashboard.css';

const initialRepos = [
  { id: 1, name: 'facebook/react', source: 'GitHub', language: 'JavaScript', health: 85, risk: 'Low', stars: '220k', lastUpdated: '2 hours ago', favorite: true, tags: ['frontend', 'ui'] },
  { id: 2, name: 'microsoft/typescript', source: 'GitHub', language: 'TypeScript', health: 82, risk: 'Low', stars: '98k', lastUpdated: '5 hours ago', favorite: true, tags: ['language', 'tools'] },
  { id: 3, name: 'vercel/next.js', source: 'GitHub', language: 'JavaScript', health: 68, risk: 'Medium', stars: '120k', lastUpdated: '1 day ago', favorite: false, tags: ['frontend', 'framework'] },
  { id: 4, name: 'expressjs/express', source: 'GitHub', language: 'JavaScript', health: 74, risk: 'Low', stars: '63k', lastUpdated: '3 days ago', favorite: false, tags: ['backend', 'api'] },
  { id: 5, name: 'rust-lang/rust', source: 'GitHub', language: 'Rust', health: 45, risk: 'High', stars: '92k', lastUpdated: '6 hours ago', favorite: false, tags: ['language', 'systems'] },
];

const riskBadge = { Low: 'green', Medium: 'orange', High: 'red' };

export default function Repositories() {
  const [repos, setRepos] = useState(initialRepos);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    let r = repos;
    if (search) r = r.filter((repo) => repo.name.toLowerCase().includes(search.toLowerCase()));
    if (filterRisk !== 'all') r = r.filter((repo) => repo.risk === filterRisk);
    return r;
  }, [repos, search, filterRisk]);

  const toggleFav = (id) => setRepos((rs) => rs.map((r) => r.id === id ? { ...r, favorite: !r.favorite } : r));

  return (
    <motion.div className="page" initial="hidden" animate="show" variants={stagger}>
      <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-heading">Repositories</h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>{repos.length} repositories tracked</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setShowAdd(!showAdd)}><IconPlus size={16} /> Add Repository</button>
      </motion.div>

      {showAdd && (
        <motion.div className="glass" style={{ padding: 20, borderRadius: 'var(--radius)', marginTop: 18, marginBottom: 4 }} variants={fadeUp}>
          <h3 className="card-title">Add Repository</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12, alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Repository URL</label>
              <input type="text" placeholder="https://github.com/owner/repo" style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, width: '100%' }} />
            </div>
            <select style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14 }}>
              <option>GitHub</option><option>GitLab</option><option>Bitbucket</option>
            </select>
            <button className="btn btn-primary" type="button" style={{ padding: '10px 20px' }}>Add</button>
          </div>
        </motion.div>
      )}

      {/* Search + filter */}
      <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search repositories..." style={{ flex: 1, minWidth: 200, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontSize: 14 }} />
        <div className="filter-bar" style={{ margin: 0 }}>
          {['all', 'Low', 'Medium', 'High'].map((f) => (
            <button key={f} className={`filter-chip${filterRisk === f ? ' active' : ''}`} onClick={() => setFilterRisk(f)} type="button">{f === 'all' ? 'All' : `${f} Risk`}</button>
          ))}
        </div>
      </motion.div>

      {/* Repo cards */}
      <motion.div className="repo-cards-grid" variants={stagger}>
        {filtered.map((r) => (
          <motion.div key={r.id} className="glass repo-card-full" variants={fadeUp} whileHover={{ y: -3 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="repo-mark"><IconRepo size={18} /></div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{r.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{r.source} &middot; {r.language}</p>
                </div>
              </div>
              <button className="fav-btn" type="button" onClick={() => toggleFav(r.id)} aria-label="Toggle favorite">{r.favorite ? '\u2605' : '\u2606'}</button>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
              <div><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Health</span><p style={{ margin: 0, fontWeight: 700, fontSize: 20 }}>{r.health}</p></div>
              <div><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Stars</span><p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{r.stars}</p></div>
              <div><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Updated</span><p style={{ margin: 0, fontSize: 13, color: 'var(--text-dim)' }}>{r.lastUpdated}</p></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className={`badge ${riskBadge[r.risk]}`}>{r.risk} Risk</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {r.tags.map((t) => <span key={t} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{t}</span>)}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
