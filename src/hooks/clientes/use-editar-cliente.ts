'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { editarCliente } from '@/actions/clientes'
import type { EditarClienteInput } from '@/lib/validations/cliente'

export function useEditarCliente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: EditarClienteInput) => unwrap(editarCliente(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.clientes.all }),
  })
}
