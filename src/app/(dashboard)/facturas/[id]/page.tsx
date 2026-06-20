import { auth } from '@/lib/auth'
import DetalleFactura from '@/components/facturas/DetalleFactura'

export default async function FacturaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  return <DetalleFactura id={id} esAdmin={session?.user?.role === 'ADMIN'} />
}
