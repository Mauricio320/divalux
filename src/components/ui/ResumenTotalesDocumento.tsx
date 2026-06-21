'use client'

import { useWatch, type Control } from 'react-hook-form'
import { calcularFacturaCompleta } from '@/lib/totales'
import { formatCOP } from '@/lib/format'
import Card from '@/components/ui/Card'
import type { DocumentoFormValues } from '@/lib/validations/factura'

export default function ResumenTotalesDocumento({ control }: { control: Control<DocumentoFormValues> }) {
  const lineas = useWatch({ control, name: 'lineas' }) ?? []
  const descuentosCargos = useWatch({ control, name: 'descuentosCargos' }) ?? []

  const calc = calcularFacturaCompleta({
    lineas: lineas.map((l) => ({
      cantidad: Number(l?.cantidad) || 0,
      precioUnitarioSinImpuesto: Number(l?.precioUnitarioSinImpuesto) || 0,
      taxId: Number(l?.taxId) || 0,
      percent: Number(l?.percent) || 0,
    })),
    descuentosCargos: descuentosCargos.map((d) => ({
      esCargo: !!d?.esCargo,
      monto: Number(d?.monto) || 0,
    })),
  })

  return (
    <Card>
      <Card.Body className="space-y-1 py-4">
        <FilaTotales label="Subtotal" valor={formatCOP(calc.totales.lineExtensionAmount)} />
        {calc.taxTotals.map((t) => (
          <FilaTotales key={`${t.taxId}-${t.percent}`} label={`IVA ${t.percent}%`} valor={formatCOP(t.taxAmount)} />
        ))}
        {calc.totales.allowanceTotalAmount > 0 && (
          <FilaTotales label="Descuentos" valor={`-${formatCOP(calc.totales.allowanceTotalAmount)}`} />
        )}
        {calc.totales.chargeTotalAmount > 0 && (
          <FilaTotales label="Cargos" valor={formatCOP(calc.totales.chargeTotalAmount)} />
        )}

        <div className="pt-2 mt-1 border-t border-gold">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-fg-muted">Total a pagar</span>
            <span className="text-2xl font-semibold text-fg tabular-nums">
              {formatCOP(calc.totales.payableAmount)}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

function FilaTotales({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-fg-muted">{label}</span>
      <span className="text-fg tabular-nums">{valor}</span>
    </div>
  )
}
