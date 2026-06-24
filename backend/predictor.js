function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

const sampleRepos = [
  { id: 1, fullName: 'facebook/react' },
  { id: 2, fullName: 'microsoft/typescript' },
  { id: 3, fullName: 'vercel/next.js' },
  { id: 4, fullName: 'expressjs/express' },
  { id: 5, fullName: 'rust-lang/rust' }
];

const summaryMetrics = {
  totalRepositories: sampleRepos.length,
  averageHealthScore: 72,
  riskDistribution: {
    Low: 2,
    Medium: 2,
    High: 1
  }
};

function predictFromMetrics(input) {
  const {
    projectName = 'project',
    language = 'unknown',
    linesOfCode = 0,
    ageInMonths = 0,
    numberOfContributors = 1,
    openIssues = 0,
    testCoverage = 0,
    hasCI = false,
    commitFrequencyPerMonth = 0
  } = input;

  // Basic heuristic scoring
  let score = 100;

  // Large codebases tend to have more risk
  score -= clamp(linesOfCode / 10000 * 20, 0, 25);

  // Older projects tend to be more stable
  score += clamp(ageInMonths / 12 * 5, 0, 15);

  // More contributors increases coordination risk
  score -= clamp((numberOfContributors - 1) * 3, 0, 25);

  // Open issues reduce score
  score -= clamp(openIssues / 50 * 10, 0, 20);

  // Test coverage improves score
  score += clamp(testCoverage / 100 * 30, 0, 30);

  // CI helps
  if (hasCI) score += 5;

  // Frequent commits indicate active project (slightly better)
  score += clamp(Math.min(commitFrequencyPerMonth, 50) / 50 * 10, 0, 10);

  score = Math.round(clamp(score, 0, 100));

  let riskLevel = 'Low';
  if (score < 40) riskLevel = 'High';
  else if (score < 70) riskLevel = 'Medium';

  const recommendations = [];
  if (testCoverage < 60) recommendations.push('Improve automated test coverage');
  if (!hasCI) recommendations.push('Add CI/CD pipeline');
  if (openIssues > 20) recommendations.push('Triage and reduce open issues');
  if (numberOfContributors > 10) recommendations.push('Improve contributor onboarding and communication');
  if (linesOfCode > 500000) recommendations.push('Consider modularization/refactoring to reduce complexity');

  return {
    projectName,
    language,
    healthScore: score,
    riskLevel,
    recommendations
  };
}

module.exports = { predictFromMetrics, sampleRepos, summaryMetrics };
