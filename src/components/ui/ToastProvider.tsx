'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { toastIn } from '@/lib/motion'
import { cn } from '@/lib/cn'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  type: ToastType
  message: string
}

interface ToastContextValue {
  toast: (opts: { type: ToastType; message: string }) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const ICON_CLASS: Record<ToastType, string> = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-info',
}

const BORDER_CLASS: Record<ToastType, string> = {
  success: 'border-l-success',
  error: 'border-l-danger',
  info: 'border-l-primary',
}

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: number) => void
  reduced: boolean | null
}

function ToastItem({ toast, onDismiss, reduced }: ToastItemProps) {
  const Icon = toast.type === 'success' ? CheckIcon : toast.type === 'error' ? XCircleIcon : InfoIcon

  const content = (
    <div
      role="status"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'flex items-start gap-3 bg-surface border border-border border-l-4 rounded-lg shadow-lg px-4 py-3 text-sm text-fg w-80 max-w-[calc(100vw-2rem)]',
        BORDER_CLASS[toast.type],
      )}
    >
      <span className={cn('mt-0.5 shrink-0', ICON_CLASS[toast.type])}>
        <Icon />
      </span>
      <p className="flex-1 leading-snug">{toast.message}</p>
      <button
        type="button"
        aria-label="Cerrar notificación"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 mt-0.5 text-fg-subtle hover:text-fg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
      >
        <CloseIcon />
      </button>
    </div>
  )

  if (reduced) return content

  return (
    <motion.div
      key={toast.id}
      variants={toastIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {content}
    </motion.div>
  )
}

interface ToastProviderProps {
  children: React.ReactNode
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())
  const reduced = useReducedMotion()

  const dismiss = useCallback((id: number) => {
    const t = timers.current.get(id)
    if (t !== undefined) clearTimeout(t)
    timers.current.delete(id)
    setToasts((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const toast = useCallback(
    ({ type, message }: { type: ToastType; message: string }) => {
      counter.current += 1
      const id = counter.current
      setToasts((prev) => [...prev, { id, type, message }])
      const timer = setTimeout(() => dismiss(id), 4000)
      timers.current.set(id, timer)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-label="Notificaciones"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end"
      >
        {reduced ? (
          toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} reduced={reduced} />
          ))
        ) : (
          <AnimatePresence mode="sync">
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} onDismiss={dismiss} reduced={reduced} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </ToastContext.Provider>
  )
}
