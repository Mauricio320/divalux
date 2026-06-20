'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { confirmarFactura } from '@/actions/facturas'

export function useConfirmarFactura() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (facturaId: string) => unwrap(confirmarFactura({ facturaId })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.facturas.all })
      qc.invalidateQueries({ queryKey: queryKeys.inventario.all })
    },
  })
}
