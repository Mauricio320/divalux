'use client'

import { useWatch, type Control } from 'react-hook-form'
import { calcularFacturaCompleta } from '@/lib/totales'
import { formatCOP } from '@/lib/format'
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
    descuentosCargos: descuentosCargos.map((d) => ({ esCargo: !!d?.esCargo, monto: Number(d?.monto) || 0 })),
  })

  const fila = (label: string, valor: number, fuerte = false) => (
    <div className={`flex justify-between py-1 text-sm ${fuerte ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
      <span>{label}</span>
      <span>{formatCOP(valor)}</span>
    </div>
  )

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      {fila('Subtotal', calc.totales.lineExtensionAmount)}
      {calc.taxTotals.map((t) => fila(`IVA ${t.percent}%`, t.taxAmount))}
      {calc.totales.allowanceTotalAmount > 0 && fila('Descuentos', -calc.totales.allowanceTotalAmount)}
      {calc.totales.chargeTotalAmount > 0 && fila('Cargos', calc.totales.chargeTotalAmount)}
      <div className="mt-1 border-t border-gray-200 pt-1">{fila('Total a pagar', calc.totales.payableAmount, true)}</div>
    </div>
  )
}
