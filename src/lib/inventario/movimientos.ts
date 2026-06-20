import { Prisma, TipoMovimiento } from '@/generated/prisma/client'

type Tx = Prisma.TransactionClient

export type AjusteStock = {
  organizacionId: string
  productoId: string
  bodegaId: string
  delta: number
  tipo: TipoMovimiento
  registradoPorId: string
  facturaId?: string | null
  motivo?: string | null
  trasladoGrupoId?: string | null
  permitirStockNegativo: boolean
  controlaStock: boolean
}

export async function ajustarStockTx(tx: Tx, a: AjusteStock): Promise<{ saldoResultante: number }> {
  if (!a.controlaStock) {
    return { saldoResultante: 0 }
  }

  const stock = await tx.stock.findUnique({
    where: {
      organizacionId_productoId_bodegaId: {
        organizacionId: a.organizacionId,
        productoId: a.productoId,
        bodegaId: a.bodegaId,
      },
    },
    select: { cantidad: true },
  })

  const saldoActual = stock ? Number(stock.cantidad) : 0
  const nuevo = Math.round((saldoActual + a.delta) * 1000) / 1000

  if (nuevo < 0 && !a.permitirStockNegativo) {
    throw new Error('Stock insuficiente en la bodega para el producto')
  }

  await tx.stock.upsert({
    where: {
      organizacionId_productoId_bodegaId: {
        organizacionId: a.organizacionId,
        productoId: a.productoId,
        bodegaId: a.bodegaId,
      },
    },
    create: {
      organizacionId: a.organizacionId,
      productoId: a.productoId,
      bodegaId: a.bodegaId,
      cantidad: nuevo,
    },
    update: { cantidad: nuevo },
  })

  await tx.movimientoInventario.create({
    data: {
      organizacionId: a.organizacionId,
      tipo: a.tipo,
      productoId: a.productoId,
      bodegaId: a.bodegaId,
      cantidad: Math.abs(a.delta),
      saldoResultante: nuevo,
      trasladoGrupoId: a.trasladoGrupoId ?? null,
      facturaId: a.facturaId ?? null,
      registradoPorId: a.registradoPorId,
      motivo: a.motivo ?? null,
    },
  })

  return { saldoResultante: nuevo }
}

export type LineaVenta = { productoId: string; cantidad: number; controlaStock: boolean }

export async function descontarVentaTx(
  tx: Tx,
  args: {
    organizacionId: string
    facturaId: string
    registradoPorId: string
    bodegaId: string
    permitirStockNegativo: boolean
    lineas: LineaVenta[]
  },
): Promise<void> {
  const porProducto = new Map<string, { cantidad: number; controlaStock: boolean }>()
  for (const l of args.lineas) {
    const actual = porProducto.get(l.productoId)
    if (actual) actual.cantidad += l.cantidad
    else porProducto.set(l.productoId, { cantidad: l.cantidad, controlaStock: l.controlaStock })
  }

  for (const [productoId, { cantidad, controlaStock }] of porProducto) {
    await ajustarStockTx(tx, {
      organizacionId: args.organizacionId,
      productoId,
      bodegaId: args.bodegaId,
      delta: -cantidad,
      tipo: TipoMovimiento.VENTA,
      registradoPorId: args.registradoPorId,
      facturaId: args.facturaId,
      permitirStockNegativo: args.permitirStockNegativo,
      controlaStock,
    })
  }
}

export async function reversarVentaTx(
  tx: Tx,
  args: { organizacionId: string; facturaId: string; registradoPorId: string },
): Promise<void> {
  const ventas = await tx.movimientoInventario.findMany({
    where: { organizacionId: args.organizacionId, facturaId: args.facturaId, tipo: TipoMovimiento.VENTA },
    select: { productoId: true, bodegaId: true, cantidad: true },
  })

  for (const v of ventas) {
    await ajustarStockTx(tx, {
      organizacionId: args.organizacionId,
      productoId: v.productoId,
      bodegaId: v.bodegaId,
      delta: Number(v.cantidad),
      tipo: TipoMovimiento.REVERSA,
      registradoPorId: args.registradoPorId,
      facturaId: args.facturaId,
      permitirStockNegativo: true,
      controlaStock: true,
    })
  }
}
