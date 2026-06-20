'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { overlayFade, modalPanel } from '@/lib/motion'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  footer?: ReactNode
  className?: string
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export default function Modal({
  open,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  className,
}: ModalProps) {
  const reduced = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = title ? 'modal-title' : undefined

  useEffect(() => {
    if (!open) return

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    panelRef.current?.focus()

    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  const overlayVariants = reduced ? {} : overlayFade
  const panelVariants = reduced ? {} : modalPanel
  const transition = reduced ? { duration: 0 } : undefined

  return (
    <AnimatePresence>
      {open && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            key="overlay"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            variants={overlayVariants}
            initial={reduced ? false : 'hidden'}
            animate="visible"
            exit="exit"
            transition={transition}
            aria-hidden="true"
            onClick={onClose}
          />

          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={cn(
              'relative z-10 w-full',
              sizeClasses[size],
              'bg-surface rounded-xl shadow-xl border border-border',
              'flex flex-col max-h-[90vh]',
              'focus:outline-none',
              className,
            )}
            variants={panelVariants}
            initial={reduced ? false : 'hidden'}
            animate="visible"
            exit="exit"
            transition={transition}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              {title ? (
                <h2
                  id={titleId}
                  className="text-lg font-semibold text-fg"
                >
                  {title}
                </h2>
              ) : (
                <span />
              )}
              <button
                type="button"
                aria-label="Cerrar"
                onClick={onClose}
                className={cn(
                  'rounded-lg p-1.5 text-fg-muted',
                  'hover:bg-surface-2 hover:text-fg',
                  'transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto flex-1 text-fg">
              {children}
            </div>

            {footer && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
