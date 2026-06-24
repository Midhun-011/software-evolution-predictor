import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import '../../lib/chartSetup';
import { tooltipStyle } from '../../lib/chartSetup';

export default function DoughnutCard({ labels, values, colors, centerNum, centerCap }) {
  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: 'rgba(7,11,22,0.9)',
        borderWidth: 3,
        hoverOffset: 6,
        spacing: 2,
      },
    ],
  }), [labels, values, colors]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    animation: { animateRotate: true, duration: 900, easing: 'easeOutQuart' },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, padding: 14 },
      },
      tooltip: tooltipStyle,
    },
  }), []);

  return (
    <div className="doughnut-wrap">
      <Doughnut data={data} options={options} />
      {centerNum != null && (
        <div className="doughnut-center">
          <div className="num">{centerNum}</div>
          <div className="cap">{centerCap}</div>
        </div>
      )}
    </div>
  );
}
