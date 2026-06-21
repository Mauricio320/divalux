import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'
import TopbarMovil from '@/components/layout/TopbarMovil'
import PageTransition from '@/components/motion/PageTransition'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const nombre = session.user.name ?? session.user.email ?? ''
  const email = session.user.email ?? ''

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar role={session.user.role} nombre={nombre} email={email} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopbarMovil />
        <main className="flex-1 overflow-auto">
          <PageTransition className="px-6 py-6">{children}</PageTransition>
        </main>
      </div>
    </div>
  )
}
