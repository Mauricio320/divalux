import CotizacionImprimible from '@/components/cotizaciones/CotizacionImprimible'

export default async function ImprimirCotizacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CotizacionImprimible id={id} />
}
