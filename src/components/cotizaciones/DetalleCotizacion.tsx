'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCotizacion } from '@/hooks/cotizaciones/use-cotizacion'
import { useCambiarEstadoCotizacion } from '@/hooks/cotizaciones/use-cambiar-estado-cotizacion'
import { useConvertirAFactura } from '@/hooks/cotizaciones/use-convertir-a-factura'
import { useBodegas } from '@/hooks/bodegas/use-bodegas'
import { SelectBuscador } from '@/components/ui/SelectBuscador'
import { formatCOP, formatFecha } from '@/lib/format'

export default function DetalleCotizacion({ id }: { id: string }) {
  const router = useRouter()
  const { data: c, isLoading } = useCotizacion(id)
  const { data: bodegas } = useBodegas()
  const cambiar = useCambiarEstadoCotizacion()
  const convertir = useConvertirAFactura()
  const [bodegaId, setBodegaId] = useState<string | ''>('')
  const [error, setError] = useState('')

  if (isLoading || !c) return <p className="text-sm text-gray-500">Cargando…</p>

  const convertible = !c.facturaGeneradaId && c.estado !== 'RECHAZADA' && c.estado !== 'VENCIDA'

  async function cambiarEstado(estado: 'ENVIADA' | 'APROBADA' | 'RECHAZADA') {
    setError('')
    try {
      await cambiar.mutateAsync({ cotizacionId: id, estado })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cambiar el estado')
    }
  }

  async function onConvertir() {
    setError('')
    if (!bodegaId) {
      setError('Selecciona una bodega para la factura')
      return
    }
    try {
      const res = await convertir.mutateAsync({ cotizacionId: id, bodegaId })
      router.push(`/facturas/${res.facturaId}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo convertir')
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cotización {c.prefix}-{c.numero}</h1>
          <p className="text-sm text-gray-500">
            {formatFecha(c.fecha)} · {c.estado}
            {c.validezHasta ? ` · válida hasta ${formatFecha(c.validezHasta)}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {c.estado === 'BORRADOR' && (
            <button onClick={() => cambiarEstado('ENVIADA')} disabled={cambiar.isPending} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
              Marcar enviada
            </button>
          )}
          {convertible && (
            <button onClick={() => cambiarEstado('RECHAZADA')} disabled={cambiar.isPending} className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-600">
              Rechazar
            </button>
          )}
          <Link href={`/cotizaciones/${id}/imprimir`} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
            Imprimir
          </Link>
        </div>
      </div>

      {c.facturaGeneradaId && (
        <p className="mb-3 text-sm text-green-700">
          Convertida a factura.{' '}
          <Link href={`/facturas/${c.facturaGeneradaId}`} className="text-blue-600 hover:underline">
            Ver factura
          </Link>
        </p>
      )}

      <div className="mb-4 rounded-lg border border-gray-200 p-4 text-sm">
        <p className="font-semibold text-gray-900">{c.clienteName}</p>
        <p className="text-gray-600">ID: {c.clienteIdentificationNumber} · Vendedor: {c.vendedorNombre}</p>
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
          {c.lineas.map((l) => (
            <tr key={l.id} className="border-b border-gray-100">
              <td className="py-2">{l.code} — {l.description}</td>
              <td className="py-2 text-right">{l.invoicedQuantity}</td>
              <td className="py-2 text-right">{formatCOP(l.priceAmount)}</td>
              <td className="py-2 text-right">{formatCOP(l.lineExtensionAmount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto mb-6 max-w-xs space-y-1 text-sm">
        <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatCOP(c.totales.lineExtensionAmount)}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">IVA</span><span>{formatCOP(c.totales.taxInclusiveAmount - c.totales.lineExtensionAmount)}</span></div>
        {c.totales.allowanceTotalAmount > 0 && <div className="flex justify-between"><span className="text-gray-600">Descuentos</span><span>-{formatCOP(c.totales.allowanceTotalAmount)}</span></div>}
        <div className="flex justify-between border-t border-gray-200 pt-1 font-bold"><span>Total</span><span>{formatCOP(c.totales.payableAmount)}</span></div>
      </div>

      {convertible && (
        <div className="rounded-lg border border-gray-200 p-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-700">Convertir a factura</h2>
          <div className="flex items-end gap-3">
            <div className="w-64">
              <label className="mb-1 block text-xs text-gray-600">Bodega</label>
              <SelectBuscador
                opciones={(bodegas ?? []).map((b) => ({ value: b.id, label: b.nombre }))}
                value={bodegaId}
                onChange={(v) => setBodegaId(v)}
                placeholder="Seleccionar bodega"
              />
            </div>
            <button onClick={onConvertir} disabled={convertir.isPending} className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
              Convertir a factura
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}
