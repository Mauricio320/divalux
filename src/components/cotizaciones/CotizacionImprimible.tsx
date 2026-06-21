'use client'

import { useEffect } from 'react'
import { useCotizacion } from '@/hooks/cotizaciones/use-cotizacion'
import { formatCOP, formatFecha } from '@/lib/format'
import Logo from '@/components/ui/Logo'

export default function CotizacionImprimible({ id }: { id: string }) {
  const { data: c, isLoading } = useCotizacion(id)

  useEffect(() => {
    if (c) setTimeout(() => window.print(), 300)
  }, [c])

  if (isLoading || !c) {
    return (
      <p className="p-8 text-sm text-neutro-600">Cargando…</p>
    )
  }

  return (
    <div className="mx-auto max-w-2xl bg-white p-8 text-sm text-neutro-900">
      <div className="mb-8 flex items-start justify-between">
        <Logo variant="full" width={150} priority />
        <div className="text-right">
          <p className="text-lg font-semibold text-neutro-900">Cotización</p>
          <p className="mt-0.5 text-neutro-700">{c.prefix}-{c.numero}</p>
          <p className="mt-0.5 text-neutro-600">{formatFecha(c.fecha)}</p>
          {c.validezHasta && (
            <p className="mt-0.5 text-neutro-500">Válida hasta {formatFecha(c.validezHasta)}</p>
          )}
        </div>
      </div>

      <div className="mb-1 border-t border-dorado-400" />

      <div className="mb-6 mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutro-500">Cliente</p>
        <p className="mt-1 font-medium text-neutro-900">{c.clienteName}</p>
        <p className="text-neutro-600">Identificación: {c.clienteIdentificationNumber}</p>
      </div>

      <table className="mb-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-y border-neutro-300 text-left">
            <th className="py-2 pr-2 font-semibold text-neutro-700">Producto</th>
            <th className="py-2 px-2 text-right font-semibold text-neutro-700">Cant.</th>
            <th className="py-2 px-2 text-right font-semibold text-neutro-700">Precio unit.</th>
            <th className="py-2 pl-2 text-right font-semibold text-neutro-700">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {c.lineas.map((l) => (
            <tr key={l.id} className="border-b border-neutro-200">
              <td className="py-1.5 pr-2 text-neutro-900">{l.code} — {l.description}</td>
              <td className="py-1.5 px-2 text-right text-neutro-700">{l.invoicedQuantity}</td>
              <td className="py-1.5 px-2 text-right text-neutro-700">{formatCOP(l.priceAmount)}</td>
              <td className="py-1.5 pl-2 text-right text-neutro-900">{formatCOP(l.lineExtensionAmount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto max-w-xs space-y-1.5">
        <div className="flex justify-between text-neutro-700">
          <span>Subtotal</span>
          <span>{formatCOP(c.totales.lineExtensionAmount)}</span>
        </div>
        <div className="flex justify-between text-neutro-700">
          <span>IVA</span>
          <span>{formatCOP(c.totales.taxInclusiveAmount - c.totales.lineExtensionAmount)}</span>
        </div>
        <div className="border-t border-dorado-400 pt-1.5" />
        <div className="flex justify-between font-bold text-neutro-900">
          <span>Total</span>
          <span>{formatCOP(c.totales.payableAmount)}</span>
        </div>
      </div>

      {c.notes && (
        <p className="mt-8 text-xs text-neutro-600">{c.notes}</p>
      )}
      <p className="mt-4 text-xs text-neutro-500">
        Este documento es una cotización, no es una factura de venta.
      </p>
    </div>
  )
}
