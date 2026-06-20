'use client'

import { useEffect } from 'react'
import { useFactura } from '@/hooks/facturas/use-factura'
import { formatCOP, formatFecha } from '@/lib/format'

export default function FacturaImprimible({ id }: { id: string }) {
  const { data: f, isLoading } = useFactura(id)

  useEffect(() => {
    if (f) setTimeout(() => window.print(), 300)
  }, [f])

  if (isLoading || !f) return <p className="p-8 text-sm text-gray-500">Cargando…</p>

  return (
    <div className="mx-auto max-w-2xl bg-white p-8 text-sm text-gray-900">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">Factura de venta</h1>
          <p>{f.prefix ?? ''}{f.numero ?? '(borrador)'}</p>
        </div>
        <p>{formatFecha(f.fecha)}</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Cliente</p>
        <p>{f.clienteName}</p>
        <p>ID: {f.clienteIdentificationNumber}</p>
      </div>

      <table className="mb-4 w-full border-collapse text-sm">
        <thead>
          <tr className="border-y border-gray-400 text-left">
            <th className="py-1">Producto</th>
            <th className="py-1 text-right">Cant.</th>
            <th className="py-1 text-right">Precio</th>
            <th className="py-1 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {f.lineas.map((l) => (
            <tr key={l.id} className="border-b border-gray-200">
              <td className="py-1">{l.code} — {l.description}</td>
              <td className="py-1 text-right">{l.invoicedQuantity}</td>
              <td className="py-1 text-right">{formatCOP(l.priceAmount)}</td>
              <td className="py-1 text-right">{formatCOP(l.lineExtensionAmount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto max-w-xs space-y-1">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCOP(f.totales.lineExtensionAmount)}</span></div>
        <div className="flex justify-between"><span>IVA</span><span>{formatCOP(f.totales.taxInclusiveAmount - f.totales.lineExtensionAmount)}</span></div>
        <div className="flex justify-between border-t border-gray-400 pt-1 font-bold"><span>Total</span><span>{formatCOP(f.totales.payableAmount)}</span></div>
      </div>

      {f.notes && <p className="mt-6 text-xs text-gray-600">{f.notes}</p>}
    </div>
  )
}
