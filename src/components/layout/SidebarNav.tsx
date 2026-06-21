'use client'

import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import SidebarItem from '@/components/layout/SidebarItem'
import ThemeToggle from '@/components/layout/ThemeToggle'
import UserFooter from '@/components/layout/UserFooter'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  roles: string[]
}

interface SidebarNavProps {
  items: NavItem[]
  role: string
  nombre: string
  email: string
  colapsado: boolean
  onNavigate?: () => void
}

export default function SidebarNav({ items, role, nombre, email, colapsado, onNavigate }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-3">
        {items.map((item) => {
          const activo = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              activo={activo}
              colapsado={colapsado}
              onClick={onNavigate}
            />
          )
        })}
      </nav>

      <div
        className={cn(
          'flex border-t border-border px-2 py-2',
          colapsado ? 'justify-center' : 'flex-row items-center gap-1',
        )}
      >
        <ThemeToggle />
      </div>

      <div className="px-2 pb-4">
        <UserFooter nombre={nombre} email={email} role={role} colapsado={colapsado} />
      </div>
    </>
  )
}
