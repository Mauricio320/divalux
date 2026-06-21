import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { encode } from 'next-auth/jwt'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { authConfig } from './auth.config'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const MAX_AGE_RECORDARME = 30 * 24 * 60 * 60
const MAX_AGE_SESION = 12 * 60 * 60

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt', maxAge: MAX_AGE_RECORDARME },
  jwt: {
    encode(params) {
      const recordarme = params.token?.recordarme === true
      return encode({ ...params, maxAge: recordarme ? MAX_AGE_RECORDARME : MAX_AGE_SESION })
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { prisma } = await import('./prisma')
        const usuario = await prisma.usuario.findFirst({
          where: { email: parsed.data.email, activo: true },
          include: { organizacion: { select: { activo: true } } },
        })

        if (!usuario) return null

        const passwordOk = await bcrypt.compare(parsed.data.password, usuario.passwordHash)
        if (!passwordOk) return null

        if (usuario.organizacion?.activo === false) return null

        return {
          id: usuario.id,
          email: usuario.email,
          name: usuario.nombre,
          role: usuario.role,
          organizacionId: usuario.organizacionId,
          recordarme: credentials?.recordarme === 'true',
        }
      },
    }),
  ],
  callbacks: authConfig.callbacks,
})
