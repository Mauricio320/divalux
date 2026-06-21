'use client'

import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'

type Blob = {
  className: string
  duration: number
  radii: [string, string, string]
  x: [number, number, number]
  y: [number, number, number]
}

const BLOBS: Blob[] = [
  {
    className: 'left-[-6rem] top-[-4rem] h-80 w-80 bg-verde-500/30',
    duration: 18,
    radii: [
      '42% 58% 63% 37% / 41% 44% 56% 59%',
      '67% 33% 47% 53% / 37% 62% 38% 63%',
      '42% 58% 63% 37% / 41% 44% 56% 59%',
    ],
    x: [0, 28, 0],
    y: [0, 20, 0],
  },
  {
    className: 'right-[-5rem] top-[22%] h-72 w-72 bg-verde-400/25',
    duration: 23,
    radii: [
      '63% 37% 54% 46% / 49% 60% 40% 51%',
      '38% 62% 33% 67% / 58% 35% 65% 42%',
      '63% 37% 54% 46% / 49% 60% 40% 51%',
    ],
    x: [0, -24, 0],
    y: [0, 26, 0],
  },
  {
    className: 'bottom-[-7rem] left-[12%] h-96 w-96 bg-dorado-500/20',
    duration: 27,
    radii: [
      '49% 51% 38% 62% / 63% 41% 59% 37%',
      '57% 43% 62% 38% / 38% 57% 43% 62%',
      '49% 51% 38% 62% / 63% 41% 59% 37%',
    ],
    x: [0, 22, 0],
    y: [0, -18, 0],
  },
]

type Props = {
  parallaxX?: MotionValue<number>
  parallaxY?: MotionValue<number>
}

export default function OrganicBackground({ parallaxX, parallaxY }: Props) {
  const reduced = useReducedMotion()
  const fallbackX = useMotionValue(0)
  const fallbackY = useMotionValue(0)
  const tx = useTransform(parallaxX ?? fallbackX, (v) => v * 30)
  const ty = useTransform(parallaxY ?? fallbackY, (v) => v * 30)

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ x: tx, y: ty }}>
        <motion.div
          className="absolute left-[18%] top-[12%] h-112 w-md rounded-full bg-dorado-400/15 blur-3xl"
          animate={
            reduced
              ? undefined
              : { x: [0, 40, -20, 0], y: [0, -28, 18, 0], opacity: [0.5, 0.85, 0.6, 0.5] }
          }
          transition={reduced ? undefined : { duration: 34, repeat: Infinity, ease: 'easeInOut' }}
        />
        {BLOBS.map((blob, i) => (
          <motion.div
            key={i}
            className={`absolute blur-3xl ${blob.className}`}
            style={{ borderRadius: blob.radii[0] }}
            animate={
              reduced
                ? undefined
                : { borderRadius: blob.radii, x: blob.x, y: blob.y, scale: [1, 1.08, 1] }
            }
            transition={
              reduced
                ? undefined
                : { duration: blob.duration, repeat: Infinity, ease: 'easeInOut' }
            }
          />
        ))}
      </motion.div>
    </div>
  )
}
