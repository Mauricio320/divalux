'use client'

import { motion } from 'framer-motion'

type Firefly = {
  dir: number
  orbit: number
  start: number
  reach: number
  reachDur: number
  dotLeft: number
  size: number
  glow: number
}

const FIREFLIES: Firefly[] = [
  { dir: 1, orbit: 17, start: 0, reach: 170, reachDur: 7, dotLeft: 120, size: 6, glow: 4.2 },
  { dir: -1, orbit: 24, start: 64, reach: 140, reachDur: 9, dotLeft: 150, size: 5, glow: 5 },
  { dir: 1, orbit: 30, start: 128, reach: 120, reachDur: 8, dotLeft: 180, size: 7, glow: 4.6 },
  { dir: -1, orbit: 20, start: 196, reach: 150, reachDur: 6.5, dotLeft: 130, size: 4, glow: 3.8 },
  { dir: 1, orbit: 27, start: 252, reach: 140, reachDur: 10, dotLeft: 160, size: 5, glow: 5.4 },
  { dir: -1, orbit: 15, start: 312, reach: 150, reachDur: 7.5, dotLeft: 100, size: 6, glow: 4 },
]

export default function Fireflies({ reduced }: { reduced: boolean }) {
  if (reduced) return null

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[3]">
      <div
        className="absolute left-1/2 top-[44%]"
        style={{ transform: 'translate(-50%, -50%) scaleY(0.6)' }}
      >
        {FIREFLIES.map((f, i) => (
          <motion.div
            key={i}
            className="absolute left-0 top-0"
            style={{ rotate: f.start }}
            animate={{ rotate: f.start + f.dir * 360 }}
            transition={{ duration: f.orbit, repeat: Infinity, ease: 'linear' }}
          >
            <motion.div
              className="absolute left-0 top-0"
              animate={{ x: [0, f.reach, 0] }}
              transition={{ duration: f.reachDur, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.span
                className="absolute top-0 block rounded-full bg-login-firefly"
                style={{
                  left: f.dotLeft,
                  width: f.size,
                  height: f.size,
                  boxShadow: 'var(--login-firefly-glow)',
                }}
                animate={{ opacity: [0.1, 1, 0.1] }}
                transition={{ duration: f.glow, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
