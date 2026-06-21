'use client'

import Link from 'next/link'
import { useFacturas } from '@/hooks/facturas/use-facturas'
import { formatCOP, formatFecha } from '@/lib/format'
import { estadoBadgeVariant } from '@/lib/estados'
import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/cn'

export default function ListaFacturas() {
  const { data, isLoading } = useFacturas()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-fg">Facturas</h1>
        <Link
          href="/facturas/nueva"
          className={cn(
            'inline-flex items-center gap-2 rounded-lg font-medium h-10 px-4 text-sm',
            'bg-primary text-primary-fg hover:bg-primary-hover',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          )}
        >
          <Plus size={16} />
          Nueva factura
        </Link>
      </div>

      <Table>
        <Table.Head>
          <tr>
            <Table.HeaderCell>Número</Table.HeaderCell>
            <Table.HeaderCell>Fecha</Table.HeaderCell>
            <Table.HeaderCell>Cliente</Table.HeaderCell>
            <Table.HeaderCell>Estado</Table.HeaderCell>
            <Table.HeaderCell align="right">Total</Table.HeaderCell>
          </tr>
        </Table.Head>
        <Table.Body>
          {isLoading && (
            <>
              <Skeleton.Row cols={5} />
              <Skeleton.Row cols={5} />
              <Skeleton.Row cols={5} />
              <Skeleton.Row cols={5} />
              <Skeleton.Row cols={5} />
            </>
          )}
          {!isLoading && data?.items.length === 0 && (
            <tr>
              <td colSpan={5}>
                <EmptyState
                  title="Sin facturas"
                  description="Aún no hay facturas registradas."
                  action={
                    <Link
                      href="/facturas/nueva"
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg font-medium h-8 px-3 text-sm',
                        'bg-primary text-primary-fg hover:bg-primary-hover',
                        'transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                      )}
                    >
                      <Plus size={14} />
                      Nueva factura
                    </Link>
                  }
                />
              </td>
            </tr>
          )}
          {!isLoading && data?.items.map((f) => (
            <Table.Row key={f.id} hover>
              <Table.Cell>
                <Link
                  href={`/facturas/${f.id}`}
                  className="text-primary hover:underline transition-colors duration-150"
                >
                  {f.prefix ?? ''}{f.numero ?? 'BORRADOR'}
                </Link>
              </Table.Cell>
              <Table.Cell>{formatFecha(f.fecha)}</Table.Cell>
              <Table.Cell>{f.clienteName}</Table.Cell>
              <Table.Cell>
                <Badge variant={estadoBadgeVariant(f.estado)} size="sm">
                  {f.estado}
                </Badge>
              </Table.Cell>
              <Table.Cell align="right">{formatCOP(f.payableAmount)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}
