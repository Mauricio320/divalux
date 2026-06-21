'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { slideUp } from '@/lib/motion'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export default function PageTransition({ children, className }: PageTransitionProps) {
  const reduced = useReducedMotion()
  const pathname = usePathname()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className={className}
        variants={slideUp}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
