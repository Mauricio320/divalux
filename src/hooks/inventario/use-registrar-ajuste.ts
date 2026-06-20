'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrapVoid } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { registrarAjuste } from '@/actions/inventario'
import type { AjusteInput } from '@/lib/validations/inventario'

export function useRegistrarAjuste() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: AjusteInput) => unwrapVoid(registrarAjuste(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.inventario.all }),
  })
}
