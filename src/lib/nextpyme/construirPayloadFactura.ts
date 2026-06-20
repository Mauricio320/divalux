import type {
  InvoicePayload,
  NextpymeAllowanceCharge,
  NextpymeCustomer,
  NextpymeInvoiceLine,
  NextpymeTaxTotal,
} from './types'

export const CONSUMIDOR_FINAL_ID = '222222222222'

export type EmisorPayload = {
  razonSocial: string
  nit: string
  dv: number
  softwareName: string
}

export type ClientePayload = {
  identificationNumber: string
  dv?: number | null
  name: string
  phone?: string | null
  address?: string | null
  email?: string | null
  merchantRegistration?: string | null
  typeDocumentIdentId: number
  typeOrganizationId?: number | null
  typeLiabilityId?: number | null
  municipalityId?: number | null
  typeRegimeId?: number | null
  esConsumidorFinal: boolean
}

export type LineaPayload = {
  code: string
  description: string
  notes?: string | null
  unitMeasureId: number
  invoicedQuantity: number
  baseQuantity: number
  priceAmount: number
  lineExtensionAmount: number
  freeOfChargeIndicator: boolean
  typeItemIdentId: number
  impuestos: { taxId: number; percent: number; taxableAmount: number; taxAmount: number }[]
}

export type AllowancePayload = {
  chargeIndicator: boolean
  amount: number
  baseAmount: number
  discountId?: number | null
  reason: string
}

export type TaxTotalPayload = {
  taxId: number
  percent: number
  taxableAmount: number
  taxAmount: number
}

export type TotalesPayload = {
  lineExtensionAmount: number
  taxExclusiveAmount: number
  taxInclusiveAmount: number
  allowanceTotalAmount: number
  chargeTotalAmount: number
  payableAmount: number
}

export type FacturaParaPayload = {
  numero: number
  typeDocumentId: number
  prefix: string
  resolutionNumber: string
  fecha: Date
  hora?: string | null
  notes?: string | null
  headNote?: string | null
  footNote?: string | null
  sendmail: boolean
  sendmailtome: boolean
  paymentFormId: number
  paymentMethodId: number
  paymentDueDate?: Date | null
  durationMeasure?: string | null
  emisor: EmisorPayload
  cliente: ClientePayload
  lineas: LineaPayload[]
  taxTotals: TaxTotalPayload[]
  totales: TotalesPayload
  allowanceCharges: AllowancePayload[]
}

const f2 = (n: number): string => n.toFixed(2)
const fecha = (d: Date): string => d.toISOString().slice(0, 10)

function construirCustomer(c: ClientePayload): NextpymeCustomer {
  if (c.esConsumidorFinal || c.identificationNumber === CONSUMIDOR_FINAL_ID) {
    return {
      identification_number: Number(c.identificationNumber),
      name: c.name,
      merchant_registration: c.merchantRegistration ?? '0000000-00',
    }
  }
  return {
    identification_number: Number(c.identificationNumber),
    dv: c.dv ?? undefined,
    name: c.name,
    phone: c.phone ?? undefined,
    address: c.address ?? undefined,
    email: c.email ?? undefined,
    merchant_registration: c.merchantRegistration ?? undefined,
    type_document_identification_id: c.typeDocumentIdentId,
    type_organization_id: c.typeOrganizationId ?? undefined,
    type_liability_id: c.typeLiabilityId ?? undefined,
    municipality_id: c.municipalityId ?? undefined,
    type_regime_id: c.typeRegimeId ?? undefined,
  }
}

function construirLinea(l: LineaPayload): NextpymeInvoiceLine {
  const tax_totals: NextpymeTaxTotal[] = l.impuestos.map((t) => ({
    tax_id: t.taxId,
    percent: t.percent.toFixed(2),
    taxable_amount: f2(t.taxableAmount),
    tax_amount: f2(t.taxAmount),
  }))
  return {
    code: l.code,
    description: l.description,
    notes: l.notes ?? undefined,
    unit_measure_id: l.unitMeasureId,
    invoiced_quantity: String(l.invoicedQuantity),
    base_quantity: String(l.baseQuantity),
    price_amount: f2(l.priceAmount),
    line_extension_amount: f2(l.lineExtensionAmount),
    free_of_charge_indicator: l.freeOfChargeIndicator,
    type_item_identification_id: l.typeItemIdentId,
    tax_totals: tax_totals.length ? tax_totals : undefined,
  }
}

export function construirPayloadFactura(f: FacturaParaPayload): InvoicePayload {
  const tax_totals: NextpymeTaxTotal[] = f.taxTotals.map((t) => ({
    tax_id: t.taxId,
    percent: String(t.percent),
    taxable_amount: f2(t.taxableAmount),
    tax_amount: f2(t.taxAmount),
  }))

  const allowance_charges: NextpymeAllowanceCharge[] = f.allowanceCharges.map((a) => ({
    charge_indicator: a.chargeIndicator,
    amount: f2(a.amount),
    base_amount: f2(a.baseAmount),
    discount_id: a.discountId ?? undefined,
    allowance_charge_reason: a.reason,
  }))

  return {
    number: f.numero,
    type_document_id: f.typeDocumentId,
    date: fecha(f.fecha),
    time: f.hora ?? '00:00:00',
    resolution_number: f.resolutionNumber,
    prefix: f.prefix,
    notes: f.notes ?? undefined,
    head_note: f.headNote ?? undefined,
    foot_note: f.footNote ?? undefined,
    sendmail: f.sendmail,
    sendmailtome: f.sendmailtome,
    operation_mode: {
      company: `${f.emisor.razonSocial} - NIT: ${f.emisor.nit}-${f.emisor.dv}`,
      software: f.emisor.softwareName,
    },
    customer: construirCustomer(f.cliente),
    payment_form: {
      payment_form_id: f.paymentFormId,
      payment_method_id: f.paymentMethodId,
      payment_due_date: f.paymentDueDate ? fecha(f.paymentDueDate) : undefined,
      duration_measure: f.durationMeasure ?? undefined,
    },
    allowance_charges: allowance_charges.length ? allowance_charges : undefined,
    tax_totals,
    legal_monetary_totals: {
      line_extension_amount: f2(f.totales.lineExtensionAmount),
      tax_exclusive_amount: f2(f.totales.taxExclusiveAmount),
      tax_inclusive_amount: f2(f.totales.taxInclusiveAmount),
      allowance_total_amount: f2(f.totales.allowanceTotalAmount),
      charge_total_amount: f2(f.totales.chargeTotalAmount),
      payable_amount: f2(f.totales.payableAmount),
    },
    invoice_lines: f.lineas.map(construirLinea),
  }
}
