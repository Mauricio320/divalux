import FacturaImprimible from '@/components/facturas/FacturaImprimible'

export default async function ImprimirFacturaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <FacturaImprimible id={id} />
}
