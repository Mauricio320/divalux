import DetalleCotizacion from '@/components/cotizaciones/DetalleCotizacion'

export default async function CotizacionDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <DetalleCotizacion id={id} />
}
