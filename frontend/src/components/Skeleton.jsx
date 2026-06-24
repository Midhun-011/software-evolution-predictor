import React from 'react';

export default function Skeleton({ height = 120, radius = 18 }) {
  return <div className="skeleton" style={{ height, borderRadius: radius }} />;
}

export function StatSkeleton() {
  return (
    <div className="stats-grid">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="skeleton" style={{ height: 130, borderRadius: 18 }} />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="charts-grid">
      <div className="skeleton" style={{ height: 300, borderRadius: 18 }} />
      <div className="skeleton" style={{ height: 300, borderRadius: 18 }} />
      <div className="skeleton" style={{ height: 300, borderRadius: 18 }} />
    </div>
  );
}
