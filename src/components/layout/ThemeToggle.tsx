'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTheme } from '@/hooks/ui/useTheme'

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const reduced = useReducedMotion()

  const isDark = theme === 'dark'

  return (
    <motion.button
      type="button"
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-pressed={isDark}
      onClick={toggle}
      whileTap={reduced ? undefined : { scale: 0.92, transition: { duration: 0.1, ease: 'easeInOut' } }}
      className={cn(
        'inline-flex items-center justify-center rounded-lg p-2',
        'text-fg-muted hover:bg-surface-2 hover:text-fg',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
    >
      {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </motion.button>
  )
}
