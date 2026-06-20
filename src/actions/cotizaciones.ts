'use server'

import { Prisma, type EstadoCotizacion } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { requireOrg } from '@/lib/tenant'
import { calcularFacturaCompleta } from '@/lib/totales'
import { crearFacturaBorradorTx } from '@/lib/facturas/crearBorrador'
import {
  cambiarEstadoCotizacionSchema,
  convertirAFacturaSchema,
  crearCotizacionSchema,
  filtrosCotizacionSchema,
} from '@/lib/validations/cotizacion'
import type { FacturaFormValues } from '@/lib/validations/factura'
import type { Paginado } from '@/lib/validations/paginacion'

export type CotizacionListaDTO = {
  id: string
  numero: number
  prefix: string
  estado: EstadoCotizacion
  fecha: string
  validezHasta: string | null
  clienteName: string
  payableAmount: number
  facturaGeneradaId: string | null
}

export type CotizacionDetalleDTO = {
  id: string
  estado: EstadoCotizacion
  numero: number
  prefix: string
  fecha: string
  validezHasta: string | null
  clienteName: string
  clienteIdentificationNumber: string
  vendedorNombre: string
  facturaGeneradaId: string | null
  notes: string | null
  lineas: {
    id: string
    code: string
    description: string
    invoicedQuantity: number
    priceAmount: number
    lineExtensionAmount: number
  }[]
  totales: {
    lineExtensionAmount: number
    taxInclusiveAmount: number
    allowanceTotalAmount: number
    payableAmount: number
  }
}

function estadoEfectivo(estado: EstadoCotizacion, validezHasta: Date | null): EstadoCotizacion {
  if ((estado === 'BORRADOR' || estado === 'ENVIADA') && validezHasta && validezHasta < new Date()) {
    return 'VENCIDA'
  }
  return estado
}

export async function crearCotizacion(raw: unknown) {
  const parsed = crearCotizacionSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }
  const { organizacionId, userId } = session.ctx
  const d = parsed.data

  const cliente = await prisma.cliente.findFirst({ where: { id: d.clienteId, organizacionId } })
  if (!cliente) return { success: false as const, error: 'Cliente no encontrado' }

  const productoIds = [...new Set(d.lineas.map((l) => l.productoId))]
  const productos = await prisma.producto.findMany({ where: { id: { in: productoIds }, organizacionId } })
  if (productos.length !== productoIds.length) return { success: false as const, error: 'Producto no encontrado' }
  const prodMap = new Map(productos.map((p) => [p.id, p]))

  const calc = calcularFacturaCompleta({
    lineas: d.lineas.map((l) => ({
      cantidad: l.cantidad,
      precioUnitarioSinImpuesto: l.precioUnitarioSinImpuesto,
      taxId: l.taxId,
      percent: l.percent,
    })),
    descuentosCargos: d.descuentosCargos.map((dc) => ({ esCargo: dc.esCargo, monto: dc.monto, baseAmount: dc.baseAmount })),
  })

  const cotizacion = await prisma.$transaction(async (tx) => {
    const org = await tx.organizacion.update({
      where: { id: organizacionId },
      data: { secuenciaCotizacion: { increment: 1 } },
      select: { secuenciaCotizacion: true },
    })
    const numero = org.secuenciaCotizacion

    const c = await tx.cotizacion.create({
      data: {
        organizacionId,
        estado: 'BORRADOR',
        numero,
        clienteId: cliente.id,
        clienteIdentificationNumber: cliente.identificationNumber,
        clienteName: cliente.name,
        vendedorId: userId,
        validezHasta: d.validezHasta,
        fecha: d.fecha ?? new Date(),
        paymentFormId: d.paymentFormId,
        paymentMethodId: d.paymentMethodId,
        notes: d.notes,
        headNote: d.headNote,
        footNote: d.footNote,
        lineExtensionAmount: calc.totales.lineExtensionAmount,
        taxExclusiveAmount: calc.totales.taxExclusiveAmount,
        taxInclusiveAmount: calc.totales.taxInclusiveAmount,
        allowanceTotalAmount: calc.totales.allowanceTotalAmount,
        chargeTotalAmount: calc.totales.chargeTotalAmount,
        payableAmount: calc.totales.payableAmount,
      },
    })

    for (let i = 0; i < d.lineas.length; i++) {
      const linput = d.lineas[i]
      const lcalc = calc.lineas[i]
      const prod = prodMap.get(linput.productoId)!
      const linea = await tx.cotizacionLinea.create({
        data: {
          organizacionId,
          cotizacionId: c.id,
          productoId: prod.id,
          code: prod.code,
          description: linput.descripcion?.trim() || prod.nombre,
          notes: linput.notes,
          unitMeasureId: linput.unitMeasureId,
          invoicedQuantity: linput.cantidad,
          baseQuantity: 1,
          priceAmount: linput.precioUnitarioSinImpuesto,
          lineExtensionAmount: lcalc.lineExtensionAmount,
          freeOfChargeIndicator: false,
          typeItemIdentId: prod.typeItemIdentId,
        },
      })
      if (lcalc.tieneImpuesto) {
        await tx.cotizacionLineaImpuesto.create({
          data: {
            organizacionId,
            cotizacionLineaId: linea.id,
            taxId: lcalc.taxId,
            percent: lcalc.percent,
            taxableAmount: lcalc.taxableAmount,
            taxAmount: lcalc.taxAmount,
          },
        })
      }
    }

    for (const t of calc.taxTotals) {
      await tx.cotizacionImpuesto.create({
        data: {
          organizacionId,
          cotizacionId: c.id,
          taxId: t.taxId,
          percent: t.percent,
          taxableAmount: t.taxableAmount,
          taxAmount: t.taxAmount,
        },
      })
    }

    for (const dc of d.descuentosCargos) {
      await tx.cotizacionAllowanceCharge.create({
        data: {
          organizacionId,
          cotizacionId: c.id,
          chargeIndicator: dc.esCargo,
          amount: dc.monto,
          baseAmount: dc.baseAmount ?? dc.monto,
          discountId: dc.discountId,
          allowanceChargeReason: dc.razon,
        },
      })
    }

    return c
  })

  return { success: true as const, data: { id: cotizacion.id } }
}

