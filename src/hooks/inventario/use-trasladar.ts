'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrapVoid } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { trasladarEntreBodegas } from '@/actions/inventario'
import type { TrasladoInput } from '@/lib/validations/inventario'

export function useTrasladar() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: TrasladoInput) => unwrapVoid(trasladarEntreBodegas(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.inventario.all }),
  })
}
