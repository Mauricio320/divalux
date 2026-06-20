import { z } from 'zod'
import { descuentoCargoSchema, lineaFacturaSchema } from './factura'

export const crearCotizacionSchema = z.object({
  clienteId: z.string().min(1, 'Cliente requerido'),
  validezHasta: z.coerce.date().optional(),
  paymentFormId: z.number().int().default(1),
  paymentMethodId: z.number().int().default(10),
  fecha: z.coerce.date().optional(),
  notes: z.string().optional(),
  headNote: z.string().optional(),
  footNote: z.string().optional(),
  lineas: z.array(lineaFacturaSchema).min(1, 'Agrega al menos una línea'),
  descuentosCargos: z.array(descuentoCargoSchema).default([]),
})

export const cambiarEstadoCotizacionSchema = z.object({
  cotizacionId: z.string().min(1),
  estado: z.enum(['BORRADOR', 'ENVIADA', 'APROBADA', 'RECHAZADA', 'VENCIDA']),
})

export const convertirAFacturaSchema = z.object({
  cotizacionId: z.string().min(1),
  bodegaId: z.string().min(1, 'Bodega requerida'),
  fecha: z.coerce.date().optional(),
})

export const filtrosCotizacionSchema = z.object({
  estado: z.enum(['BORRADOR', 'ENVIADA', 'APROBADA', 'RECHAZADA', 'VENCIDA']).optional(),
  clienteId: z.string().optional(),
  desde: z.coerce.date().optional(),
  hasta: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export type CrearCotizacionInput = z.input<typeof crearCotizacionSchema>
export type CotizacionFormValues = z.output<typeof crearCotizacionSchema>
