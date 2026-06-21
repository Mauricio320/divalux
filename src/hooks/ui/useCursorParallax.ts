'use client'

import { useCallback, useRef } from 'react'
import { useMotionValue, useReducedMotion, useSpring, type MotionValue } from 'framer-motion'

type CursorParallax = {
  ref: React.RefObject<HTMLDivElement | null>
  onMouseMove: (e: React.MouseEvent) => void
  onMouseLeave: () => void
  x: MotionValue<number>
  y: MotionValue<number>
  active: boolean
}

const SPRING = { stiffness: 60, damping: 18, mass: 0.6 }

export function useCursorParallax(): CursorParallax {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING)
  const y = useSpring(rawY, SPRING)

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      rawX.set((e.clientX - rect.left) / rect.width - 0.5)
      rawY.set((e.clientY - rect.top) / rect.height - 0.5)
    },
    [rawX, rawY],
  )

  const onMouseLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  return { ref, onMouseMove, onMouseLeave, x, y, active: !reduced }
}
