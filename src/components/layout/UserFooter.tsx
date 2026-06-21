'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/cn'
import Badge from '@/components/ui/Badge'

interface UserFooterProps {
  nombre: string
  email: string
  role: string
  colapsado: boolean
}

function getInitiales(nombre: string): string {
  const parts = nombre.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return nombre.slice(0, 2).toUpperCase()
}

export default function UserFooter({
  nombre,
  email,
  role,
  colapsado,
}: UserFooterProps) {
  const iniciales = getInitiales(nombre)
  const mostrarEmail = email !== nombre

  return (
    <div
      className={cn(
        'flex border-t border-border pt-3',
        colapsado ? 'flex-col items-center gap-2' : 'flex-col gap-2',
      )}
    >
      {colapsado ? (
        <>
          <div
            aria-label={nombre}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-fg"
          >
            {iniciales}
          </div>
          <button
            type="button"
            aria-label="Cerrar sesión"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={cn(
              'flex items-center justify-center rounded-lg p-2',
              'text-fg-muted hover:bg-surface-2 hover:text-danger',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
            )}
          >
            <LogOut size={16} aria-hidden="true" />
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 px-1">
            <div
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-fg"
            >
              {iniciales}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-fg">{nombre}</p>
              {mostrarEmail && (
                <p className="truncate text-xs text-fg-subtle">{email}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between px-1">
            <Badge variant="neutral" size="sm">
              {role}
            </Badge>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs',
                'text-fg-muted hover:bg-surface-2 hover:text-danger',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
              )}
            >
              <LogOut size={14} aria-hidden="true" />
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>
  )
}
