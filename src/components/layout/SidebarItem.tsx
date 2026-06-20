'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SidebarItemProps {
  href: string
  label: string
  icon: LucideIcon
  activo: boolean
  colapsado: boolean
}

export default function SidebarItem({
  href,
  label,
  icon: Icon,
  activo,
  colapsado,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      title={colapsado ? label : undefined}
      aria-current={activo ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        activo
          ? 'bg-primary text-primary-fg'
          : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
        colapsado && 'justify-center px-2',
      )}
    >
      <Icon size={18} aria-hidden="true" className="shrink-0" />
      {!colapsado && <span className="truncate">{label}</span>}
    </Link>
  )
}
