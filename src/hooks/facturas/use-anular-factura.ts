'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrapVoid } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { anularFactura } from '@/actions/facturas'

export function useAnularFactura() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: { facturaId: string; motivo?: string }) => unwrapVoid(anularFactura(input)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.facturas.all })
      qc.invalidateQueries({ queryKey: queryKeys.inventario.all })
    },
  })
}
