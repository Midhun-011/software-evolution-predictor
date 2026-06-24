import React from 'react';

/* Lightweight stroke icon set (no extra dependency). */
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const Icon = ({ size = 20, children, ...rest }) => (
  <svg {...base} width={size} height={size} {...rest}>{children}</svg>
);

export const IconGrid = (p) => (
  <Icon {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Icon>
);
export const IconChart = (p) => (
  <Icon {...p}><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16l3-4 3 2 4-6" /></Icon>
);
export const IconRepo = (p) => (
  <Icon {...p}><path d="M4 4h11a3 3 0 0 1 3 3v13" /><path d="M7 20h11" /><path d="M7 4v16" /><path d="M18 17H8a1 1 0 0 0-1 1" /></Icon>
);
export const IconCode = (p) => (
  <Icon {...p}><path d="M8 9l-3 3 3 3" /><path d="M16 9l3 3-3 3" /><path d="M13 6l-2 12" /></Icon>
);
export const IconShield = (p) => (
  <Icon {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9.5 12l1.8 1.8 3.2-3.6" /></Icon>
);
export const IconAlert = (p) => (
  <Icon {...p}><path d="M12 3l9 16H3z" /><path d="M12 10v4" /><path d="M12 17h.01" /></Icon>
);
export const IconBell = (p) => (
  <Icon {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 19a2 2 0 0 0 4 0" /></Icon>
);
export const IconPlus = (p) => (
  <Icon {...p}><path d="M12 5v14" /><path d="M5 12h14" /></Icon>
);
export const IconMenu = (p) => (
  <Icon {...p}><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></Icon>
);
export const IconLogout = (p) => (
  <Icon {...p}><path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></Icon>
);
export const IconSpark = (p) => (
  <Icon {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></Icon>
);
export const IconTrendUp = (p) => (
  <Icon {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M21 7v6h-6" /></Icon>
);
export const IconTrendDown = (p) => (
  <Icon {...p}><path d="M3 7l6 6 4-4 8 8" /><path d="M21 17v-6h-6" /></Icon>
);
export const IconBulb = (p) => (
  <Icon {...p}><path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10c.8.8 1 1.4 1 3h6c0-1.6.2-2.2 1-3a6 6 0 0 0-4-10z" /></Icon>
);
export const IconTarget = (p) => (
  <Icon {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></Icon>
);
export const IconCheck = (p) => (
  <Icon {...p}><path d="M5 12l4 4 10-10" /></Icon>
);
