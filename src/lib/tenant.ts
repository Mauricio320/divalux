import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@/generated/prisma/client'

export type SessionContext = {
  userId: string
  role: Role
  organizacionId: string | null
}

export type OrgContext = SessionContext & { organizacionId: string }

export async function getSessionContext(): Promise<SessionContext | null> {
  const session = await auth()
  if (!session?.user?.id) return null
  const u = await prisma.usuario.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, organizacionId: true, activo: true },
  })
  if (!u || !u.activo) return null
  return { userId: u.id, role: u.role, organizacionId: u.organizacionId }
}

export async function requireOrg(
  rolesPermitidos?: Role[],
): Promise<{ ok: true; ctx: OrgContext } | { ok: false; error: string }> {
  const ctx = await getSessionContext()
  if (!ctx) return { ok: false, error: 'No autenticado' }
  if (!ctx.organizacionId) return { ok: false, error: 'Sin empresa asignada' }
  if (rolesPermitidos && !rolesPermitidos.includes(ctx.role)) {
    return { ok: false, error: 'Sin permisos' }
  }
  return { ok: true, ctx: { ...ctx, organizacionId: ctx.organizacionId } }
}
