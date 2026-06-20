'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrapVoid } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { registrarEntrada } from '@/actions/inventario'
import type { MovimientoInput } from '@/lib/validations/inventario'

export function useRegistrarEntrada() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: MovimientoInput) => unwrapVoid(registrarEntrada(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.inventario.all }),
  })
}
