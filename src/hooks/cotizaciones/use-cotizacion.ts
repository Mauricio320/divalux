'use client'

import { useQuery } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { getCotizacion } from '@/actions/cotizaciones'

export function useCotizacion(id: string) {
  return useQuery({
    queryKey: queryKeys.cotizaciones.detalle(id),
    queryFn: () => unwrap(getCotizacion(id)),
    enabled: !!id,
  })
}
