'use server'

import { prisma } from '@/lib/prisma'
import { requireOrg } from '@/lib/tenant'

export type Catalogos = {
  tiposDocumentoIdentificacion: { id: number; nombre: string }[]
  tiposOrganizacion: { id: number; nombre: string }[]
  tiposRegimen: { id: number; nombre: string }[]
  tiposResponsabilidad: { id: number; nombre: string }[]
  formasPago: { id: number; nombre: string }[]
  metodosPago: { id: number; nombre: string }[]
  unidadesMedida: { id: number; nombre: string }[]
  impuestos: { id: number; nombre: string }[]
  municipios: { id: number; nombre: string }[]
}

export async function getCatalogos() {
  const session = await requireOrg()
  if (!session.ok) return { success: false as const, error: session.error }

  const [
    tiposDocumentoIdentificacion,
    tiposOrganizacion,
    tiposRegimen,
    tiposResponsabilidad,
    formasPago,
    metodosPago,
    unidadesMedida,
    impuestos,
    municipios,
  ] = await Promise.all([
    prisma.tipoDocumentoIdentificacion.findMany({ where: { activo: true }, orderBy: { id: 'asc' } }),
    prisma.tipoOrganizacion.findMany({ orderBy: { id: 'asc' } }),
    prisma.tipoRegimen.findMany({ orderBy: { id: 'asc' } }),
    prisma.tipoResponsabilidad.findMany({ orderBy: { id: 'asc' } }),
    prisma.formaPago.findMany({ orderBy: { id: 'asc' } }),
    prisma.metodoPago.findMany({ orderBy: { id: 'asc' } }),
    prisma.unidadMedida.findMany({ orderBy: { nombre: 'asc' } }),
    prisma.impuesto.findMany({ orderBy: { id: 'asc' } }),
    prisma.municipio.findMany({ orderBy: { nombre: 'asc' } }),
  ])

  const data: Catalogos = {
    tiposDocumentoIdentificacion: tiposDocumentoIdentificacion.map((t) => ({ id: t.id, nombre: t.nombre })),
    tiposOrganizacion,
    tiposRegimen,
    tiposResponsabilidad,
    formasPago,
    metodosPago,
    unidadesMedida,
    impuestos,
    municipios: municipios.map((m) => ({ id: m.id, nombre: m.nombre })),
  }
  return { success: true as const, data }
}
