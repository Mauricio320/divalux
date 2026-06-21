import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: string
    organizacionId?: string | null
    recordarme?: boolean
  }

  interface Session {
    user: {
      id: string
      role: string
      organizacionId: string | null
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    organizacionId: string | null
    recordarme?: boolean
  }
}
