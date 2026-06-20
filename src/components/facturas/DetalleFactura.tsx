'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useFactura } from '@/hooks/facturas/use-factura'
import { useConfirmarFactura } from '@/hooks/facturas/use-confirmar-factura'
import { useAnularFactura } from '@/hooks/facturas/use-anular-factura'
import { formatCOP, formatFecha } from '@/lib/format'

export default function DetalleFactura({ id, esAdmin }: { id: string; esAdmin: boolean }) {
  const { data: f, isLoading } = useFactura(id)
  const confirmar = useConfirmarFactura()
  const anular = useAnularFactura()
  const [error, setError] = useState('')

  if (isLoading || !f) return <p className="text-sm text-gray-500">Cargando…</p>

  async function onConfirmar() {
    setError('')
    try {
      await confirmar.mutateAsync(id)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo confirmar')
    }
  }

  async function onAnular() {
    setError('')
    try {
      await anular.mutateAsync({ facturaId: id })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo anular')
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Factura {f.prefix ?? ''}{f.numero ?? '(borrador)'}
          </h1>
          <p className="text-sm text-gray-500">{formatFecha(f.fecha)} · {f.estado}</p>
        </div>
        <div className="flex gap-2">
          {f.estado === 'BORRADOR' && (
            <button onClick={onConfirmar} disabled={confirmar.isPending} className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
              Confirmar
            </button>
          )}
          <button disabled title="Disponible en fase 2" className="cursor-not-allowed rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-500">
            Emitir a DIAN
          </button>
          {f.estado === 'CONFIRMADA' && (
            <Link href={`/facturas/${id}/imprimir`} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
              Imprimir
            </Link>
          )}
          {esAdmin && f.estado !== 'ANULADA' && (
            <button onClick={onAnular} disabled={anular.isPending} className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 disabled:opacity-50">
              Anular
            </button>
          )}
        </div>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="mb-4 rounded-lg border border-gray-200 p-4 text-sm">
        <p className="font-semibold text-gray-900">{f.clienteName}</p>
        <p className="text-gray-600">ID: {f.clienteIdentificationNumber}</p>
        <p className="text-gray-600">Bodega: {f.bodegaNombre} · Vendedor: {f.vendedorNombre}</p>
      </div>

      <table className="mb-4 w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="py-2">Producto</th>
            <th className="py-2 text-right">Cant.</th>
            <th className="py-2 text-right">Precio</th>
            <th className="py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {f.lineas.map((l) => (
            <tr key={l.id} className="border-b border-gray-100">
              <td className="py-2">{l.code} — {l.description}</td>
              <td className="py-2 text-right">{l.invoicedQuantity}</td>
              <td className="py-2 text-right">{formatCOP(l.priceAmount)}</td>
              <td className="py-2 text-right">{formatCOP(l.lineExtensionAmount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto max-w-xs space-y-1 text-sm">
        <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatCOP(f.totales.lineExtensionAmount)}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">IVA</span><span>{formatCOP(f.totales.taxInclusiveAmount - f.totales.lineExtensionAmount)}</span></div>
        {f.totales.allowanceTotalAmount > 0 && <div className="flex justify-between"><span className="text-gray-600">Descuentos</span><span>-{formatCOP(f.totales.allowanceTotalAmount)}</span></div>}
        <div className="flex justify-between border-t border-gray-200 pt-1 font-bold"><span>Total</span><span>{formatCOP(f.totales.payableAmount)}</span></div>
      </div>

      <details className="mt-6">
        <summary className="cursor-pointer text-sm text-gray-500">Vista previa del payload Nextpyme (fase 2)</summary>
        <pre className="mt-2 max-h-96 overflow-auto rounded-md bg-gray-900 p-4 text-xs text-gray-100">
          {JSON.stringify(f.payloadNextpyme, null, 2)}
        </pre>
      </details>
    </div>
  )
}
