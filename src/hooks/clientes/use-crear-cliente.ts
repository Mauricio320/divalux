'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { crearCliente } from '@/actions/clientes'
import type { ClienteInput } from '@/lib/validations/cliente'

export function useCrearCliente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: ClienteInput) => unwrap(crearCliente(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.clientes.all }),
  })
}
