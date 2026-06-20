import { z } from 'zod'

export const setupSchema = z.object({
  empresaNombre: z.string().min(1, 'Nombre de empresa requerido'),
  razonSocial: z.string().min(1, 'Razón social requerida'),
  nit: z.string().min(1, 'NIT requerido'),
  dv: z.number().int().min(0).max(9),
  municipalityId: z.number().int(),
  typeRegimeId: z.number().int().default(1),
  typeOrganizationId: z.number().int().default(1),
  softwareName: z.string().min(1, 'Nombre del software requerido'),
  adminNombre: z.string().min(1, 'Nombre requerido'),
  adminEmail: z.string().email('Correo inválido'),
  adminPassword: z.string().min(8, 'Mínimo 8 caracteres'),
})

export type SetupInput = z.input<typeof setupSchema>
