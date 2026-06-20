export const TAX_NO_APLICA = 22

export type LineaInput = {
  cantidad: number
  precioUnitarioSinImpuesto: number
  taxId: number
  percent: number
}

export type DescuentoCargoInput = {
  esCargo: boolean
  monto: number
  baseAmount?: number
}

export type LineaCalculada = {
  cantidad: number
  precioUnitarioSinImpuesto: number
  taxId: number
  percent: number
  lineExtensionAmount: number
  tieneImpuesto: boolean
  taxableAmount: number
  taxAmount: number
}

export type TaxTotal = {
  taxId: number
  percent: number
  taxableAmount: number
  taxAmount: number
}

export type LegalMonetaryTotals = {
  lineExtensionAmount: number
  taxExclusiveAmount: number
  taxInclusiveAmount: number
  allowanceTotalAmount: number
  chargeTotalAmount: number
  payableAmount: number
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export function aSinImpuesto(precioConImpuesto: number, percent: number): number {
  if (!percent) return round2(precioConImpuesto)
  return round2(precioConImpuesto / (1 + percent / 100))
}

export function calcularLinea(linea: LineaInput): LineaCalculada {
  const lineExtensionAmount = round2(linea.precioUnitarioSinImpuesto * linea.cantidad)
  const tieneImpuesto = linea.taxId !== TAX_NO_APLICA
  const taxableAmount = tieneImpuesto ? lineExtensionAmount : 0
  const taxAmount = tieneImpuesto ? round2((taxableAmount * linea.percent) / 100) : 0
  return {
    ...linea,
    lineExtensionAmount,
    tieneImpuesto,
    taxableAmount,
    taxAmount,
  }
}

export function consolidarTaxTotals(lineas: LineaCalculada[]): TaxTotal[] {
  const mapa = new Map<string, TaxTotal>()
  for (const l of lineas) {
    if (!l.tieneImpuesto) continue
    const key = `${l.taxId}|${l.percent}`
    const actual = mapa.get(key)
    if (actual) {
      actual.taxableAmount = round2(actual.taxableAmount + l.taxableAmount)
      actual.taxAmount = round2(actual.taxAmount + l.taxAmount)
    } else {
      mapa.set(key, {
        taxId: l.taxId,
        percent: l.percent,
        taxableAmount: l.taxableAmount,
        taxAmount: l.taxAmount,
      })
    }
  }
  return [...mapa.values()]
}

export function calcularLegalMonetaryTotals(
  lineas: LineaCalculada[],
  descuentosCargos: DescuentoCargoInput[],
): LegalMonetaryTotals {
  let lineExtensionAmount = 0
  let taxExclusiveAmount = 0
  let taxInclusiveAmount = 0
  for (const l of lineas) {
    lineExtensionAmount = round2(lineExtensionAmount + l.lineExtensionAmount)
    if (l.tieneImpuesto) taxExclusiveAmount = round2(taxExclusiveAmount + l.lineExtensionAmount)
    taxInclusiveAmount = round2(taxInclusiveAmount + l.lineExtensionAmount + l.taxAmount)
  }
  let allowanceTotalAmount = 0
  let chargeTotalAmount = 0
  for (const dc of descuentosCargos) {
    if (dc.esCargo) chargeTotalAmount = round2(chargeTotalAmount + dc.monto)
    else allowanceTotalAmount = round2(allowanceTotalAmount + dc.monto)
  }
  const payableAmount = round2(taxInclusiveAmount + chargeTotalAmount - allowanceTotalAmount)
  return {
    lineExtensionAmount,
    taxExclusiveAmount,
    taxInclusiveAmount,
    allowanceTotalAmount,
    chargeTotalAmount,
    payableAmount,
  }
}

export function calcularFacturaCompleta(input: {
  lineas: LineaInput[]
  descuentosCargos: DescuentoCargoInput[]
}): {
  lineas: LineaCalculada[]
  taxTotals: TaxTotal[]
  totales: LegalMonetaryTotals
} {
  const lineas = input.lineas.map(calcularLinea)
  const taxTotals = consolidarTaxTotals(lineas)
  const totales = calcularLegalMonetaryTotals(lineas, input.descuentosCargos)
  return { lineas, taxTotals, totales }
}
