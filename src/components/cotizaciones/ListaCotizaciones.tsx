'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useCotizaciones } from '@/hooks/cotizaciones/use-cotizaciones'
import { formatCOP, formatFecha } from '@/lib/format'
import { estadoBadgeVariant } from '@/lib/estados'
import Badge from '@/components/ui/Badge'
import Table from '@/components/ui/Table'
import Skeleton from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import Card from '@/components/ui/Card'
import { cn } from '@/lib/cn'

export default function ListaCotizaciones() {
  const { data, isLoading } = useCotizaciones()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-fg">Cotizaciones</h1>
        <Link
          href="/cotizaciones/nueva"
          className={cn(
            'inline-flex items-center gap-2 rounded-lg font-medium h-10 px-4 text-sm',
            'bg-primary text-primary-fg hover:bg-primary-hover',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          )}
        >
          <Plus size={16} />
          Nueva cotización
        </Link>
      </div>

      <Card>
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
                    title="Sin cotizaciones"
                    description="Crea tu primera cotización para empezar."
                    action={
                      <Link
                        href="/cotizaciones/nueva"
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-lg font-medium h-8 px-3 text-sm',
                          'bg-primary text-primary-fg hover:bg-primary-hover',
                          'transition-colors duration-150',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                        )}
                      >
                        <Plus size={14} />
                        Nueva cotización
                      </Link>
                    }
                  />
                </td>
              </tr>
            )}
            {!isLoading && data?.items.map((c) => (
              <Table.Row key={c.id} hover>
                <Table.Cell>
                  <Link
                    href={`/cotizaciones/${c.id}`}
                    className="text-primary hover:underline transition-colors duration-150"
                  >
                    {c.prefix}-{c.numero}
                  </Link>
                </Table.Cell>
                <Table.Cell>{formatFecha(c.fecha)}</Table.Cell>
                <Table.Cell>{c.clienteName}</Table.Cell>
                <Table.Cell>
                  <Badge variant={estadoBadgeVariant(c.estado)} size="sm">
                    {c.estado}
                  </Badge>
                </Table.Cell>
                <Table.Cell align="right">{formatCOP(c.payableAmount)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </div>
  )
}
