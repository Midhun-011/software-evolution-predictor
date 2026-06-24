import React, { useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import '../../lib/chartSetup';
import { tooltipStyle } from '../../lib/chartSetup';

const LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

export default function EvolutionTrendChart({
  health = [62, 65, 64, 70, 72, 75, 73, 78],
  risk = [48, 45, 47, 40, 38, 35, 37, 30],
}) {
  const chartRef = useRef(null);

  const data = useMemo(() => ({
    labels: LABELS,
    datasets: [
      {
        label: 'Health Score',
        data: health,
        borderColor: '#38bdf8',
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#38bdf8',
        backgroundColor: (ctx) => {
          const { ctx: c, chartArea } = ctx.chart;
          if (!chartArea) return 'rgba(56,189,248,0.2)';
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, 'rgba(56,189,248,0.45)');
          g.addColorStop(1, 'rgba(56,189,248,0)');
          return g;
        },
      },
      {
        label: 'Risk Index',
        data: risk,
        borderColor: '#a78bfa',
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#a78bfa',
        backgroundColor: (ctx) => {
          const { ctx: c, chartArea } = ctx.chart;
          if (!chartArea) return 'rgba(167,139,250,0.18)';
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, 'rgba(167,139,250,0.35)');
          g.addColorStop(1, 'rgba(167,139,250,0)');
          return g;
        },
      },
    ],
  }), [health, risk]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    animation: { duration: 900, easing: 'easeOutQuart' },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, padding: 16 },
      },
      tooltip: tooltipStyle,
    },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 25 },
        grid: { color: 'rgba(255,255,255,0.06)' },
        border: { display: false },
      },
    },
  }), []);

  return (
    <div className="chart-canvas-wrap">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}
