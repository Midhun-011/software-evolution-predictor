import {
  Chart,
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
);

Chart.defaults.color = '#9aa6c2';
Chart.defaults.font.family =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif";
Chart.defaults.font.size = 12;

export const tooltipStyle = {
  backgroundColor: 'rgba(10, 16, 32, 0.95)',
  borderColor: 'rgba(139, 92, 246, 0.4)',
  borderWidth: 1,
  titleColor: '#e8eefc',
  bodyColor: '#c7d0e6',
  padding: 12,
  cornerRadius: 10,
  displayColors: true,
  boxPadding: 4,
};
