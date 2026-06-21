import type { NextAuthConfig } from 'next-auth'

const PROTECTED_ROUTES: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/productos': ['ADMIN'],
  '/bodegas': ['ADMIN'],
  '/facturas': ['ADMIN', 'VENDEDOR'],
  '/cotizaciones': ['ADMIN', 'VENDEDOR'],
  '/inventario': ['ADMIN', 'VENDEDOR'],
  '/clientes': ['ADMIN', 'VENDEDOR'],
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const path = nextUrl.pathname

      if (path === '/login' || path === '/setup') {
        return isLoggedIn ? Response.redirect(new URL('/', nextUrl)) : true
      }

      if (!isLoggedIn) return false

      const role = auth.user.role as string
      const matchedPrefix = Object.keys(PROTECTED_ROUTES).find(
        (prefix) => path === prefix || path.startsWith(prefix + '/'),
      )

      if (!matchedPrefix) return true

      return PROTECTED_ROUTES[matchedPrefix].includes(role)
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = (user as { role?: string }).role as string
        token.organizacionId = (user as { organizacionId?: string | null }).organizacionId ?? null
        token.recordarme = (user as { recordarme?: boolean }).recordarme ?? false
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      session.user.organizacionId = (token.organizacionId as string | null) ?? null
      return session
    },
  },
}
