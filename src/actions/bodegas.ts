'use server'

import { prisma } from '@/lib/prisma'
import { requireOrg } from '@/lib/tenant'
import { bodegaSchema, editarBodegaSchema } from '@/lib/validations/inventario'

export type BodegaDTO = {
  id: string
  nombre: string
  esPrincipal: boolean
  activo: boolean
}

export async function listarBodegas() {
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }
  const bodegas = await prisma.bodega.findMany({
    where: { organizacionId: session.ctx.organizacionId },
    orderBy: [{ esPrincipal: 'desc' }, { nombre: 'asc' }],
  })
  return { success: true as const, data: bodegas.map((b) => ({ id: b.id, nombre: b.nombre, esPrincipal: b.esPrincipal, activo: b.activo })) }
}

export async function crearBodega(raw: unknown) {
  const parsed = bodegaSchema.safeParse(raw)
  if (!parsed.success) return { success: false as const, error: 'Datos inválidos' }
  const session = await requireOrg(['ADMIN'])
  if (!session.ok) return { success: false as const, error: session.error }

  const b = await prisma.$transaction(async (tx) => {
    if (parsed.data.esPrincipal) {
      await tx.bodega.updateMany({ where: { organizacionId: session.ctx.organizacionId }, data: { esPrincipal: false } })
    }
    return tx.bodega.create({ data: { ...parsed.data, organizacionId: session.ctx.organizacionId } })
  })
  return { success: true as const, data: { id: b.id, nombre: b.nombre, esPrincipal: b.esPrincipal, activo: b.activo } }
}

export async function editarBodega(raw: unknown) {
  const parsed = editarBodegaSchema.safeParse(raw)
  if (!parsed.success) return { success: false as const, error: 'Datos inválidos' }
  const session = await requireOrg(['ADMIN'])
  if (!session.ok) return { success: false as const, error: session.error }

  const { id, ...rest } = parsed.data
  const actual = await prisma.bodega.findFirst({ where: { id, organizacionId: session.ctx.organizacionId } })
  if (!actual) return { success: false as const, error: 'Bodega no encontrada' }

  const b = await prisma.$transaction(async (tx) => {
    if (rest.esPrincipal) {
      await tx.bodega.updateMany({
        where: { organizacionId: session.ctx.organizacionId, id: { not: id } },
        data: { esPrincipal: false },
      })
    }
    return tx.bodega.update({ where: { id }, data: rest })
  })
  return { success: true as const, data: { id: b.id, nombre: b.nombre, esPrincipal: b.esPrincipal, activo: b.activo } }
}
