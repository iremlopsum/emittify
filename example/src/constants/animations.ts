import type { Transition } from 'motion/react'

// ==================== SPRING CONFIGURATIONS ====================

export const SPRING_CONFIG: Transition = {
  mass: 2,
  damping: 50,
  type: 'spring',
  stiffness: 350,
}

export const BOUNCE_CONFIG: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 10,
  mass: 1,
}

// ==================== MOTION VARIANTS ====================

export const FADE_IN_MOTION = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
}

export const FADE_UP_MOTION = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
}

export const FADE_UP_VIEW_MOTION = {
  initial: { opacity: 0, y: 100 },
  whileInView: { opacity: 1, y: 0 },
}

export const FADE_LEFT_MOTION = {
  initial: { opacity: 0, x: -100 },
  whileInView: { opacity: 1, x: 0 },
}

export const FADE_RIGHT_MOTION = {
  initial: { opacity: 0, x: 100 },
  whileInView: { opacity: 1, x: 0 },
}

export const FADE_ONLY_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

export const TOAST_MOTION = {
  initial: { opacity: 0, x: 100, scale: 0.8 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 100, scale: 0.8 },
}

export const SUBSCRIBER_CARD_MOTION = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
}

export const PARTICLE_MOTION = {
  initial: { opacity: 1, scale: 1 },
  animate: { opacity: 0, scale: 0 },
}

// ==================== HOVER ANIMATIONS ====================

export const HOVER_SCALE_SMALL = {
  scale: 1.01,
}

export const HOVER_SCALE_MEDIUM = {
  scale: 1.02,
}

export const HOVER_SCALE_LARGE = {
  scale: 1.05,
}

export const HOVER_LIFT = {
  y: -4,
}

// ==================== PULSE/BREATHING ANIMATIONS ====================

export const PULSE_SCALE_MOTION = {
  scale: [1, 1.05, 1],
}

export const BLOB_BREATHING_MOTION = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.3, 0.5, 0.3],
  },
}

// ==================== ROTATING ANIMATIONS ====================

export const SPIN_INFINITE: Transition = {
  duration: 2,
  repeat: Infinity,
  ease: 'linear',
}

// ==================== OTHER TRANSITIONS ====================

export const QUICK_TRANSITION: Transition = {
  duration: 0.3,
}

export const EASE_OUT_TRANSITION: Transition = {
  duration: 2,
  ease: 'easeOut',
}

export const EASE_INOUT_BREATHING: Transition = {
  duration: 8,
  repeat: Infinity,
  ease: 'easeInOut',
}
