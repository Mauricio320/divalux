'use client'

import { forwardRef } from 'react'
import { motion, useReducedMotion, type TargetAndTransition } from 'framer-motion'
import { cn } from '@/lib/cn'
import Spinner from '@/components/ui/Spinner'

const SCALE_TAP: TargetAndTransition = {
  scale: 0.97,
  transition: { duration: 0.1, ease: 'easeInOut' },
}

const variantClasses = {
  primary:
    'bg-primary text-primary-fg hover:bg-primary-hover',
  secondary:
    'bg-surface text-fg border border-border-strong hover:bg-surface-2',
  ghost:
    'text-fg hover:bg-surface-2',
  danger:
    'bg-danger text-danger-fg hover:bg-danger-hover',
} as const

const sizeClasses = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
} as const

type HTMLButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDragStart' | 'onAnimationStart'
>

interface ButtonProps extends HTMLButtonProps {
  variant?: keyof typeof variantClasses
  size?: keyof typeof sizeClasses
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className,
    children,
    ...rest
  },
  ref,
) {
  const reduced = useReducedMotion()
  const isDisabled = disabled || isLoading

  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-lg font-medium',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className,
  )

  return (
    <motion.button
      ref={ref}
      whileTap={reduced || isDisabled ? undefined : SCALE_TAP}
      disabled={isDisabled}
      className={baseClasses}
      {...rest}
    >
      {isLoading ? (
        <Spinner size="sm" />
      ) : leftIcon != null ? (
        <span className="inline-flex shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon != null && (
        <span className="inline-flex shrink-0">{rightIcon}</span>
      )}
    </motion.button>
  )
})

export default Button
