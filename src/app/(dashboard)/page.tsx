import Link from 'next/link'
import { auth } from '@/lib/auth'
import { FilePlus, Receipt, Boxes, Package, Users, Warehouse } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Acceso = {
  href: string
  label: string
  desc: string
  roles: string[]
  Icon: LucideIcon
}

const ACCESOS: Acceso[] = [
  { href: '/facturas/nueva', label: 'Nueva factura', desc: 'Crear una factura de venta', roles: ['ADMIN', 'VENDEDOR'], Icon: FilePlus },
  { href: '/facturas', label: 'Facturas', desc: 'Listado y consulta', roles: ['ADMIN', 'VENDEDOR'], Icon: Receipt },
  { href: '/inventario', label: 'Inventario', desc: 'Stock por bodega y movimientos', roles: ['ADMIN', 'VENDEDOR'], Icon: Boxes },
  { href: '/productos', label: 'Productos', desc: 'Catálogo de productos', roles: ['ADMIN'], Icon: Package },
  { href: '/clientes', label: 'Clientes', desc: 'Catálogo de clientes', roles: ['ADMIN', 'VENDEDOR'], Icon: Users },
  { href: '/bodegas', label: 'Bodegas', desc: 'Gestión de bodegas', roles: ['ADMIN'], Icon: Warehouse },
]

export default async function HomePage() {
  const session = await auth()
  const role = session?.user?.role ?? 'VENDEDOR'
  const accesos = ACCESOS.filter((a) => a.roles.includes(role))

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-fg">Inicio</h1>
      <p className="mb-6 text-sm text-fg-muted">
        Bienvenido, {session?.user?.name ?? session?.user?.email}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accesos.map(({ href, label, desc, Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm transition-colors duration-150 hover:border-border-strong hover:shadow-sm focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-bg outline-none"
          >
            <span className="mt-0.5 shrink-0 text-primary">
              <Icon size={22} />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-fg leading-snug">{label}</p>
              <p className="mt-0.5 text-sm text-fg-muted">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