export async function listarCotizaciones(raw: unknown) {
  const parsed = filtrosCotizacionSchema.safeParse(raw ?? {})
  if (!parsed.success) return { success: false as const, error: 'Filtros inválidos' }
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }
  const { estado, clienteId, desde, hasta, page, pageSize } = parsed.data

  const where: Prisma.CotizacionWhereInput = {
    organizacionId: session.ctx.organizacionId,
    ...(estado ? { estado } : {}),
    ...(clienteId ? { clienteId } : {}),
    ...(desde || hasta ? { fecha: { ...(desde ? { gte: desde } : {}), ...(hasta ? { lte: hasta } : {}) } } : {}),
  }

  const [items, total] = await Promise.all([
    prisma.cotizacion.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.cotizacion.count({ where }),
  ])

  const data: Paginado<CotizacionListaDTO> = {
    items: items.map((c) => ({
      id: c.id,
      numero: c.numero,
      prefix: c.prefix,
      estado: estadoEfectivo(c.estado, c.validezHasta),
      fecha: c.fecha.toISOString(),
      validezHasta: c.validezHasta ? c.validezHasta.toISOString() : null,
      clienteName: c.clienteName,
      payableAmount: Number(c.payableAmount),
      facturaGeneradaId: c.facturaGeneradaId,
    })),
    total,
    page,
    pageSize,
  }
  return { success: true as const, data }
}

export async function getCotizacion(id: string) {
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }

  const c = await prisma.cotizacion.findFirst({
    where: { id, organizacionId: session.ctx.organizacionId },
    include: { lineas: true, vendedor: { select: { nombre: true } } },
  })
  if (!c) return { success: false as const, error: 'Cotización no encontrada' }

  const data: CotizacionDetalleDTO = {
    id: c.id,
    estado: estadoEfectivo(c.estado, c.validezHasta),
    numero: c.numero,
    prefix: c.prefix,
    fecha: c.fecha.toISOString(),
    validezHasta: c.validezHasta ? c.validezHasta.toISOString() : null,
    clienteName: c.clienteName,
    clienteIdentificationNumber: c.clienteIdentificationNumber,
    vendedorNombre: c.vendedor.nombre,
    facturaGeneradaId: c.facturaGeneradaId,
    notes: c.notes,
    lineas: c.lineas.map((l) => ({
      id: l.id,
      code: l.code,
      description: l.description,
      invoicedQuantity: Number(l.invoicedQuantity),
      priceAmount: Number(l.priceAmount),
      lineExtensionAmount: Number(l.lineExtensionAmount),
    })),
    totales: {
      lineExtensionAmount: Number(c.lineExtensionAmount),
      taxInclusiveAmount: Number(c.taxInclusiveAmount),
      allowanceTotalAmount: Number(c.allowanceTotalAmount),
      payableAmount: Number(c.payableAmount),
    },
  }
  return { success: true as const, data }
}

