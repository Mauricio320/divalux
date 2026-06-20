import { redirect } from 'next/navigation'
import SetupForm from '@/components/auth/SetupForm'
import { getSetupEstado } from '@/actions/setup'

export const dynamic = 'force-dynamic'

export default async function SetupPage() {
  const estado = await getSetupEstado()
  if (estado.success && !estado.data.necesitaSetup) redirect('/login')
  return <SetupForm />
}
