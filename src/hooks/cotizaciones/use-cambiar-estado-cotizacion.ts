'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrapVoid } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { cambiarEstadoCotizacion } from '@/actions/cotizaciones'

type Estado = 'BORRADOR' | 'ENVIADA' | 'APROBADA' | 'RECHAZADA' | 'VENCIDA'

export function useCambiarEstadoCotizacion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { cotizacionId: string; estado: Estado }) => unwrapVoid(cambiarEstadoCotizacion(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cotizaciones.all }),
  })
}
