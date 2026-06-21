'use client'

import { useState } from 'react'
import { SelectBuscador } from '@/components/ui/SelectBuscador'
import { useBodegas } from '@/hooks/bodegas/use-bodegas'
import { useStock } from '@/hooks/inventario/use-stock'
import { useMovimientos } from '@/hooks/inventario/use-movimientos'
import { formatNumero } from '@/lib/format'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'
import Field from '@/components/ui/Field'
import FormMovimiento from './FormMovimiento'
import FormTraslado from './FormTraslado'

type BadgeVariant = 'neutral' | 'success' | 'danger' | 'info' | 'warning' | 'gold'

function tipoBadgeVariant(tipo: string): BadgeVariant {
  if (tipo === 'ENTRADA') return 'success'
  if (tipo === 'VENTA') return 'info'
  if (tipo === 'REVERSA') return 'warning'
  if (tipo === 'AJUSTE') return 'gold'
  if (tipo === 'TRASLADO_ENTRADA') return 'success'
  if (tipo === 'TRASLADO_SALIDA') return 'neutral'
  return 'neutral'
}

export default function InventarioClient({ role }: { role: string }) {
  const [bodegaId, setBodegaId] = useState<string | ''>('')
  const { data: bodegas } = useBodegas()
  const { data: stock, isLoading: isLoadingStock } = useStock(bodegaId ? { bodegaId } : undefined)
  const { data: movimientos, isLoading: isLoadingMov } = useMovimientos(bodegaId ? { bodegaId } : undefined)
  const esAdmin = role === 'ADMIN'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-fg">Inventario</h1>

      <Card className="max-w-xs">
        <Card.Body>
          <Field label="Filtrar por bodega">
            <SelectBuscador
              opciones={(bodegas ?? []).map((b) => ({ value: b.id, label: b.nombre }))}
              value={bodegaId}
              onChange={(v) => setBodegaId(v)}
              placeholder="Todas las bodegas"
            />
          </Field>
        </Card.Body>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <Card.Header title="Existencias" />
            <Table>
              <Table.Head>
                <tr>
                  <Table.HeaderCell>Producto</Table.HeaderCell>
                  <Table.HeaderCell>Bodega</Table.HeaderCell>
                  <Table.HeaderCell align="right">Cantidad</Table.HeaderCell>
                </tr>
              </Table.Head>
              <Table.Body>
                {isLoadingStock ? (
                  <>
                    <Skeleton.Row cols={3} />
                    <Skeleton.Row cols={3} />
                    <Skeleton.Row cols={3} />
                    <Skeleton.Row cols={3} />
                  </>
                ) : stock && stock.length > 0 ? (
                  stock.map((s, i) => (
                    <Table.Row key={`${s.productoId}-${s.bodegaId}`} zebra zebraOdd={i % 2 === 1}>
                      <Table.Cell>{s.productoCode} — {s.productoNombre}</Table.Cell>
                      <Table.Cell>{s.bodegaNombre}</Table.Cell>
                      <Table.Cell align="right">{formatNumero(s.cantidad)}</Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>
                      <EmptyState title="Sin existencias" description="No hay stock registrado para los filtros seleccionados." />
                    </td>
                  </tr>
                )}
              </Table.Body>
            </Table>
          </Card>

          <Card>
            <Card.Header title="Movimientos recientes" />
            <Table>
              <Table.Head>
                <tr>
                  <Table.HeaderCell>Tipo</Table.HeaderCell>
                  <Table.HeaderCell>Producto</Table.HeaderCell>
                  <Table.HeaderCell>Bodega</Table.HeaderCell>
                  <Table.HeaderCell align="right">Cantidad</Table.HeaderCell>
                  <Table.HeaderCell align="right">Saldo</Table.HeaderCell>
                </tr>
              </Table.Head>
              <Table.Body>
                {isLoadingMov ? (
                  <>
                    <Skeleton.Row cols={5} />
                    <Skeleton.Row cols={5} />
                    <Skeleton.Row cols={5} />
                    <Skeleton.Row cols={5} />
                  </>
                ) : movimientos && movimientos.length > 0 ? (
                  movimientos.map((m, i) => (
                    <Table.Row key={m.id} zebra zebraOdd={i % 2 === 1}>
                      <Table.Cell>
                        <Badge variant={tipoBadgeVariant(m.tipo)} size="sm">{m.tipo}</Badge>
                      </Table.Cell>
                      <Table.Cell>{m.productoNombre}</Table.Cell>
                      <Table.Cell>{m.bodegaNombre}</Table.Cell>
                      <Table.Cell align="right">{formatNumero(m.cantidad)}</Table.Cell>
                      <Table.Cell align="right">{formatNumero(m.saldoResultante)}</Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState title="Sin movimientos" description="No hay movimientos de inventario para los filtros seleccionados." />
                    </td>
                  </tr>
                )}
              </Table.Body>
            </Table>
          </Card>
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
