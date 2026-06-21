'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  FileText,
  Receipt,
  Boxes,
  Users,
  Package,
  Warehouse,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import Logo from '@/components/ui/Logo'
import SidebarNav, { type NavItem } from '@/components/layout/SidebarNav'
import { useSidebarColapsado } from '@/hooks/ui/useSidebarColapsado'
import { useDrawerMovil } from '@/hooks/ui/useDrawerMovil'
import { useMediaQuery, MOBILE_QUERY } from '@/hooks/ui/useMediaQuery'
import { useTheme } from '@/hooks/ui/useTheme'
import { drawerLeft, overlayFade } from '@/lib/motion'

const ITEMS: NavItem[] = [
  { href: '/cotizaciones', label: 'Cotizaciones', icon: FileText, roles: ['ADMIN', 'VENDEDOR'] },
  { href: '/facturas', label: 'Facturas', icon: Receipt, roles: ['ADMIN', 'VENDEDOR'] },
  { href: '/inventario', label: 'Inventario', icon: Boxes, roles: ['ADMIN', 'VENDEDOR'] },
  { href: '/clientes', label: 'Clientes', icon: Users, roles: ['ADMIN', 'VENDEDOR'] },
  { href: '/productos', label: 'Productos', icon: Package, roles: ['ADMIN'] },
  { href: '/bodegas', label: 'Bodegas', icon: Warehouse, roles: ['ADMIN'] },
  { href: '/admin', label: 'Administración', icon: Settings, roles: ['ADMIN'] },
]

const TOGGLE_BTN_CLS = cn(
  'flex items-center justify-center rounded-lg p-2',
  'text-fg-muted hover:bg-surface-2 hover:text-fg',
  'transition-colors duration-150',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
)

interface SidebarProps {
  role: string
  nombre: string
  email: string
}

export default function Sidebar({ role, nombre, email }: SidebarProps) {
  const { colapsado, toggle } = useSidebarColapsado()
  const { abierto, cerrar } = useDrawerMovil()
  const esMovil = useMediaQuery(MOBILE_QUERY)
  const { theme } = useTheme()
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const panelRef = useRef<HTMLElement>(null)

  const items = ITEMS.filter((i) => i.roles.includes(role))

  useEffect(() => {
    cerrar()
  }, [pathname, cerrar])

  useEffect(() => {
    if (!esMovil) cerrar()
  }, [esMovil, cerrar])

  useEffect(() => {
    if (!abierto || !esMovil) return
    const previo = document.activeElement as HTMLElement | null
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') cerrar()
    }
    document.addEventListener('keydown', onKey)
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflowPrevio
      previo?.focus?.()
    }
  }, [abierto, esMovil, cerrar])

  const railLogo = colapsado ? 'mark' : theme === 'dark' ? 'full-white' : 'full'
  const drawerLogo = theme === 'dark' ? 'full-white' : 'full'

  return (
    <>
      <motion.aside
        animate={{ width: colapsado ? '4rem' : '16rem' }}
        transition={reduced ? { duration: 0 } : { duration: 0.2, ease: 'easeInOut' }}
        className="sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-border bg-surface lg:flex print:hidden"
      >
        <div
          className={cn(
            'flex items-center border-b border-border px-3 py-4',
            colapsado ? 'flex-col gap-3' : 'justify-between',
          )}
        >
          <Link
            href="/"
            aria-label="Inicio"
            className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <Logo variant={railLogo} height={colapsado ? 32 : 40} priority />
          </Link>
          <button
            type="button"
            aria-label={colapsado ? 'Expandir menú' : 'Colapsar menú'}
            aria-expanded={!colapsado}
            onClick={toggle}
            className={TOGGLE_BTN_CLS}
          >
            {colapsado ? (
              <PanelLeftOpen size={18} aria-hidden="true" />
            ) : (
              <PanelLeftClose size={18} aria-hidden="true" />
            )}
          </button>
        </div>

        <SidebarNav items={items} role={role} nombre={nombre} email={email} colapsado={colapsado} />
      </motion.aside>

      <AnimatePresence>
        {esMovil && abierto && (
          <motion.div
            key="overlay"
            variants={reduced ? undefined : overlayFade}
            initial={reduced ? undefined : 'hidden'}
            animate={reduced ? undefined : 'visible'}
            exit={reduced ? undefined : 'exit'}
            onClick={cerrar}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden print:hidden"
          />
        )}
        {esMovil && abierto && (
          <motion.aside
            key="panel"
            ref={panelRef}
            tabIndex={-1}
            id="sidebar-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            variants={reduced ? undefined : drawerLeft}
            initial={reduced ? undefined : 'hidden'}
            animate={reduced ? undefined : 'visible'}
            exit={reduced ? undefined : 'exit'}
            className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface outline-none lg:hidden print:hidden"
          >
            <div className="flex items-center justify-between border-b border-border px-3 py-4">
              <Link
                href="/"
                aria-label="Inicio"
                onClick={cerrar}
                className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <Logo variant={drawerLogo} height={40} priority />
              </Link>
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={cerrar}
                className={TOGGLE_BTN_CLS}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <SidebarNav
              items={items}
              role={role}
              nombre={nombre}
              email={email}
              colapsado={false}
              onNavigate={cerrar}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
