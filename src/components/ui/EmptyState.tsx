import type { ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/cn'

type Props = {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({ title, description, action, className }: Props) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-3 px-6 py-16 text-center',
        className,
      )}
    >
      <Image
        src="/brand/divailux-mark.svg"
        alt=""
        aria-hidden="true"
        width={96}
        height={96}
        className="pointer-events-none absolute opacity-10 dark:opacity-[0.08] select-none"
      />

      <p className="relative z-10 text-base font-medium text-fg">{title}</p>

      {description && (
        <p className="relative z-10 max-w-xs text-sm text-fg-muted">{description}</p>
      )}

      {action && <div className="relative z-10 mt-2">{action}</div>}
    </div>
  )
}
