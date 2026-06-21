import type { TargetAndTransition, Transition, Variants } from 'framer-motion'

export const TRANSITION: Transition = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1],
}

export const infiniteEase: Transition = {
  repeat: Infinity,
  ease: 'easeInOut',
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: TRANSITION },
  exit: { opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: TRANSITION },
  exit: { opacity: 0, y: 4, transition: { duration: 0.15, ease: 'easeIn' } },
}

export const scaleTap = {
  scale: 0.97,
  transition: { duration: 0.1, ease: 'easeInOut' },
}

export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
}

export const drawerLeft: Variants = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: '-100%', transition: { duration: 0.2, ease: 'easeIn' } },
}

export const modalPanel: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 4,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
}

export const toastIn: Variants = {
  hidden: { opacity: 0, x: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    x: 16,
    scale: 0.97,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

export const shake: Variants = {
  idle: { x: 0 },
  shake: {
    x: [0, -6, 6, -4, 4, 0],
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
}

export const breathe: TargetAndTransition = {
  scale: [1, 1.015, 1],
  transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
}
