import type { Variants } from 'framer-motion';

/* ─── Page Transitions ───────────────────────────────── */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0, y: -10, scale: 0.98,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

/* ─── Stagger ────────────────────────────────────────── */
export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.055, delayChildren: 0.06 } },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.96 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ─── Fade ───────────────────────────────────────────── */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

/* ─── Pop In (spring bounce) ─────────────────────────── */
export const popIn: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1, opacity: 1,
    transition: { type: 'spring', stiffness: 380, damping: 20 },
  },
  exit: { scale: 0.85, opacity: 0, transition: { duration: 0.15 } },
};

/* ─── Slide Up ───────────────────────────────────────── */
export const slideUp: Variants = {
  initial: { y: '100%', opacity: 0 },
  animate: {
    y: 0, opacity: 1,
    transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    y: '100%', opacity: 0,
    transition: { duration: 0.28, ease: 'easeIn' },
  },
};

/* ─── Number Flip ────────────────────────────────────── */
export const numberFlip: Variants = {
  initial: { y: -20, opacity: 0, scale: 0.9 },
  animate: {
    y: 0, opacity: 1, scale: 1,
    transition: { type: 'spring', stiffness: 500, damping: 28 },
  },
  exit: {
    y: 20, opacity: 0, scale: 0.9,
    transition: { duration: 0.12 },
  },
};

/* ─── Slide X (left-to-right digit swap) ─────────────── */
export const slideX: Variants = {
  initial: { x: 24, opacity: 0 },
  animate: {
    x: 0, opacity: 1,
    transition: { type: 'spring', stiffness: 420, damping: 32 },
  },
  exit: {
    x: -24, opacity: 0,
    transition: { duration: 0.14, ease: 'easeIn' },
  },
};

/* ─── Button Pop ─────────────────────────────────────── */
export const buttonPop: Variants = {
  initial: { scale: 0.7, opacity: 0 },
  animate: {
    scale: 1, opacity: 1,
    transition: { type: 'spring', stiffness: 400, damping: 22 },
  },
};

/* ─── Glow Pulse (for logo orb) ──────────────────────── */
export const glowPulse: Variants = {
  animate: {
    scale: [1, 1.04, 1],
    transition: { duration: 2.5, ease: 'easeInOut', repeat: Infinity },
  },
};

/* ─── Tap scales ─────────────────────────────────────── */
export const scaleTap = { scale: 0.94 };
export const scaleTapSmall = { scale: 0.90 };
export const scaleTapCircle = { scale: 0.88 };

/* ─── Bottom Sheet ───────────────────────────────────── */
export const sheetVariants: Variants = {
  initial: { y: '100%' },
  animate: {
    y: 0,
    transition: { duration: 0.36, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.24, ease: 'easeIn' },
  },
};

/* ─── Keypad row stagger ─────────────────────────────── */
export const keypadContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

export const keypadRow: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1, y: 0,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
};
