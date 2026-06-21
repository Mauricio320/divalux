'use client'

import { motion, useReducedMotion } from 'framer-motion'

type Firefly = {
  left: string
  size: number
  duration: number
  delay: number
  from: string
  rise: string
  wander: number
}

const FIREFLIES: Firefly[] = [
  { left: '24%', size: 5, duration: 7.5, delay: 0, from: '0vh', rise: '-72vh', wander: 26 },
  { left: '40%', size: 4, duration: 9, delay: 1.6, from: '0vh', rise: '-82vh', wander: 16 },
  { left: '52%', size: 6, duration: 8, delay: 0.8, from: '0vh', rise: '-68vh', wander: -10 },
  { left: '64%', size: 4, duration: 10, delay: 2.4, from: '0vh', rise: '-80vh', wander: -22 },
  { left: '78%', size: 5, duration: 8.5, delay: 1.2, from: '0vh', rise: '-74vh', wander: -30 },
  { left: '33%', size: 3, duration: 11, delay: 3, from: '0vh', rise: '-86vh', wander: 20 },
]

const COMPACT_FIREFLIES: Firefly[] = [
  { left: '26%', size: 4, duration: 5.5, delay: 0, from: '0px', rise: '-120px', wander: 14 },
  { left: '46%', size: 3, duration: 6.5, delay: 1.1, from: '0px', rise: '-140px', wander: -8 },
  { left: '60%', size: 4, duration: 6, delay: 0.5, from: '0px', rise: '-110px', wander: 10 },
  { left: '74%', size: 3, duration: 7, delay: 1.7, from: '0px', rise: '-132px', wander: -12 },
]

export default function BrandSparkles({ compact = false }: { compact?: boolean }) {
  const reduced = useReducedMotion()
  if (reduced) return null

  const fireflies = compact ? COMPACT_FIREFLIES : FIREFLIES

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {fireflies.map((f, i) => (
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
          initial={{ opacity: 0, x: 0, y: f.from }}
          animate={{
            opacity: [0, 0.9, 0.45, 1, 0.4, 0.8, 0],
            x: [0, f.wander * 0.4, f.wander * -0.2, f.wander],
            y: [f.from, f.rise],
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
