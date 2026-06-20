'use server'

import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { requireOrg } from '@/lib/tenant'
import { construirPayloadFactura } from '@/lib/nextpyme/construirPayloadFactura'
import { crearFacturaBorradorTx } from '@/lib/facturas/crearBorrador'
import { descontarVentaTx, reversarVentaTx } from '@/lib/inventario/movimientos'
import {
  anularFacturaSchema,
  confirmarFacturaSchema,
  crearFacturaSchema,
  filtrosFacturaSchema,
} from '@/lib/validations/factura'
import type { Paginado } from '@/lib/validations/paginacion'

export type FacturaListaDTO = {
  id: string
  numero: number | null
  prefix: string | null
  estado: string
  fecha: string
  clienteName: string
  payableAmount: number
}

export type FacturaDetalleDTO = {
  id: string
  estado: string
  numero: number | null
  prefix: string | null
  resolutionNumber: string | null
  fecha: string
  clienteName: string
  clienteIdentificationNumber: string
  bodegaNombre: string
  vendedorNombre: string
  paymentFormId: number
  paymentMethodId: number
  notes: string | null
  lineas: {
    id: string
    code: string
    description: string
    invoicedQuantity: number
    priceAmount: number
    lineExtensionAmount: number
    impuestos: { taxId: number; percent: number; taxableAmount: number; taxAmount: number }[]
  }[]
  allowances: { chargeIndicator: boolean; amount: number; allowanceChargeReason: string }[]
  totales: {
    lineExtensionAmount: number
    taxExclusiveAmount: number
    taxInclusiveAmount: number
    allowanceTotalAmount: number
    chargeTotalAmount: number
    payableAmount: number
  }
  payloadNextpyme: unknown
}

export async function listarFacturas(raw: unknown) {
  const parsed = filtrosFacturaSchema.safeParse(raw ?? {})
  if (!parsed.success) return { success: false as const, error: 'Filtros inválidos' }
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }
  const { estado, clienteId, desde, hasta, page, pageSize } = parsed.data

  const where: Prisma.FacturaWhereInput = {
    organizacionId: session.ctx.organizacionId,
    ...(estado ? { estado } : {}),
    ...(clienteId ? { clienteId } : {}),
    ...(desde || hasta ? { fecha: { ...(desde ? { gte: desde } : {}), ...(hasta ? { lte: hasta } : {}) } } : {}),
  }

  const [items, total] = await Promise.all([
    prisma.factura.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.factura.count({ where }),
  ])

  const data: Paginado<FacturaListaDTO> = {
    items: items.map((f) => ({
      id: f.id,
      numero: f.numero,
      prefix: f.prefix,
      estado: f.estado,
      fecha: f.fecha.toISOString(),
      clienteName: f.clienteName,
      payableAmount: Number(f.payableAmount),
    })),
    total,
    page,
    pageSize,
  }
  return { success: true as const, data }
}

export async function getFactura(id: string) {
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }

  const f = await prisma.factura.findFirst({
    where: { id, organizacionId: session.ctx.organizacionId },
    include: {
      lineas: { include: { impuestos: true } },
      allowances: true,
      bodega: { select: { nombre: true } },
      vendedor: { select: { nombre: true } },
    },
  })
  if (!f) return { success: false as const, error: 'Factura no encontrada' }

  const data: FacturaDetalleDTO = {
    id: f.id,
    estado: f.estado,
    numero: f.numero,
    prefix: f.prefix,
    resolutionNumber: f.resolutionNumber,
    fecha: f.fecha.toISOString(),
    clienteName: f.clienteName,
    clienteIdentificationNumber: f.clienteIdentificationNumber,
    bodegaNombre: f.bodega.nombre,
    vendedorNombre: f.vendedor.nombre,
    paymentFormId: f.paymentFormId,
    paymentMethodId: f.paymentMethodId,
    notes: f.notes,
    lineas: f.lineas.map((l) => ({
      id: l.id,
      code: l.code,
      description: l.description,
      invoicedQuantity: Number(l.invoicedQuantity),
      priceAmount: Number(l.priceAmount),
      lineExtensionAmount: Number(l.lineExtensionAmount),
      impuestos: l.impuestos.map((t) => ({
        taxId: t.taxId,
        percent: Number(t.percent),
        taxableAmount: Number(t.taxableAmount),
        taxAmount: Number(t.taxAmount),
      })),
    })),
    allowances: f.allowances.map((a) => ({
      chargeIndicator: a.chargeIndicator,
      amount: Number(a.amount),
      allowanceChargeReason: a.allowanceChargeReason,
    })),
    totales: {
      lineExtensionAmount: Number(f.lineExtensionAmount),
      taxExclusiveAmount: Number(f.taxExclusiveAmount),
      taxInclusiveAmount: Number(f.taxInclusiveAmount),
      allowanceTotalAmount: Number(f.allowanceTotalAmount),
      chargeTotalAmount: Number(f.chargeTotalAmount),
      payableAmount: Number(f.payableAmount),
    },
    payloadNextpyme: f.payloadNextpyme ?? null,
  }
  return { success: true as const, data }
}

