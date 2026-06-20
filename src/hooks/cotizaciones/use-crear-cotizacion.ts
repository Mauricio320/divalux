'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { crearCotizacion } from '@/actions/cotizaciones'
import type { CrearCotizacionInput } from '@/lib/validations/cotizacion'

export function useCrearCotizacion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CrearCotizacionInput) => unwrap(crearCotizacion(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cotizaciones.all }),
  })
}
