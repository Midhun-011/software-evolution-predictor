/* Shared Framer Motion variants for consistent fade-in / slide-up. */

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.99 },
};
