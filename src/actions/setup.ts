'use server'

import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { setupSchema } from '@/lib/validations/setup'

export async function getSetupEstado() {
  const count = await prisma.organizacion.count()
  return { success: true as const, data: { necesitaSetup: count === 0 } }
}

function slugify(nombre: string): string {
  return (
    nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40) || 'empresa'
  )
}

export async function crearSetup(raw: unknown) {
  const parsed = setupSchema.safeParse(raw)
  if (!parsed.success) return { success: false as const, error: 'Datos inválidos' }

  const count = await prisma.organizacion.count()
  if (count > 0) return { success: false as const, error: 'El sistema ya está configurado' }

  const d = parsed.data
  const emailExiste = await prisma.usuario.findUnique({ where: { email: d.adminEmail } })
  if (emailExiste) return { success: false as const, error: 'El correo ya está registrado' }

  await prisma.$transaction(async (tx) => {
    const org = await tx.organizacion.create({
      data: {
        nombre: d.empresaNombre,
        slug: slugify(d.empresaNombre),
        razonSocial: d.razonSocial,
        nit: d.nit,
        dv: d.dv,
        softwareName: d.softwareName,
        municipalityId: d.municipalityId,
        typeRegimeId: d.typeRegimeId,
        typeOrganizationId: d.typeOrganizationId,
      },
    })
    await tx.usuario.create({
      data: {
        email: d.adminEmail,
        passwordHash: await bcrypt.hash(d.adminPassword, 10),
        nombre: d.adminNombre,
        role: 'ADMIN',
        organizacionId: org.id,
      },
    })
    await tx.cliente.create({
      data: {
        organizacionId: org.id,
        identificationNumber: '222222222222',
        name: 'CONSUMIDOR FINAL',
        merchantRegistration: '0000000-00',
        typeDocumentIdentId: 3,
        esConsumidorFinal: true,
      },
    })
  })

  return { success: true as const }
}
