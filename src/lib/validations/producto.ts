import { z } from 'zod'

export const productoSchema = z.object({
  code: z.string().min(1, 'Código requerido'),
  nombre: z.string().min(1, 'Nombre requerido'),
  unitMeasureId: z.number().int().default(70),
  typeItemIdentId: z.number().int().default(4),
  precioSinImpuesto: z.number().min(0, 'Precio inválido'),
  taxId: z.number().int().default(1),
  percent: z.number().min(0).default(0),
  controlaStock: z.boolean().default(true),
  imagenUrl: z.string().url('URL de imagen inválida').nullish(),
  imagenPublicId: z.string().nullish(),
})

export const editarProductoSchema = productoSchema.extend({
  id: z.string().min(1),
  activo: z.boolean().optional(),
})

export const filtrosProductoSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export type ProductoInput = z.input<typeof productoSchema>
export type EditarProductoInput = z.input<typeof editarProductoSchema>
