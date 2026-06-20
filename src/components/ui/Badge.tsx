import { cn } from '@/lib/cn'

type BadgeVariant = 'neutral' | 'success' | 'danger' | 'info' | 'warning' | 'gold'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral:
    'bg-surface-2 text-fg-muted border border-border dark:bg-surface-3 dark:text-fg-muted dark:border-border',
  success:
    'bg-verde-100 text-verde-800 dark:bg-verde-900/40 dark:text-verde-200',
  danger:
    'bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger',
  info:
    'bg-verde-50 text-verde-700 dark:bg-verde-900/30 dark:text-verde-300',
  warning:
    'bg-dorado-100 text-dorado-800 dark:bg-dorado-900/40 dark:text-dorado-300',
  gold:
    'bg-dorado-100 text-dorado-800 border border-gold dark:bg-dorado-900/40 dark:text-dorado-300 dark:border-gold',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

export default function Badge({
  variant = 'neutral',
  size = 'md',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
