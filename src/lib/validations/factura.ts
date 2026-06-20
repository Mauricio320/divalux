import { z } from 'zod'

export const lineaFacturaSchema = z.object({
  productoId: z.string().min(1, 'Producto requerido'),
  descripcion: z.string().optional(),
  cantidad: z.number().positive('La cantidad debe ser mayor a 0'),
  precioUnitarioSinImpuesto: z.number().min(0, 'Precio inválido'),
  taxId: z.number().int(),
  percent: z.number().min(0),
  unitMeasureId: z.number().int().default(70),
  notes: z.string().optional(),
})

export const descuentoCargoSchema = z.object({
  esCargo: z.boolean(),
  monto: z.number().positive('El monto debe ser mayor a 0'),
  baseAmount: z.number().min(0).optional(),
  discountId: z.number().int().optional(),
  razon: z.string().min(1, 'Indica el motivo'),
})

export const crearFacturaSchema = z
  .object({
    clienteId: z.string().min(1, 'Cliente requerido'),
    bodegaId: z.string().min(1, 'Bodega requerida'),
    resolucionId: z.string().optional(),
    paymentFormId: z.number().int().default(1),
    paymentMethodId: z.number().int().default(10),
    paymentDueDate: z.coerce.date().optional(),
    durationMeasure: z.string().optional(),
    fecha: z.coerce.date().optional(),
    notes: z.string().optional(),
    headNote: z.string().optional(),
    footNote: z.string().optional(),
    sendmail: z.boolean().default(false),
    lineas: z.array(lineaFacturaSchema).min(1, 'Agrega al menos una línea'),
    descuentosCargos: z.array(descuentoCargoSchema).default([]),
  })
  .refine((d) => d.paymentFormId !== 2 || !!d.paymentDueDate, {
    message: 'La fecha de vencimiento es obligatoria a crédito',
    path: ['paymentDueDate'],
  })

export const confirmarFacturaSchema = z.object({ facturaId: z.string().min(1) })

export const anularFacturaSchema = z.object({
  facturaId: z.string().min(1),
  motivo: z.string().optional(),
})

export const filtrosFacturaSchema = z.object({
  estado: z.enum(['BORRADOR', 'CONFIRMADA', 'ANULADA', 'EMITIDA', 'RECHAZADA']).optional(),
  clienteId: z.string().optional(),
  desde: z.coerce.date().optional(),
  hasta: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export type CrearFacturaInput = z.input<typeof crearFacturaSchema>
export type FacturaFormValues = z.output<typeof crearFacturaSchema>
export type LineaFacturaInput = z.input<typeof lineaFacturaSchema>
export type DescuentoCargoFormInput = z.input<typeof descuentoCargoSchema>

// Tipo de valores de formulario compartido por Factura y Cotización (superset).
// Permite reusar los subcomponentes de líneas/descuentos/totales sin genéricos de RHF.
export type DocumentoFormValues = {
  clienteId: string
  bodegaId?: string
  resolucionId?: string
  validezHasta?: Date
  paymentFormId: number
  paymentMethodId: number
  paymentDueDate?: Date
  durationMeasure?: string
  fecha?: Date
  notes?: string
  headNote?: string
  footNote?: string
  sendmail?: boolean
  lineas: LineaFacturaInput[]
  descuentosCargos: DescuentoCargoFormInput[]
}
