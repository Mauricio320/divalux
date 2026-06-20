'use client'

import { useEffect } from 'react'
import { useCotizacion } from '@/hooks/cotizaciones/use-cotizacion'
import { formatCOP, formatFecha } from '@/lib/format'

export default function CotizacionImprimible({ id }: { id: string }) {
  const { data: c, isLoading } = useCotizacion(id)

  useEffect(() => {
    if (c) setTimeout(() => window.print(), 300)
  }, [c])

  if (isLoading || !c) return <p className="p-8 text-sm text-gray-500">Cargando…</p>

  return (
    <div className="mx-auto max-w-2xl bg-white p-8 text-sm text-gray-900">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">Cotización</h1>
          <p>{c.prefix}-{c.numero}</p>
        </div>
        <div className="text-right">
          <p>{formatFecha(c.fecha)}</p>
          {c.validezHasta && <p className="text-gray-600">Válida hasta {formatFecha(c.validezHasta)}</p>}
        </div>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Cliente</p>
        <p>{c.clienteName}</p>
        <p>ID: {c.clienteIdentificationNumber}</p>
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
          {c.lineas.map((l) => (
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
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCOP(c.totales.lineExtensionAmount)}</span></div>
        <div className="flex justify-between"><span>IVA</span><span>{formatCOP(c.totales.taxInclusiveAmount - c.totales.lineExtensionAmount)}</span></div>
        <div className="flex justify-between border-t border-gray-400 pt-1 font-bold"><span>Total</span><span>{formatCOP(c.totales.payableAmount)}</span></div>
      </div>

      {c.notes && <p className="mt-6 text-xs text-gray-600">{c.notes}</p>}
      <p className="mt-6 text-xs text-gray-500">Este documento es una cotización, no es una factura de venta.</p>
    </div>
  )
}
