'use client'

import { motion, useReducedMotion } from 'framer-motion'

type Firefly = {
  left: string
  size: number
  duration: number
  delay: number
  rise: string
  wander: number
}

const FIREFLIES: Firefly[] = [
  { left: '24%', size: 5, duration: 7.5, delay: 0, rise: '-72vh', wander: 26 },
  { left: '40%', size: 4, duration: 9, delay: 1.6, rise: '-82vh', wander: 16 },
  { left: '52%', size: 6, duration: 8, delay: 0.8, rise: '-68vh', wander: -10 },
  { left: '64%', size: 4, duration: 10, delay: 2.4, rise: '-80vh', wander: -22 },
  { left: '78%', size: 5, duration: 8.5, delay: 1.2, rise: '-74vh', wander: -30 },
  { left: '33%', size: 3, duration: 11, delay: 3, rise: '-86vh', wander: 20 },
]

export default function BrandSparkles() {
  const reduced = useReducedMotion()
  if (reduced) return null

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {FIREFLIES.map((f, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-dorado-200"
          style={{
            left: f.left,
            bottom: -12,
            width: f.size,
            height: f.size,
            boxShadow: '0 0 6px 1.5px var(--color-dorado-200)',
          }}
          initial={{ opacity: 0, x: 0, y: '0vh' }}
          animate={{
            opacity: [0, 0.9, 0.45, 1, 0.4, 0.8, 0],
            x: [0, f.wander * 0.4, f.wander * -0.2, f.wander],
            y: ['0vh', f.rise],
          }}
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}
