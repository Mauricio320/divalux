'use client'

import { useState } from 'react'
import { SelectBuscador } from '@/components/ui/SelectBuscador'
import { useBodegas } from '@/hooks/bodegas/use-bodegas'
import { useStock } from '@/hooks/inventario/use-stock'
import { useMovimientos } from '@/hooks/inventario/use-movimientos'
import { formatNumero } from '@/lib/format'
import FormMovimiento from './FormMovimiento'
import FormTraslado from './FormTraslado'

export default function InventarioClient({ role }: { role: string }) {
  const [bodegaId, setBodegaId] = useState<string | ''>('')
  const { data: bodegas } = useBodegas()
  const { data: stock, isLoading } = useStock(bodegaId ? { bodegaId } : undefined)
  const { data: movimientos } = useMovimientos(bodegaId ? { bodegaId } : undefined)
  const esAdmin = role === 'ADMIN'

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Inventario</h1>

      <div className="mb-4 max-w-xs">
        <label className="mb-1 block text-xs font-medium text-gray-600">Filtrar por bodega</label>
        <SelectBuscador
          opciones={(bodegas ?? []).map((b) => ({ value: b.id, label: b.nombre }))}
          value={bodegaId}
          onChange={(v) => setBodegaId(v)}
          placeholder="Todas las bodegas"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-2 text-sm font-semibold text-gray-700">Existencias</h2>
          {isLoading ? (
            <p className="text-sm text-gray-500">Cargando…</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2">Producto</th>
                  <th className="py-2">Bodega</th>
                  <th className="py-2 text-right">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {stock?.map((s) => (
                  <tr key={`${s.productoId}-${s.bodegaId}`} className="border-b border-gray-100">
                    <td className="py-2">{s.productoCode} — {s.productoNombre}</td>
                    <td className="py-2">{s.bodegaNombre}</td>
                    <td className="py-2 text-right">{formatNumero(s.cantidad)}</td>
                  </tr>
                ))}
                {stock?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-400">Sin existencias</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          <h2 className="mb-2 mt-6 text-sm font-semibold text-gray-700">Movimientos recientes</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="py-2">Tipo</th>
                <th className="py-2">Producto</th>
                <th className="py-2">Bodega</th>
                <th className="py-2 text-right">Cantidad</th>
                <th className="py-2 text-right">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {movimientos?.map((m) => (
                <tr key={m.id} className="border-b border-gray-100">
                  <td className="py-2">{m.tipo}</td>
                  <td className="py-2">{m.productoNombre}</td>
                  <td className="py-2">{m.bodegaNombre}</td>
                  <td className="py-2 text-right">{formatNumero(m.cantidad)}</td>
                  <td className="py-2 text-right">{formatNumero(m.saldoResultante)}</td>
                </tr>
              ))}
              {movimientos?.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-400">Sin movimientos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {esAdmin && (
          <div className="space-y-4">
            <FormMovimiento />
            <FormTraslado />
          </div>
        )}
      </div>
    </div>
  )
}
