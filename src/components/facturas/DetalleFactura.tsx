'use client'

import Link from 'next/link'
import { useFactura } from '@/hooks/facturas/use-factura'
import { useConfirmarFactura } from '@/hooks/facturas/use-confirmar-factura'
import { useAnularFactura } from '@/hooks/facturas/use-anular-factura'
import { formatCOP, formatFecha } from '@/lib/format'
import { estadoBadgeVariant } from '@/lib/estados'
import { useToast } from '@/hooks/ui/useToast'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Skeleton from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'
import { Printer } from 'lucide-react'

export default function DetalleFactura({ id, esAdmin }: { id: string; esAdmin: boolean }) {
  const { data: f, isLoading } = useFactura(id)
  const confirmar = useConfirmarFactura()
  const anular = useAnularFactura()
  const { toast } = useToast()

  if (isLoading || !f) {
    return (
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" />
        <Card padding>
          <Skeleton.Text lines={3} />
        </Card>
      </div>
    )
  }

  async function onConfirmar() {
    try {
      await confirmar.mutateAsync(id)
    } catch (e) {
      toast({ type: 'error', message: e instanceof Error ? e.message : 'No se pudo confirmar' })
    }
  }

  async function onAnular() {
    try {
      await anular.mutateAsync({ facturaId: id })
    } catch (e) {
      toast({ type: 'error', message: e instanceof Error ? e.message : 'No se pudo anular' })
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-fg">
              Factura {f.prefix ?? ''}{f.numero ?? '(borrador)'}
            </h1>
            <Badge variant={estadoBadgeVariant(f.estado)} size="md">
              {f.estado}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-fg-muted">{formatFecha(f.fecha)}</p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {f.estado === 'BORRADOR' && (
            <Button
              variant="primary"
              size="md"
              isLoading={confirmar.isPending}
              onClick={onConfirmar}
            >
              Confirmar
            </Button>
          )}

          <Button
            variant="secondary"
            size="md"
            disabled
            title="Disponible en fase 2"
          >
            Emitir a DIAN
          </Button>

          {f.estado === 'CONFIRMADA' && (
            <Link
              href={`/facturas/${id}/imprimir`}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg font-medium h-10 px-4 text-sm',
                'bg-surface text-fg border border-border-strong hover:bg-surface-2',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
              )}
            >
              <Printer size={16} />
              Imprimir
            </Link>
          )}

          {esAdmin && f.estado !== 'ANULADA' && (
            <Button
              variant="danger"
              size="md"
              isLoading={anular.isPending}
              onClick={onAnular}
            >
              Anular
            </Button>
          )}
        </div>
      </div>

      <Card>
        <Card.Body>
          <p className="font-semibold text-fg">{f.clienteName}</p>
          <p className="mt-0.5 text-sm text-fg-muted">ID: {f.clienteIdentificationNumber}</p>
          <p className="mt-0.5 text-sm text-fg-muted">
            Bodega: {f.bodegaNombre} · Vendedor: {f.vendedorNombre}
          </p>
        </Card.Body>
      </Card>

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
          {f.lineas.map((l) => (
            <Table.Row key={l.id}>
              <Table.Cell>{l.code} — {l.description}</Table.Cell>
              <Table.Cell align="right">{l.invoicedQuantity}</Table.Cell>
              <Table.Cell align="right">{formatCOP(l.priceAmount)}</Table.Cell>
              <Table.Cell align="right">{formatCOP(l.lineExtensionAmount)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <div className="ml-auto max-w-xs space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-fg-muted">Subtotal</span>
          <span className="text-fg">{formatCOP(f.totales.lineExtensionAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-fg-muted">IVA</span>
          <span className="text-fg">{formatCOP(f.totales.taxInclusiveAmount - f.totales.lineExtensionAmount)}</span>
        </div>
        {f.totales.allowanceTotalAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-fg-muted">Descuentos</span>
            <span className="text-fg">-{formatCOP(f.totales.allowanceTotalAmount)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-gold pt-2 font-semibold">
          <span className="text-fg">Total</span>
          <span className="text-fg">{formatCOP(f.totales.payableAmount)}</span>
        </div>
      </div>

      <Card>
        <Card.Body>
          <details>
            <summary className="cursor-pointer select-none text-sm text-fg-muted">
              Vista previa del payload Nextpyme (fase 2)
            </summary>
            <pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-neutro-900 p-4 text-xs text-neutro-100">
              {JSON.stringify(f.payloadNextpyme, null, 2)}
            </pre>
          </details>
        </Card.Body>
      </Card>
    </div>
  )
}
