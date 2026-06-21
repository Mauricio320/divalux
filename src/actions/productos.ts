'use server'

import { prisma } from '@/lib/prisma'
import { requireOrg } from '@/lib/tenant'
import { productoSchema, editarProductoSchema, filtrosProductoSchema } from '@/lib/validations/producto'
import { firmarSubidaImagen, eliminarImagen } from '@/lib/cloudinary'
import type { Paginado } from '@/lib/validations/paginacion'
import type { Producto } from '@/generated/prisma/client'

export type ProductoDTO = {
  id: string
  code: string
  nombre: string
  unitMeasureId: number
  typeItemIdentId: number
  precioSinImpuesto: number
  taxId: number
  percent: number
  controlaStock: boolean
  activo: boolean
  imagenUrl: string | null
}

function toDTO(p: Producto): ProductoDTO {
  return {
    id: p.id,
    code: p.code,
    nombre: p.nombre,
    unitMeasureId: p.unitMeasureId,
    typeItemIdentId: p.typeItemIdentId,
    precioSinImpuesto: Number(p.precioSinImpuesto),
    taxId: p.taxId,
    percent: Number(p.percent),
    controlaStock: p.controlaStock,
    activo: p.activo,
    imagenUrl: p.imagenUrl,
  }
}

function imagenNoEsDelTenant(
  organizacionId: string,
  imagenUrl?: string | null,
  imagenPublicId?: string | null,
): boolean {
  const prefijo = `productos/${organizacionId}/`
  if (imagenPublicId != null && !imagenPublicId.startsWith(prefijo)) return true
  if (imagenUrl != null && !imagenUrl.includes(`/${prefijo}`)) return true
  return false
}

export async function listarProductos(raw: unknown) {
  const parsed = filtrosProductoSchema.safeParse(raw ?? {})
  if (!parsed.success) return { success: false as const, error: 'Filtros inválidos' }
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }
  const { q, page, pageSize } = parsed.data

  const where = {
    organizacionId: session.ctx.organizacionId,
    ...(q ? { OR: [{ code: { contains: q, mode: 'insensitive' as const } }, { nombre: { contains: q, mode: 'insensitive' as const } }] } : {}),
  }

  const [items, total] = await Promise.all([
    prisma.producto.findMany({ where, orderBy: { nombre: 'asc' }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.producto.count({ where }),
  ])

  const data: Paginado<ProductoDTO> = { items: items.map(toDTO), total, page, pageSize }
  return { success: true as const, data }
}

export async function getProducto(id: string) {
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }
  const p = await prisma.producto.findFirst({ where: { id, organizacionId: session.ctx.organizacionId } })
  if (!p) return { success: false as const, error: 'Producto no encontrado' }
  return { success: true as const, data: toDTO(p) }
}

export async function firmarSubidaImagenProducto() {
  const session = await requireOrg(['ADMIN'])
  if (!session.ok) return { success: false as const, error: session.error }
  try {
    const data = firmarSubidaImagen(`productos/${session.ctx.organizacionId}`)
    return { success: true as const, data }
  } catch {
    return { success: false as const, error: 'No se pudo preparar la subida de la imagen' }
  }
}

export async function crearProducto(raw: unknown) {
  const parsed = productoSchema.safeParse(raw)
  if (!parsed.success) return { success: false as const, error: 'Datos inválidos' }
  const session = await requireOrg(['ADMIN'])
  if (!session.ok) return { success: false as const, error: session.error }

  if (imagenNoEsDelTenant(session.ctx.organizacionId, parsed.data.imagenUrl, parsed.data.imagenPublicId)) {
    return { success: false as const, error: 'Imagen inválida' }
  }

  const existe = await prisma.producto.findUnique({
    where: { organizacionId_code: { organizacionId: session.ctx.organizacionId, code: parsed.data.code } },
  })
  if (existe) return { success: false as const, error: 'Ya existe un producto con ese código' }

  try {
    const p = await prisma.producto.create({
      data: { ...parsed.data, organizacionId: session.ctx.organizacionId },
    })
    return { success: true as const, data: toDTO(p) }
  } catch {
    return { success: false as const, error: 'No se pudo guardar el producto' }
  }
}

export async function editarProducto(raw: unknown) {
  const parsed = editarProductoSchema.safeParse(raw)
  if (!parsed.success) return { success: false as const, error: 'Datos inválidos' }
  const session = await requireOrg(['ADMIN'])
  if (!session.ok) return { success: false as const, error: session.error }

  if (imagenNoEsDelTenant(session.ctx.organizacionId, parsed.data.imagenUrl, parsed.data.imagenPublicId)) {
    return { success: false as const, error: 'Imagen inválida' }
  }

  const { id, ...rest } = parsed.data
  const actual = await prisma.producto.findFirst({ where: { id, organizacionId: session.ctx.organizacionId } })
  if (!actual) return { success: false as const, error: 'Producto no encontrado' }

  try {
    const p = await prisma.producto.update({ where: { id }, data: rest })

    if (actual.imagenPublicId && actual.imagenPublicId !== p.imagenPublicId) {
      try {
        await eliminarImagen(actual.imagenPublicId)
      } catch {
        // El asset anterior queda huérfano; tolerable en v1, no debe romper la edición.
      }
    }

    return { success: true as const, data: toDTO(p) }
  } catch {
    return { success: false as const, error: 'No se pudo guardar el producto' }
  }
}
