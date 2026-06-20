import { auth } from '@/lib/auth'
import InventarioClient from '@/components/inventario/InventarioClient'

export default async function InventarioPage() {
  const session = await auth()
  return <InventarioClient role={session?.user?.role ?? 'VENDEDOR'} />
}
