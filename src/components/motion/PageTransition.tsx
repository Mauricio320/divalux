'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { slideUp } from '@/lib/motion'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export default function PageTransition({ children, className }: PageTransitionProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={slideUp}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}
