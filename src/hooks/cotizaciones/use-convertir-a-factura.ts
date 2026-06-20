'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { convertirAFactura } from '@/actions/cotizaciones'

export function useConvertirAFactura() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { cotizacionId: string; bodegaId: string }) => unwrap(convertirAFactura(input)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cotizaciones.all })
      qc.invalidateQueries({ queryKey: queryKeys.facturas.all })
    },
  })
}
