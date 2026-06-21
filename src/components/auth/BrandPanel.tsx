'use client'

import { motion, useReducedMotion, useTransform } from 'framer-motion'
import Logo from '@/components/ui/Logo'
import OrganicBackground from './OrganicBackground'
import BrandSparkles from './BrandSparkles'
import { breathe } from '@/lib/motion'
import { useCursorParallax } from '@/hooks/ui/useCursorParallax'

export default function BrandPanel() {
  const reduced = useReducedMotion()
  const { ref, onMouseMove, onMouseLeave, x, y, active } = useCursorParallax()
  const rotateY = useTransform(x, [-0.5, 0.5], [5, -5])
  const rotateX = useTransform(y, [-0.5, 0.5], [-4, 4])

  return (
    <div
      ref={ref}
      onMouseMove={active ? onMouseMove : undefined}
      onMouseLeave={active ? onMouseLeave : undefined}
      style={{ perspective: 800 }}
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-verde-800 p-12"
    >
      <OrganicBackground
        parallaxX={active ? x : undefined}
        parallaxY={active ? y : undefined}
      />
      <BrandSparkles />

      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.96 }}
        animate={reduced ? false : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center gap-6 text-center"
      >
        <motion.div
          style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative"
        >
          <motion.div animate={reduced ? undefined : breathe}>
            <Logo variant="full-white" height={88} priority />
          </motion.div>
        </motion.div>
        <p className="font-serif text-2xl font-medium tracking-wide text-dorado-200">
          Poder Natural
        </p>
      </motion.div>
    </div>
  )
}
