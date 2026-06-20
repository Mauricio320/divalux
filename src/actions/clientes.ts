'use server'

import { prisma } from '@/lib/prisma'
import { requireOrg } from '@/lib/tenant'
import { clienteSchema, editarClienteSchema, filtrosClienteSchema } from '@/lib/validations/cliente'
import type { Paginado } from '@/lib/validations/paginacion'
import type { Cliente } from '@/generated/prisma/client'

export type ClienteDTO = {
  id: string
  identificationNumber: string
  dv: number | null
  name: string
  phone: string | null
  address: string | null
  email: string | null
  merchantRegistration: string | null
  typeDocumentIdentId: number
  typeOrganizationId: number | null
  typeLiabilityId: number | null
  municipalityId: number | null
  typeRegimeId: number | null
  esConsumidorFinal: boolean
  activo: boolean
}

function toDTO(c: Cliente): ClienteDTO {
  return {
    id: c.id,
    identificationNumber: c.identificationNumber,
    dv: c.dv,
    name: c.name,
    phone: c.phone,
    address: c.address,
    email: c.email,
    merchantRegistration: c.merchantRegistration,
    typeDocumentIdentId: c.typeDocumentIdentId,
    typeOrganizationId: c.typeOrganizationId,
    typeLiabilityId: c.typeLiabilityId,
    municipalityId: c.municipalityId,
    typeRegimeId: c.typeRegimeId,
    esConsumidorFinal: c.esConsumidorFinal,
    activo: c.activo,
  }
}

export async function listarClientes(raw: unknown) {
  const parsed = filtrosClienteSchema.safeParse(raw ?? {})
  if (!parsed.success) return { success: false as const, error: 'Filtros inválidos' }
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }
  const { q, page, pageSize } = parsed.data

  const where = {
    organizacionId: session.ctx.organizacionId,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { identificationNumber: { contains: q } },
          ],
        }
      : {}),
  }

  const [items, total] = await Promise.all([
    prisma.cliente.findMany({ where, orderBy: { name: 'asc' }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.cliente.count({ where }),
  ])

  const data: Paginado<ClienteDTO> = { items: items.map(toDTO), total, page, pageSize }
  return { success: true as const, data }
}

export async function getCliente(id: string) {
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }
  const c = await prisma.cliente.findFirst({ where: { id, organizacionId: session.ctx.organizacionId } })
  if (!c) return { success: false as const, error: 'Cliente no encontrado' }
  return { success: true as const, data: toDTO(c) }
}

export async function crearCliente(raw: unknown) {
  const parsed = clienteSchema.safeParse(raw)
  if (!parsed.success) return { success: false as const, error: 'Datos inválidos' }
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }

  const existe = await prisma.cliente.findUnique({
    where: {
      organizacionId_identificationNumber: {
        organizacionId: session.ctx.organizacionId,
        identificationNumber: parsed.data.identificationNumber,
      },
    },
  })
  if (existe) return { success: false as const, error: 'Ya existe un cliente con esa identificación' }

  const { email, ...rest } = parsed.data
  const c = await prisma.cliente.create({
    data: { ...rest, email: email || null, organizacionId: session.ctx.organizacionId },
  })
  return { success: true as const, data: toDTO(c) }
}

export async function editarCliente(raw: unknown) {
  const parsed = editarClienteSchema.safeParse(raw)
  if (!parsed.success) return { success: false as const, error: 'Datos inválidos' }
  const session = await requireOrg(['ADMIN', 'VENDEDOR'])
  if (!session.ok) return { success: false as const, error: session.error }

  const { id, email, ...rest } = parsed.data
  const actual = await prisma.cliente.findFirst({ where: { id, organizacionId: session.ctx.organizacionId } })
  if (!actual) return { success: false as const, error: 'Cliente no encontrado' }

  const c = await prisma.cliente.update({ where: { id }, data: { ...rest, email: email || null } })
  return { success: true as const, data: toDTO(c) }
}
