'use server'

import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'
import { requireOrg } from '@/lib/tenant'
import { ajustarStockTx } from '@/lib/inventario/movimientos'
import { TipoMovimiento } from '@/generated/prisma/client'
import {
  ajusteSchema,
  filtrosStockSchema,
  movimientoSchema,
  trasladoSchema,
} from '@/lib/validations/inventario'

export type StockDTO = {
  productoId: string
  productoCode: string
  productoNombre: string
  bodegaId: string
  bodegaNombre: string
  cantidad: number
}

export type MovimientoDTO = {
  id: string
  tipo: TipoMovimiento
  productoNombre: string
  bodegaNombre: string
  cantidad: number
  saldoResultante: number
  motivo: string | null
  createdAt: string
}

async function validarProductoBodega(organizacionId: string, productoId: string, bodegaId: string) {
  const [producto, bodega] = await Promise.all([
    prisma.producto.findFirst({ where: { id: productoId, organizacionId } }),
    prisma.bodega.findFirst({ where: { id: bodegaId, organizacionId } }),
  ])
  if (!producto) return { ok: false as const, error: 'Producto no encontrado' }
  if (!bodega) return { ok: false as const, error: 'Bodega no encontrada' }
  return { ok: true as const, producto, bodega }
}

export async function getStock(raw: unknown) {
  const parsed = filtrosStockSchema.safeParse(raw ?? {})
  if (!parsed.success) return { success: false as const, error: 'Filtros inválidos' }
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }

  const rows = await prisma.stock.findMany({
    where: {
      organizacionId: session.ctx.organizacionId,
      ...(parsed.data.bodegaId ? { bodegaId: parsed.data.bodegaId } : {}),
      ...(parsed.data.productoId ? { productoId: parsed.data.productoId } : {}),
    },
    include: { producto: { select: { code: true, nombre: true } }, bodega: { select: { nombre: true } } },
    orderBy: { producto: { nombre: 'asc' } },
  })

  const data: StockDTO[] = rows.map((s) => ({
    productoId: s.productoId,
    productoCode: s.producto.code,
    productoNombre: s.producto.nombre,
    bodegaId: s.bodegaId,
    bodegaNombre: s.bodega.nombre,
    cantidad: Number(s.cantidad),
  }))
  return { success: true as const, data }
}

