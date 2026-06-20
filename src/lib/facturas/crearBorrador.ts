import { Prisma } from '@/generated/prisma/client'
import { calcularFacturaCompleta } from '@/lib/totales'
import type { FacturaFormValues } from '@/lib/validations/factura'

type Tx = Prisma.TransactionClient

export async function crearFacturaBorradorTx(
  tx: Tx,
  args: { organizacionId: string; userId: string; input: FacturaFormValues },
): Promise<{ id: string }> {
  const { organizacionId, userId, input: d } = args

  const cliente = await tx.cliente.findFirst({ where: { id: d.clienteId, organizacionId } })
  if (!cliente) throw new Error('Cliente no encontrado')
  const bodega = await tx.bodega.findFirst({ where: { id: d.bodegaId, organizacionId } })
  if (!bodega) throw new Error('Bodega no encontrada')

  const productoIds = [...new Set(d.lineas.map((l) => l.productoId))]
  const productos = await tx.producto.findMany({ where: { id: { in: productoIds }, organizacionId } })
  if (productos.length !== productoIds.length) throw new Error('Producto no encontrado')
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

  const f = await tx.factura.create({
    data: {
      organizacionId,
      estado: 'BORRADOR',
      typeDocumentId: 1,
      clienteId: cliente.id,
      clienteIdentificationNumber: cliente.identificationNumber,
      clienteName: cliente.name,
      bodegaId: bodega.id,
      vendedorId: userId,
      paymentFormId: d.paymentFormId,
      paymentMethodId: d.paymentMethodId,
      paymentDueDate: d.paymentDueDate,
      durationMeasure: d.durationMeasure,
      fecha: d.fecha ?? new Date(),
      notes: d.notes,
      headNote: d.headNote,
      footNote: d.footNote,
      sendmail: d.sendmail,
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
    const linea = await tx.facturaLinea.create({
      data: {
        organizacionId,
        facturaId: f.id,
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
      await tx.facturaLineaImpuesto.create({
        data: {
          organizacionId,
          facturaLineaId: linea.id,
          taxId: lcalc.taxId,
          percent: lcalc.percent,
          taxableAmount: lcalc.taxableAmount,
          taxAmount: lcalc.taxAmount,
        },
      })
    }
  }

  for (const t of calc.taxTotals) {
    await tx.facturaImpuesto.create({
      data: {
        organizacionId,
        facturaId: f.id,
        taxId: t.taxId,
        percent: t.percent,
        taxableAmount: t.taxableAmount,
        taxAmount: t.taxAmount,
      },
    })
  }

  for (const dc of d.descuentosCargos) {
    await tx.allowanceCharge.create({
      data: {
        organizacionId,
        facturaId: f.id,
        chargeIndicator: dc.esCargo,
        amount: dc.monto,
        baseAmount: dc.baseAmount ?? dc.monto,
        discountId: dc.discountId,
        allowanceChargeReason: dc.razon,
      },
    })
  }

  return { id: f.id }
}
