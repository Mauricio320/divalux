'use client'

import { motion } from 'framer-motion'

type Leaf = {
  left: string
  size: number
  colorClass: string
  duration: number
  delay: number
}

const LEAVES: Leaf[] = [
  { left: '18%', size: 26, colorClass: 'text-login-gold', duration: 17, delay: 0 },
  { left: '72%', size: 22, colorClass: 'text-verde-400', duration: 21, delay: 5 },
  { left: '48%', size: 30, colorClass: 'text-dorado-300', duration: 19, delay: 9 },
  { left: '30%', size: 38, colorClass: 'text-verde-400', duration: 14, delay: 2 },
  { left: '64%', size: 28, colorClass: 'text-login-gold', duration: 16, delay: 7 },
]

const LEAF_PATH = 'M50 8 C24 30 24 70 50 92 C76 70 76 30 50 8 Z'

export default function FallingLeaves({ reduced }: { reduced: boolean }) {
  if (reduced) return null

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {LEAVES.map((l, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 100 100"
          className={`absolute ${l.colorClass}`}
          style={{ left: l.left, top: 0, width: l.size, height: l.size }}
          initial={{ y: '-12vh', rotate: 0, opacity: 0 }}
          animate={{ y: '112vh', rotate: 300, opacity: [0, 0.85, 0.85, 0] }}
          transition={{
            duration: l.duration,
            delay: l.delay,
            repeat: Infinity,
            ease: 'linear',
            opacity: {
              duration: l.duration,
              delay: l.delay,
              repeat: Infinity,
              times: [0, 0.12, 0.86, 1],
              ease: 'linear',
            },
          }}
        >
          <path d={LEAF_PATH} fill="currentColor" />
          <path d="M50 12 L50 88" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        </motion.svg>
      ))}
    </div>
  )
}
