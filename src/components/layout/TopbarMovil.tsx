'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/cn'
import Logo from '@/components/ui/Logo'
import { useDrawerMovil } from '@/hooks/ui/useDrawerMovil'
import { useTheme } from '@/hooks/ui/useTheme'

export default function TopbarMovil() {
  const { abierto, abrir } = useDrawerMovil()
  const { theme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface px-4 lg:hidden print:hidden">
      <button
        type="button"
        aria-label="Abrir menú"
        aria-controls="sidebar-drawer"
        aria-expanded={abierto}
        onClick={abrir}
        className={cn(
          'flex items-center justify-center rounded-lg p-2',
          'text-fg-muted hover:bg-surface-2 hover:text-fg',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        )}
      >
        <Menu size={20} aria-hidden="true" />
      </button>
      <Link
        href="/"
        aria-label="Inicio"
        className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        <Logo variant={theme === 'dark' ? 'full-white' : 'full'} height={32} />
      </Link>
    </header>
  )
}
