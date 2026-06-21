'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Printer } from 'lucide-react'
import { useCotizacion } from '@/hooks/cotizaciones/use-cotizacion'
import { useCambiarEstadoCotizacion } from '@/hooks/cotizaciones/use-cambiar-estado-cotizacion'
import { useConvertirAFactura } from '@/hooks/cotizaciones/use-convertir-a-factura'
import { useBodegas } from '@/hooks/bodegas/use-bodegas'
import { useToast } from '@/hooks/ui/useToast'
import { SelectBuscador } from '@/components/ui/SelectBuscador'
import { estadoBadgeVariant } from '@/lib/estados'
import { formatCOP, formatFecha } from '@/lib/format'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Skeleton from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'

export default function DetalleCotizacion({ id }: { id: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { data: c, isLoading } = useCotizacion(id)
  const { data: bodegas } = useBodegas()
  const cambiar = useCambiarEstadoCotizacion()
  const convertir = useConvertirAFactura()
  const [bodegaId, setBodegaId] = useState<string | ''>('')

  if (isLoading || !c) {
    return (
      <div className="max-w-3xl space-y-4">
        <Card padding>
          <Skeleton.Text lines={2} />
        </Card>
      </div>
    )
  }

  const convertible = !c.facturaGeneradaId && c.estado !== 'RECHAZADA' && c.estado !== 'VENCIDA'

  async function cambiarEstado(estado: 'ENVIADA' | 'APROBADA' | 'RECHAZADA') {
    try {
      await cambiar.mutateAsync({ cotizacionId: id, estado })
    } catch (e) {
      toast({ type: 'error', message: e instanceof Error ? e.message : 'No se pudo cambiar el estado' })
    }
  }

  async function onConvertir() {
    if (!bodegaId) {
      toast({ type: 'error', message: 'Selecciona una bodega para la factura' })
      return
    }
    try {
      const res = await convertir.mutateAsync({ cotizacionId: id, bodegaId })
      router.push(`/facturas/${res.facturaId}`)
    } catch (e) {
      toast({ type: 'error', message: e instanceof Error ? e.message : 'No se pudo convertir' })
    }
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-fg">
              Cotización {c.prefix}-{c.numero}
            </h1>
            <Badge variant={estadoBadgeVariant(c.estado)} size="md">
              {c.estado}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-fg-muted">
            {formatFecha(c.fecha)}
            {c.validezHasta ? ` · válida hasta ${formatFecha(c.validezHasta)}` : ''}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {c.estado === 'BORRADOR' && (
            <Button
              variant="secondary"
              size="sm"
              isLoading={cambiar.isPending}
              onClick={() => cambiarEstado('ENVIADA')}
            >
              Marcar enviada
            </Button>
          )}
          {convertible && (
            <Button
              variant="danger"
              size="sm"
              isLoading={cambiar.isPending}
              onClick={() => cambiarEstado('RECHAZADA')}
            >
              Rechazar
            </Button>
          )}
          <Link
            href={`/cotizaciones/${id}/imprimir`}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg font-medium h-8 px-3 text-sm',
              'bg-surface text-fg border border-border-strong hover:bg-surface-2',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
            )}
          >
            <Printer size={14} />
            Imprimir
          </Link>
        </div>
      </div>

      {c.facturaGeneradaId && (
        <p className="text-sm text-fg-muted">
          Convertida a factura.{' '}
          <Link
            href={`/facturas/${c.facturaGeneradaId}`}
            className="text-primary hover:underline transition-colors duration-150"
          >
            Ver factura
          </Link>
        </p>
      )}

      <Card>
        <Card.Header title="Datos del cliente" />
        <Card.Body>
          <p className="text-sm font-semibold text-fg">{c.clienteName}</p>
          <p className="mt-0.5 text-sm text-fg-muted">
            ID: {c.clienteIdentificationNumber} · Vendedor: {c.vendedorNombre}
          </p>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header title="Líneas" />
        <Table>
          <Table.Head>
            <tr>
              <Table.HeaderCell>Producto</Table.HeaderCell>
              <Table.HeaderCell align="right">Cant.</Table.HeaderCell>
              <Table.HeaderCell align="right">Precio</Table.HeaderCell>
              <Table.HeaderCell align="right">Subtotal</Table.HeaderCell>
            </tr>
          </Table.Head>
          <Table.Body>
            {c.lineas.map((l) => (
              <Table.Row key={l.id} hover={false}>
                <Table.Cell>{l.code} — {l.description}</Table.Cell>
                <Table.Cell align="right">{l.invoicedQuantity}</Table.Cell>
                <Table.Cell align="right">{formatCOP(l.priceAmount)}</Table.Cell>
                <Table.Cell align="right">{formatCOP(l.lineExtensionAmount)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Card.Footer>
          <div className="ml-auto max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-fg-muted">Subtotal</span>
              <span className="text-fg">{formatCOP(c.totales.lineExtensionAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">IVA</span>
              <span className="text-fg">{formatCOP(c.totales.taxInclusiveAmount - c.totales.lineExtensionAmount)}</span>
            </div>
            {c.totales.allowanceTotalAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-fg-muted">Descuentos</span>
                <span className="text-fg">-{formatCOP(c.totales.allowanceTotalAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gold pt-2 font-semibold text-fg">
              <span>Total</span>
              <span>{formatCOP(c.totales.payableAmount)}</span>
            </div>
          </div>
        </Card.Footer>
      </Card>

      {convertible && (
        <Card>
          <Card.Header title="Convertir a factura" />
          <Card.Body>
            <div className="flex items-end gap-3">
              <div className="w-64">
                <SelectBuscador
                  opciones={(bodegas ?? []).map((b) => ({ value: b.id, label: b.nombre }))}
                  value={bodegaId}
                  onChange={(v) => setBodegaId(v)}
                  placeholder="Seleccionar bodega"
                />
              </div>
              <Button
                variant="primary"
                size="md"
                isLoading={convertir.isPending}
                onClick={onConvertir}
              >
                Convertir a factura
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}
