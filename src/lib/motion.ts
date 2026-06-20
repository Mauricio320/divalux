import type { Transition, Variants } from 'framer-motion'

export const TRANSITION: Transition = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1],
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
