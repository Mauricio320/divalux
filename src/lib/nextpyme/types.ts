export type NextpymeCustomer = {
  identification_number: number
  name: string
  merchant_registration?: string
  dv?: number
  phone?: string
  address?: string
  email?: string
  type_document_identification_id?: number
  type_organization_id?: number
  type_liability_id?: number
  municipality_id?: number
  type_regime_id?: number
}

export type NextpymeTaxTotal = {
  tax_id: number
  percent: string
  taxable_amount: string
  tax_amount: string
}

export type NextpymeInvoiceLine = {
  code: string
  description: string
  notes?: string
  unit_measure_id: number
  invoiced_quantity: string
  base_quantity: string
  price_amount: string
  line_extension_amount: string
  free_of_charge_indicator: boolean
  type_item_identification_id: number
  tax_totals?: NextpymeTaxTotal[]
}

export type NextpymeAllowanceCharge = {
  charge_indicator: boolean
  amount: string
  base_amount: string
  discount_id?: number
  allowance_charge_reason: string
}

export type NextpymeLegalMonetaryTotals = {
  line_extension_amount: string
  tax_exclusive_amount: string
  tax_inclusive_amount: string
  allowance_total_amount: string
  charge_total_amount: string
  payable_amount: string
}

export type NextpymePaymentForm = {
  payment_form_id: number
  payment_method_id: number
  payment_due_date?: string
  duration_measure?: string
}

export type InvoicePayload = {
  number: number
  type_document_id: number
  date: string
  time: string
  resolution_number: string
  prefix: string
  notes?: string
  head_note?: string
  foot_note?: string
  sendmail: boolean
  sendmailtome: boolean
  operation_mode: { company: string; software: string }
  customer: NextpymeCustomer
  payment_form: NextpymePaymentForm
  allowance_charges?: NextpymeAllowanceCharge[]
  tax_totals: NextpymeTaxTotal[]
  legal_monetary_totals: NextpymeLegalMonetaryTotals
  invoice_lines: NextpymeInvoiceLine[]
}

// Respuesta de la API Nextpyme (fase 2)
export type ResponseDian = {
  success?: boolean
  message?: string
  cufe?: string
  uuid_dian?: string
  urlinvoicexml?: string
  urlinvoicepdf?: string
  urlinvoiceattached?: string
  certificate_days_left?: number
  resolution_days_left?: number
  ResponseDian?: {
    Envelope?: {
      Body?: {
        SendBillSyncResponse?: {
          SendBillSyncResult?: {
            IsValid?: string
            StatusCode?: string
            StatusDescription?: string
            StatusMessage?: string
            ErrorMessage?: { string?: string | string[] }
            XmlDocumentKey?: string
          }
        }
      }
    }
  }
}
