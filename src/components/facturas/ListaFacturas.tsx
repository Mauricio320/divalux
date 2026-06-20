'use client'

import Link from 'next/link'
import { useFacturas } from '@/hooks/facturas/use-facturas'
import { formatCOP, formatFecha } from '@/lib/format'

const COLOR: Record<string, string> = {
  BORRADOR: 'bg-gray-100 text-gray-700',
  CONFIRMADA: 'bg-green-100 text-green-700',
  ANULADA: 'bg-red-100 text-red-700',
  EMITIDA: 'bg-blue-100 text-blue-700',
  RECHAZADA: 'bg-orange-100 text-orange-700',
}

export default function ListaFacturas() {
  const { data, isLoading } = useFacturas()

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Facturas</h1>
        <Link href="/facturas/nueva" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white">
          Nueva factura
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Cargando…</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2">Número</th>
              <th className="py-2">Fecha</th>
              <th className="py-2">Cliente</th>
              <th className="py-2">Estado</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((f) => (
              <tr key={f.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2">
                  <Link href={`/facturas/${f.id}`} className="text-blue-600 hover:underline">
                    {f.prefix ?? ''}{f.numero ?? 'BORRADOR'}
                  </Link>
                </td>
                <td className="py-2">{formatFecha(f.fecha)}</td>
                <td className="py-2">{f.clienteName}</td>
                <td className="py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${COLOR[f.estado] ?? ''}`}>{f.estado}</span>
                </td>
                <td className="py-2 text-right">{formatCOP(f.payableAmount)}</td>
              </tr>
            ))}
            {data?.items.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-400">Sin facturas</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
