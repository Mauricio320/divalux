'use server'

import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requireOrg } from '@/lib/tenant'
import { crearUsuarioSchema } from '@/lib/validations/usuario'

export type EmpresaDTO = {
  nombre: string
  razonSocial: string
  nit: string
  dv: number
}

export type UsuarioDTO = {
  id: string
  nombre: string
  email: string
  role: string
  activo: boolean
}

export async function getEmpresa() {
  const session = await requireOrg(['ADMIN'])
  if (!session.ok) return { success: false as const, error: session.error }
  const org = await prisma.organizacion.findUnique({ where: { id: session.ctx.organizacionId } })
  if (!org) return { success: false as const, error: 'Empresa no encontrada' }
  const data: EmpresaDTO = { nombre: org.nombre, razonSocial: org.razonSocial, nit: org.nit, dv: org.dv }
  return { success: true as const, data }
}

export async function listarUsuarios() {
  const session = await requireOrg(['ADMIN'])
  if (!session.ok) return { success: false as const, error: session.error }
  const usuarios = await prisma.usuario.findMany({
    where: { organizacionId: session.ctx.organizacionId },
    orderBy: { nombre: 'asc' },
  })
  const data: UsuarioDTO[] = usuarios.map((u) => ({
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    role: u.role,
    activo: u.activo,
  }))
  return { success: true as const, data }
}

export async function crearUsuario(raw: unknown) {
  const parsed = crearUsuarioSchema.safeParse(raw)
  if (!parsed.success) return { success: false as const, error: 'Datos inválidos' }
  const session = await requireOrg(['ADMIN'])
  if (!session.ok) return { success: false as const, error: session.error }

  const existe = await prisma.usuario.findUnique({ where: { email: parsed.data.email } })
  if (existe) return { success: false as const, error: 'El correo ya está registrado' }

  const u = await prisma.usuario.create({
    data: {
      nombre: parsed.data.nombre,
      email: parsed.data.email,
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
      role: parsed.data.role,
      organizacionId: session.ctx.organizacionId,
    },
  })
  return { success: true as const, data: { id: u.id } }
}
