'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { crearBodega } from '@/actions/bodegas'
import type { BodegaInput } from '@/lib/validations/inventario'

export function useCrearBodega() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: BodegaInput) => unwrap(crearBodega(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.bodegas.all }),
  })
}