export async function cambiarEstadoCotizacion(raw: unknown) {
  const parsed = cambiarEstadoCotizacionSchema.safeParse(raw)
  if (!parsed.success) return { success: false as const, error: 'Datos inválidos' }
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }

  const c = await prisma.cotizacion.findFirst({
    where: { id: parsed.data.cotizacionId, organizacionId: session.ctx.organizacionId },
    select: { id: true, facturaGeneradaId: true },
  })
  if (!c) return { success: false as const, error: 'Cotización no encontrada' }
  if (c.facturaGeneradaId) return { success: false as const, error: 'La cotización ya fue convertida a factura' }

  await prisma.cotizacion.update({ where: { id: c.id }, data: { estado: parsed.data.estado } })
  return { success: true as const }
}

export async function convertirAFactura(raw: unknown) {
  const parsed = convertirAFacturaSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }
  const { organizacionId, userId } = session.ctx

  const cot = await prisma.cotizacion.findFirst({
    where: { id: parsed.data.cotizacionId, organizacionId },
    include: { lineas: { include: { impuestos: true } }, allowances: true },
  })
  if (!cot) return { success: false as const, error: 'Cotización no encontrada' }
  if (cot.facturaGeneradaId) return { success: false as const, error: 'La cotización ya fue convertida a factura' }
  const estadoActual = estadoEfectivo(cot.estado, cot.validezHasta)
  if (estadoActual === 'RECHAZADA' || estadoActual === 'VENCIDA') {
    return { success: false as const, error: 'No se puede convertir una cotización rechazada o vencida' }
  }
  if (cot.lineas.some((l) => !l.productoId)) {
    return { success: false as const, error: 'No se puede convertir: hay productos eliminados en la cotización' }
  }

  const input: FacturaFormValues = {
    clienteId: cot.clienteId,
    bodegaId: parsed.data.bodegaId,
    paymentFormId: cot.paymentFormId,
    paymentMethodId: cot.paymentMethodId,
    fecha: parsed.data.fecha,
    notes: cot.notes ?? undefined,
    headNote: cot.headNote ?? undefined,
    footNote: cot.footNote ?? undefined,
    sendmail: false,
    lineas: cot.lineas.map((l) => ({
      productoId: l.productoId ?? '',
      descripcion: l.description,
      cantidad: Number(l.invoicedQuantity),
      precioUnitarioSinImpuesto: Number(l.priceAmount),
      taxId: l.impuestos[0]?.taxId ?? 22,
      percent: Number(l.impuestos[0]?.percent ?? 0),
      unitMeasureId: l.unitMeasureId,
      notes: l.notes ?? undefined,
    })),
    descuentosCargos: cot.allowances.map((a) => ({
      esCargo: a.chargeIndicator,
      monto: Number(a.amount),
      baseAmount: Number(a.baseAmount),
      discountId: a.discountId ?? undefined,
      razon: a.allowanceChargeReason,
    })),
  }

  try {
    const facturaId = await prisma.$transaction(async (tx) => {
      const r = await crearFacturaBorradorTx(tx, { organizacionId, userId, input })
      await tx.cotizacion.update({
        where: { id: cot.id },
        data: { estado: 'APROBADA', facturaGeneradaId: r.id, convertidaEn: new Date() },
      })
      return r.id
    })
    return { success: true as const, data: { facturaId } }
  } catch (e) {
    return { success: false as const, error: e instanceof Error ? e.message : 'No se pudo convertir la cotización' }
  }
}
