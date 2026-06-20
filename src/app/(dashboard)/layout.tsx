import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Nav } from '@/components/layout/Nav'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="flex min-h-full">
      <Nav role={session.user.role} nombre={session.user.name ?? session.user.email ?? ''} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