export async function listarMovimientos(raw: unknown) {
  const parsed = filtrosStockSchema.safeParse(raw ?? {})
  if (!parsed.success) return { success: false as const, error: 'Filtros inválidos' }
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }

  const rows = await prisma.movimientoInventario.findMany({
    where: {
      organizacionId: session.ctx.organizacionId,
      ...(parsed.data.bodegaId ? { bodegaId: parsed.data.bodegaId } : {}),
      ...(parsed.data.productoId ? { productoId: parsed.data.productoId } : {}),
    },
    include: { producto: { select: { nombre: true } }, bodega: { select: { nombre: true } } },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  const data: MovimientoDTO[] = rows.map((m) => ({
    id: m.id,
    tipo: m.tipo,
    productoNombre: m.producto.nombre,
    bodegaNombre: m.bodega.nombre,
    cantidad: Number(m.cantidad),
    saldoResultante: Number(m.saldoResultante),
    motivo: m.motivo,
    createdAt: m.createdAt.toISOString(),
  }))
  return { success: true as const, data }
}

export async function registrarEntrada(raw: unknown) {
  const parsed = movimientoSchema.safeParse(raw)
  if (!parsed.success) return { success: false as const, error: 'Datos inválidos' }
  const session = await requireOrg(['ADMIN'])
  if (!session.ok) return { success: false as const, error: session.error }
  const { organizacionId, userId } = session.ctx

  const val = await validarProductoBodega(organizacionId, parsed.data.productoId, parsed.data.bodegaId)
  if (!val.ok) return { success: false as const, error: val.error }
  if (!val.producto.controlaStock) return { success: false as const, error: 'El producto no controla stock' }

  await prisma.$transaction((tx) =>
    ajustarStockTx(tx, {
      organizacionId,
      productoId: parsed.data.productoId,
      bodegaId: parsed.data.bodegaId,
      delta: parsed.data.cantidad,
      tipo: TipoMovimiento.ENTRADA,
      registradoPorId: userId,
      motivo: parsed.data.motivo,
      permitirStockNegativo: true,
      controlaStock: true,
    }),
  )
  return { success: true as const }
}

export async function registrarAjuste(raw: unknown) {
  const parsed = ajusteSchema.safeParse(raw)
  if (!parsed.success) return { success: false as const, error: 'Datos inválidos' }
  const session = await requireOrg(['ADMIN'])
  if (!session.ok) return { success: false as const, error: session.error }
  const { organizacionId, userId } = session.ctx

  const val = await validarProductoBodega(organizacionId, parsed.data.productoId, parsed.data.bodegaId)
  if (!val.ok) return { success: false as const, error: val.error }
  if (!val.producto.controlaStock) return { success: false as const, error: 'El producto no controla stock' }

  await prisma.$transaction(async (tx) => {
    const stock = await tx.stock.findUnique({
      where: {
        organizacionId_productoId_bodegaId: {
          organizacionId,
          productoId: parsed.data.productoId,
          bodegaId: parsed.data.bodegaId,
        },
      },
      select: { cantidad: true },
    })
    const saldoActual = stock ? Number(stock.cantidad) : 0
    const delta = parsed.data.cantidadFinal - saldoActual
    await ajustarStockTx(tx, {
      organizacionId,
      productoId: parsed.data.productoId,
      bodegaId: parsed.data.bodegaId,
      delta,
      tipo: TipoMovimiento.AJUSTE,
      registradoPorId: userId,
      motivo: parsed.data.motivo,
      permitirStockNegativo: true,
      controlaStock: true,
    })
  })
  return { success: true as const }
}

export async function trasladarEntreBodegas(raw: unknown) {
  const parsed = trasladoSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }
  const session = await requireOrg(['ADMIN'])
  if (!session.ok) return { success: false as const, error: session.error }
  const { organizacionId, userId } = session.ctx

  const [producto, origen, destino] = await Promise.all([
    prisma.producto.findFirst({ where: { id: parsed.data.productoId, organizacionId } }),
    prisma.bodega.findFirst({ where: { id: parsed.data.bodegaOrigenId, organizacionId } }),
    prisma.bodega.findFirst({ where: { id: parsed.data.bodegaDestinoId, organizacionId } }),
  ])
  if (!producto) return { success: false as const, error: 'Producto no encontrado' }
  if (!origen || !destino) return { success: false as const, error: 'Bodega no encontrada' }
  if (!producto.controlaStock) return { success: false as const, error: 'El producto no controla stock' }

  const org = await prisma.organizacion.findUnique({
    where: { id: organizacionId },
    select: { permitirStockNegativo: true },
  })
  const grupo = randomUUID()

  try {
    await prisma.$transaction(async (tx) => {
      await ajustarStockTx(tx, {
        organizacionId,
        productoId: parsed.data.productoId,
        bodegaId: parsed.data.bodegaOrigenId,
        delta: -parsed.data.cantidad,
        tipo: TipoMovimiento.TRASLADO_SALIDA,
        registradoPorId: userId,
        motivo: parsed.data.motivo,
        trasladoGrupoId: grupo,
        permitirStockNegativo: org?.permitirStockNegativo ?? false,
        controlaStock: true,
      })
      await ajustarStockTx(tx, {
        organizacionId,
        productoId: parsed.data.productoId,
        bodegaId: parsed.data.bodegaDestinoId,
        delta: parsed.data.cantidad,
        tipo: TipoMovimiento.TRASLADO_ENTRADA,
        registradoPorId: userId,
        motivo: parsed.data.motivo,
        trasladoGrupoId: grupo,
        permitirStockNegativo: true,
        controlaStock: true,
      })
    })
  } catch (e) {
    return { success: false as const, error: e instanceof Error ? e.message : 'No se pudo trasladar' }
  }
  return { success: true as const }
}
