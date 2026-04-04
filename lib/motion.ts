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

/** Slower stagger for hero / Wadi Yemm text rows. */
export const revealStagger = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.11, delayChildren: 0.08 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  },
};

export const revealStaggerReduced = {
  container: {
    hidden: { opacity: 1 },
    show: { opacity: 1 },
  },
  item: {
    hidden: { opacity: 1, y: 0 },
    show: { opacity: 1, y: 0 },
  },
};
