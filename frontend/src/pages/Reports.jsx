import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { reportAPI } from '../api/reports';
import { stagger, fadeUp } from '../lib/motion';
import '../styles/dashboard.css';

const reportTypes = [
  { id: 'repository', title: 'Repository Report', desc: 'Detailed analysis of individual repositories', icon: '&#128218;' },
  { id: 'team', title: 'Team Report', desc: 'Team performance and collaboration metrics', icon: '&#128101;' },
  { id: 'risk', title: 'Risk Report', desc: 'Comprehensive risk assessment across projects', icon: '&#9888;' },
  { id: 'health', title: 'Health Report', desc: 'Overall software health and quality metrics', icon: '&#128154;' },
  { id: 'monthly', title: 'Monthly Analytics', desc: 'Monthly summary of all activities and trends', icon: '&#128200;' },
];

const recentReports = [
  { name: 'Q4 2025 Risk Assessment', type: 'Risk Report', date: 'Dec 15, 2025', size: '2.4 MB', format: 'PDF' },
  { name: 'Monthly Analytics - November', type: 'Monthly', date: 'Dec 1, 2025', size: '1.8 MB', format: 'Excel' },
  { name: 'facebook/react Health Report', type: 'Repository', date: 'Nov 28, 2025', size: '890 KB', format: 'PDF' },
  { name: 'Team Performance Q4', type: 'Team', date: 'Nov 20, 2025', size: '1.2 MB', format: 'CSV' },
];

export default function Reports() {
  const [generating, setGenerating] = useState(null);

  const download = async (id, format) => {
    setGenerating(`${id}-${format}`);
    try {
      if (format === 'pdf') await reportAPI.downloadPDF(id);
      else if (format === 'excel') await reportAPI.downloadExcel(id);
      else if (format === 'csv') await reportAPI.downloadCSV(id);
    } catch (err) {
      console.error('Download failed:', err);
    }
    setGenerating(null);
  };

  return (
    <motion.div className="page" initial="hidden" animate="show" variants={stagger}>
      <motion.h1 className="page-heading" variants={fadeUp}>Reports</motion.h1>
      <motion.p className="page-sub" variants={fadeUp}>Generate and download detailed analytics reports</motion.p>

      <div className="section-title"><h2>Generate Report</h2></div>
      <motion.div className="report-types-grid" variants={stagger}>
        {reportTypes.map((r) => (
          <motion.div key={r.id} className="glass report-type-card" variants={fadeUp} whileHover={{ y: -3 }}>
            <span className="report-icon" dangerouslySetInnerHTML={{ __html: r.icon }} />
            <h4>{r.title}</h4>
            <p>{r.desc}</p>
            <div className="report-actions">
              <button className="btn btn-ghost" type="button" onClick={() => download(r.id, 'pdf')} style={{ fontSize: 12, padding: '8px 12px' }}>
                {generating === `${r.id}-pdf` ? 'Generating...' : 'PDF'}
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => download(r.id, 'excel')} style={{ fontSize: 12, padding: '8px 12px' }}>
                {generating === `${r.id}-excel` ? 'Generating...' : 'Excel'}
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => download(r.id, 'csv')} style={{ fontSize: 12, padding: '8px 12px' }}>
                {generating === `${r.id}-csv` ? 'Generating...' : 'CSV'}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="section-title"><h2>Recent Reports</h2></div>
      <motion.div className="glass" style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }} variants={fadeUp}>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Report Name</th><th>Type</th><th>Date</th><th>Size</th><th>Format</th><th></th></tr>
            </thead>
            <tbody>
              {recentReports.map((r) => (
                <tr key={r.name}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td><span className="badge green">{r.type}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{r.date}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{r.size}</td>
                  <td>{r.format}</td>
                  <td><button className="btn btn-ghost" type="button" style={{ fontSize: 12, padding: '6px 12px' }}>Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
