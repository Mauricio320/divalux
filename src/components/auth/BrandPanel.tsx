'use client'

import { motion, useReducedMotion, useTransform } from 'framer-motion'
import Logo from '@/components/ui/Logo'
import OrganicBackground from './OrganicBackground'
import BrandSparkles from './BrandSparkles'
import { breathe } from '@/lib/motion'
import { useCursorParallax } from '@/hooks/ui/useCursorParallax'
import { cn } from '@/lib/cn'

type Props = {
  compact?: boolean
}

export default function BrandPanel({ compact = false }: Props) {
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
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden bg-verde-800',
        compact ? 'w-full px-6 py-7' : 'h-full w-full p-12',
      )}
    >
      <OrganicBackground
        compact={compact}
        parallaxX={active ? x : undefined}
        parallaxY={active ? y : undefined}
      />
      <BrandSparkles compact={compact} />

      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.96 }}
        animate={reduced ? false : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'relative z-10 flex flex-col items-center text-center',
          compact ? 'gap-2' : 'gap-6',
        )}
      >
        <motion.div
          style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative"
        >
          <motion.div animate={reduced ? undefined : breathe}>
            <Logo variant="full-white" height={compact ? 40 : 88} priority />
          </motion.div>
        </motion.div>
        <p
          className={cn(
            'font-serif font-medium tracking-wide text-dorado-200',
            compact ? 'text-base' : 'text-2xl',
          )}
        >
          Poder Natural
        </p>
      </motion.div>
    </div>
  )
}
