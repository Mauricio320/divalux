import { z } from 'zod'

export const crearUsuarioSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  role: z.enum(['ADMIN', 'VENDEDOR']).default('VENDEDOR'),
})

export type CrearUsuarioInput = z.input<typeof crearUsuarioSchema>