export async function crearFactura(raw: unknown) {
  const parsed = crearFacturaSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }

  try {
    const factura = await prisma.$transaction((tx) =>
      crearFacturaBorradorTx(tx, {
        organizacionId: session.ctx.organizacionId,
        userId: session.ctx.userId,
        input: parsed.data,
      }),
    )
    return { success: true as const, data: { id: factura.id } }
  } catch (e) {
    return { success: false as const, error: e instanceof Error ? e.message : 'No se pudo crear la factura' }
  }
}

export async function confirmarFactura(raw: unknown) {
  const parsed = confirmarFacturaSchema.safeParse(raw)
  if (!parsed.success) return { success: false as const, error: 'Datos inválidos' }
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }
  const { organizacionId, userId } = session.ctx

  const factura = await prisma.factura.findFirst({
    where: { id: parsed.data.facturaId, organizacionId },
    include: {
      lineas: { include: { impuestos: true, producto: { select: { controlaStock: true } } } },
      impuestos: true,
      allowances: true,
      cliente: true,
    },
  })
  if (!factura) return { success: false as const, error: 'Factura no encontrada' }
  if (factura.estado !== 'BORRADOR') return { success: false as const, error: 'La factura ya fue confirmada o anulada' }

  const [resolucion, org] = await Promise.all([
    prisma.resolucionDian.findFirst({ where: { organizacionId, activa: true } }),
    prisma.organizacion.findUnique({ where: { id: organizacionId } }),
  ])
  if (!resolucion) return { success: false as const, error: 'No hay resolución DIAN activa' }
  if (!org) return { success: false as const, error: 'Empresa no encontrada' }

  const ahora = new Date()
  const hora = ahora.toTimeString().slice(0, 8)

  try {
    const numero = await prisma.$transaction(async (tx) => {
      const r = await tx.resolucionDian.update({
        where: { id: resolucion.id },
        data: { ultimoNumero: { increment: 1 } },
        select: { ultimoNumero: true, rangoHasta: true, prefix: true, resolutionNumber: true },
      })
      if (r.ultimoNumero > r.rangoHasta) throw new Error('Rango de numeración agotado')
      const num = r.ultimoNumero

      await descontarVentaTx(tx, {
        organizacionId,
        facturaId: factura.id,
        registradoPorId: userId,
        bodegaId: factura.bodegaId,
        permitirStockNegativo: org.permitirStockNegativo,
        lineas: factura.lineas.map((l) => ({
          productoId: l.productoId!,
          cantidad: Number(l.invoicedQuantity),
          controlaStock: l.producto?.controlaStock ?? true,
        })),
      })

      const payload = construirPayloadFactura({
        numero: num,
        typeDocumentId: factura.typeDocumentId,
        prefix: r.prefix,
        resolutionNumber: r.resolutionNumber,
        fecha: factura.fecha,
        hora,
        notes: factura.notes,
        headNote: factura.headNote,
        footNote: factura.footNote,
        sendmail: factura.sendmail,
        sendmailtome: factura.sendmailtome,
        paymentFormId: factura.paymentFormId,
        paymentMethodId: factura.paymentMethodId,
        paymentDueDate: factura.paymentDueDate,
        durationMeasure: factura.durationMeasure,
        emisor: { razonSocial: org.razonSocial, nit: org.nit, dv: org.dv, softwareName: org.softwareName },
        cliente: {
          identificationNumber: factura.cliente.identificationNumber,
          dv: factura.cliente.dv,
          name: factura.cliente.name,
          phone: factura.cliente.phone,
          address: factura.cliente.address,
          email: factura.cliente.email,
          merchantRegistration: factura.cliente.merchantRegistration,
          typeDocumentIdentId: factura.cliente.typeDocumentIdentId,
          typeOrganizationId: factura.cliente.typeOrganizationId,
          typeLiabilityId: factura.cliente.typeLiabilityId,
          municipalityId: factura.cliente.municipalityId,
          typeRegimeId: factura.cliente.typeRegimeId,
          esConsumidorFinal: factura.cliente.esConsumidorFinal,
        },
        lineas: factura.lineas.map((l) => ({
          code: l.code,
          description: l.description,
          notes: l.notes,
          unitMeasureId: l.unitMeasureId,
          invoicedQuantity: Number(l.invoicedQuantity),
          baseQuantity: Number(l.baseQuantity),
          priceAmount: Number(l.priceAmount),
          lineExtensionAmount: Number(l.lineExtensionAmount),
          freeOfChargeIndicator: l.freeOfChargeIndicator,
          typeItemIdentId: l.typeItemIdentId,
          impuestos: l.impuestos.map((t) => ({
            taxId: t.taxId,
            percent: Number(t.percent),
            taxableAmount: Number(t.taxableAmount),
            taxAmount: Number(t.taxAmount),
          })),
        })),
        taxTotals: factura.impuestos.map((t) => ({
          taxId: t.taxId,
          percent: Number(t.percent),
          taxableAmount: Number(t.taxableAmount),
          taxAmount: Number(t.taxAmount),
        })),
        totales: {
          lineExtensionAmount: Number(factura.lineExtensionAmount),
          taxExclusiveAmount: Number(factura.taxExclusiveAmount),
          taxInclusiveAmount: Number(factura.taxInclusiveAmount),
          allowanceTotalAmount: Number(factura.allowanceTotalAmount),
          chargeTotalAmount: Number(factura.chargeTotalAmount),
          payableAmount: Number(factura.payableAmount),
        },
        allowanceCharges: factura.allowances.map((a) => ({
          chargeIndicator: a.chargeIndicator,
          amount: Number(a.amount),
          baseAmount: Number(a.baseAmount),
          discountId: a.discountId,
          reason: a.allowanceChargeReason,
        })),
      })

      const payloadJson: Prisma.InputJsonValue = JSON.parse(JSON.stringify(payload))

      await tx.factura.update({
        where: { id: factura.id },
        data: {
          estado: 'CONFIRMADA',
          numero: num,
          prefix: r.prefix,
          resolutionNumber: r.resolutionNumber,
          resolucionId: resolucion.id,
          hora,
          payloadNextpyme: payloadJson,
        },
      })

      return num
    })

    return { success: true as const, data: { numero } }
  } catch (e) {
    return { success: false as const, error: e instanceof Error ? e.message : 'No se pudo confirmar la factura' }
  }
}

export async function anularFactura(raw: unknown) {
  const parsed = anularFacturaSchema.safeParse(raw)
  if (!parsed.success) return { success: false as const, error: 'Datos inválidos' }
  const session = await requireOrg(['ADMIN'])
  if (!session.ok) return { success: false as const, error: session.error }
  const { organizacionId, userId } = session.ctx

  const factura = await prisma.factura.findFirst({
    where: { id: parsed.data.facturaId, organizacionId },
    select: { id: true, estado: true },
  })
  if (!factura) return { success: false as const, error: 'Factura no encontrada' }
  if (factura.estado === 'ANULADA') return { success: false as const, error: 'La factura ya está anulada' }

  await prisma.$transaction(async (tx) => {
    if (factura.estado === 'CONFIRMADA') {
      await reversarVentaTx(tx, { organizacionId, facturaId: factura.id, registradoPorId: userId })
    }
    await tx.factura.update({
      where: { id: factura.id },
      data: {
        estado: 'ANULADA',
        motivoAnulacion: parsed.data.motivo,
        anuladoPorId: userId,
        anuladoEn: new Date(),
      },
    })
  })

  return { success: true as const }
}
