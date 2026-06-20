'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { crearFactura } from '@/actions/facturas'
import type { CrearFacturaInput } from '@/lib/validations/factura'

export function useCrearFactura() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CrearFacturaInput) => unwrap(crearFactura(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.facturas.all }),
  })
}
