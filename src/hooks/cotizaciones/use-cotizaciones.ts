'use client'

import { useQuery } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { listarCotizaciones } from '@/actions/cotizaciones'

export type FiltrosCotizaciones = {
  estado?: 'BORRADOR' | 'ENVIADA' | 'APROBADA' | 'RECHAZADA' | 'VENCIDA'
  clienteId?: string
  page?: number
  pageSize?: number
}

export function useCotizaciones(filtros?: FiltrosCotizaciones) {
  return useQuery({
    queryKey: queryKeys.cotizaciones.lista(filtros),
    queryFn: () => unwrap(listarCotizaciones(filtros ?? {})),
  })
}
