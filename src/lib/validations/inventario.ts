import { z } from 'zod'

export const bodegaSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  esPrincipal: z.boolean().default(false),
})

export const editarBodegaSchema = bodegaSchema.extend({
  id: z.string().min(1),
  activo: z.boolean().optional(),
})

export const movimientoSchema = z.object({
  productoId: z.string().min(1, 'Producto requerido'),
  bodegaId: z.string().min(1, 'Bodega requerida'),
  cantidad: z.number().positive('La cantidad debe ser mayor a 0'),
  motivo: z.string().optional(),
})

export const ajusteSchema = z.object({
  productoId: z.string().min(1, 'Producto requerido'),
  bodegaId: z.string().min(1, 'Bodega requerida'),
  cantidadFinal: z.number().min(0, 'Cantidad inválida'),
  motivo: z.string().optional(),
})

export const trasladoSchema = z
  .object({
    productoId: z.string().min(1, 'Producto requerido'),
    bodegaOrigenId: z.string().min(1, 'Bodega origen requerida'),
    bodegaDestinoId: z.string().min(1, 'Bodega destino requerida'),
    cantidad: z.number().positive('La cantidad debe ser mayor a 0'),
    motivo: z.string().optional(),
  })
  .refine((d) => d.bodegaOrigenId !== d.bodegaDestinoId, {
    message: 'Las bodegas deben ser distintas',
    path: ['bodegaDestinoId'],
  })

export const filtrosStockSchema = z.object({
  bodegaId: z.string().optional(),
  productoId: z.string().optional(),
})

export type BodegaInput = z.input<typeof bodegaSchema>
export type MovimientoInput = z.input<typeof movimientoSchema>
export type AjusteInput = z.input<typeof ajusteSchema>
export type TrasladoInput = z.input<typeof trasladoSchema>
