'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

type Item = { href: string; label: string; roles: string[] }

const ITEMS: Item[] = [
  { href: '/cotizaciones', label: 'Cotizaciones', roles: ['ADMIN', 'VENDEDOR'] },
  { href: '/facturas', label: 'Facturas', roles: ['ADMIN', 'VENDEDOR'] },
  { href: '/inventario', label: 'Inventario', roles: ['ADMIN', 'VENDEDOR'] },
  { href: '/clientes', label: 'Clientes', roles: ['ADMIN', 'VENDEDOR'] },
  { href: '/productos', label: 'Productos', roles: ['ADMIN'] },
  { href: '/bodegas', label: 'Bodegas', roles: ['ADMIN'] },
  { href: '/admin', label: 'Administración', roles: ['ADMIN'] },
]

export function Nav({ role, nombre }: { role: string; nombre: string }) {
  const pathname = usePathname()
  const items = ITEMS.filter((i) => i.roles.includes(role))

  return (
    <aside className="flex w-56 flex-col border-r border-gray-200 bg-gray-50 p-4">
      <Link href="/" className="mb-6 text-lg font-bold text-gray-900">
        Divalus
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((i) => {
          const activo = pathname === i.href || pathname.startsWith(i.href + '/')
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`rounded-md px-3 py-2 text-sm ${activo ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              {i.label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-4 border-t border-gray-200 pt-4">
        <p className="truncate text-sm font-medium text-gray-900">{nombre}</p>
        <p className="mb-2 text-xs text-gray-500">{role}</p>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-sm text-red-600 hover:underline"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
