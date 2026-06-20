import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

type CardProps = {
  padding?: boolean
  className?: string
  children?: ReactNode
}

type HeaderProps = {
  title?: string
  subtitle?: string
  action?: ReactNode
  children?: ReactNode
  className?: string
}

type BodyProps = {
  children?: ReactNode
  className?: string
}

type FooterProps = {
  children?: ReactNode
  className?: string
}

function CardHeader({ title, subtitle, action, children, className }: HeaderProps) {
  if (children) {
    return (
      <div className={cn('px-5 py-4 border-b border-border', className)}>
        {children}
      </div>
    )
  }

  return (
    <div className={cn('px-5 py-4 border-b border-border flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        {title && (
          <p className="text-base font-semibold text-fg leading-snug">{title}</p>
        )}
        {subtitle && (
          <p className="text-sm text-fg-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

function CardBody({ children, className }: BodyProps) {
  return (
    <div className={cn('p-5', className)}>
      {children}
    </div>
  )
}

function CardFooter({ children, className }: FooterProps) {
  return (
    <div className={cn('px-5 py-4 border-t border-border', className)}>
      {children}
    </div>
  )
}

function Card({ padding = false, className, children }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-xl shadow-sm',
        padding && 'p-5',
        className
      )}
    >
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card
