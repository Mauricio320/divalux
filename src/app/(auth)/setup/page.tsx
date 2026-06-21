import { redirect } from 'next/navigation'
import SetupForm from '@/components/auth/SetupForm'
import { getSetupEstado } from '@/actions/setup'

export const dynamic = 'force-dynamic'

export default async function SetupPage() {
  const estado = await getSetupEstado()
  if (estado.success && !estado.data.necesitaSetup) redirect('/login')
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-sm">
        <SetupForm />
      </div>
    </div>
  )
}
