/**
 * Shared Framer Motion variants for consistent section animations.
 * Use noMotion / noMotionStagger when useReducedMotion() is true.
 */

export const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export const noMotion = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export const fadeInUpStagger = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  },
};

export const noMotionStagger = {
  container: {
    hidden: { opacity: 1 },
    show: { opacity: 1 },
  },
  item: {
    hidden: { opacity: 1, y: 0 },
    show: { opacity: 1, y: 0 },
  },
};
