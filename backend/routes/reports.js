const express = require('express');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { verifyToken } = require('../middleware/auth');
const { isConnected } = require('../config/db');
const { logActivity } = require('../utils/logActivity');
const { sampleRepos, summaryMetrics, predictFromMetrics } = require('../predictor');

const router = express.Router();

function getRepoData(userId) {
  return sampleRepos.map((r) => {
    const prediction = predictFromMetrics({
      projectName: r.fullName,
      linesOfCode: Math.floor(Math.random() * 300000),
      ageInMonths: Math.floor(Math.random() * 100),
      numberOfContributors: Math.floor(Math.random() * 50),
      openIssues: Math.floor(Math.random() * 200),
      testCoverage: Math.floor(Math.random() * 100),
      hasCI: true,
      commitFrequencyPerMonth: Math.floor(Math.random() * 100),
    });
    return { ...r, ...prediction };
  });
}

// Generate PDF report
router.get('/pdf/:type', verifyToken, async (req, res) => {
  const type = req.params.type;
  const repos = getRepoData(req.user.id);

  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${type}-report.pdf`);
  doc.pipe(res);

  doc.fontSize(22).text(`Software Evolution Predictor`, { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(14).fillColor('#6366f1').text(`${type.charAt(0).toUpperCase() + type.slice(1)} Report`, { align: 'center' });
  doc.fillColor('#333');
  doc.moveDown(0.5);
  doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.moveDown(1);

  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ddd');
  doc.moveDown(0.5);

  if (type === 'repository' || type === 'health' || type === 'risk') {
    doc.fontSize(12).text('Repository Analysis', { underline: true });
    doc.moveDown(0.5);
    repos.forEach((r) => {
      doc.fontSize(11).fillColor('#222').text(r.projectName || r.fullName, { continued: true });
      doc.fillColor('#666').text(`  — Health: ${r.healthScore}  Risk: ${r.riskLevel}`);
      if (r.recommendations && r.recommendations.length > 0) {
        r.recommendations.forEach((rec) => {
          doc.fontSize(9).fillColor('#888').text(`    • ${rec}`);
        });
      }
      doc.moveDown(0.3);
    });
  }

  if (type === 'team') {
    doc.fontSize(12).text('Team Summary', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Total Repositories: ${summaryMetrics.totalRepositories}`);
    doc.text(`Average Health Score: ${summaryMetrics.averageHealthScore}`);
    doc.text(`Risk Distribution: Low ${summaryMetrics.riskDistribution.Low}, Medium ${summaryMetrics.riskDistribution.Medium}, High ${summaryMetrics.riskDistribution.High}`);
  }

  if (type === 'monthly') {
    doc.fontSize(12).text('Monthly Analytics Summary', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Period: ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`);
    doc.text(`Total Repositories: ${summaryMetrics.totalRepositories}`);
    doc.text(`Average Health: ${summaryMetrics.averageHealthScore}`);
    doc.moveDown(0.5);
    doc.fontSize(12).text('Per-Repository Details', { underline: true });
    doc.moveDown(0.3);
    repos.forEach((r) => {
      doc.fontSize(10).fillColor('#222').text(`${r.projectName || r.fullName}: Health ${r.healthScore}, Risk ${r.riskLevel}`);
    });
  }

  doc.end();
  await logActivity(req.user.id, 'Report Generated', `Generated ${type} PDF report`, 'report', req.ip);
});

// Generate Excel report
router.get('/excel/:type', verifyToken, async (req, res) => {
  const type = req.params.type;
  const repos = getRepoData(req.user.id);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Software Evolution Predictor';
  const sheet = workbook.addWorksheet(`${type} Report`);

  sheet.columns = [
    { header: 'Repository', key: 'name', width: 30 },
    { header: 'Language', key: 'language', width: 15 },
    { header: 'Health Score', key: 'health', width: 15 },
    { header: 'Risk Level', key: 'risk', width: 15 },
    { header: 'Recommendations', key: 'recs', width: 50 },
  ];

  sheet.getRow(1).font = { bold: true };

  repos.forEach((r) => {
    sheet.addRow({
      name: r.projectName || r.fullName,
      language: r.language || 'Unknown',
      health: r.healthScore,
      risk: r.riskLevel,
      recs: (r.recommendations || []).join('; '),
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${type}-report.xlsx`);
  await workbook.xlsx.write(res);
  res.end();
  await logActivity(req.user.id, 'Report Generated', `Generated ${type} Excel report`, 'report', req.ip);
});

// Generate CSV report
router.get('/csv/:type', verifyToken, async (req, res) => {
  const repos = getRepoData(req.user.id);
  const rows = [['Repository', 'Language', 'Health Score', 'Risk Level', 'Recommendations']];
  repos.forEach((r) => {
    rows.push([
      r.projectName || r.fullName,
      r.language || 'Unknown',
      r.healthScore,
      r.riskLevel,
      (r.recommendations || []).join('; '),
    ]);
  });
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.type}-report.csv`);
  res.send(csv);
  await logActivity(req.user.id, 'Report Generated', `Generated ${req.params.type} CSV report`, 'report', req.ip);
});

module.exports = router;
