import { z } from 'zod'

export const clienteSchema = z.object({
  identificationNumber: z.string().min(1, 'Identificación requerida'),
  dv: z.number().int().min(0).max(9).optional(),
  name: z.string().min(1, 'Nombre requerido'),
  phone: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email('Correo inválido').optional().or(z.literal('')),
  merchantRegistration: z.string().optional(),
  typeDocumentIdentId: z.number().int().default(3),
  typeOrganizationId: z.number().int().optional(),
  typeLiabilityId: z.number().int().optional(),
  municipalityId: z.number().int().optional(),
  typeRegimeId: z.number().int().optional(),
  esConsumidorFinal: z.boolean().default(false),
})

export const editarClienteSchema = clienteSchema.extend({
  id: z.string().min(1),
  activo: z.boolean().optional(),
})

export const filtrosClienteSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export type ClienteInput = z.input<typeof clienteSchema>
export type EditarClienteInput = z.input<typeof editarClienteSchema>
