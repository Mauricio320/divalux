import Link from 'next/link'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const ACCESOS = [
  { href: '/facturas/nueva', label: 'Nueva factura', desc: 'Crear una factura de venta', roles: ['ADMIN', 'VENDEDOR'] },
  { href: '/facturas', label: 'Facturas', desc: 'Listado y consulta', roles: ['ADMIN', 'VENDEDOR'] },
  { href: '/inventario', label: 'Inventario', desc: 'Stock por bodega y movimientos', roles: ['ADMIN', 'VENDEDOR'] },
  { href: '/productos', label: 'Productos', desc: 'Catálogo de productos', roles: ['ADMIN'] },
  { href: '/clientes', label: 'Clientes', desc: 'Catálogo de clientes', roles: ['ADMIN', 'VENDEDOR'] },
  { href: '/bodegas', label: 'Bodegas', desc: 'Gestión de bodegas', roles: ['ADMIN'] },
]

export default async function HomePage() {
  const session = await auth()
  const role = session?.user?.role ?? 'VENDEDOR'
  const accesos = ACCESOS.filter((a) => a.roles.includes(role))

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Inicio</h1>
      <p className="mb-6 text-sm text-gray-500">Bienvenido, {session?.user?.name ?? session?.user?.email}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accesos.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="rounded-lg border border-gray-200 p-4 transition hover:border-gray-900 hover:shadow-sm"
          >
            <p className="font-semibold text-gray-900">{a.label}</p>
            <p className="text-sm text-gray-500">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
