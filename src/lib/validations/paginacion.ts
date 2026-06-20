import { z } from 'zod'

export const paginacionSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export type Paginado<T> = { items: T[]; total: number; page: number; pageSize: number }
