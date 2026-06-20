'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { crearUsuario } from '@/actions/admin'
import type { CrearUsuarioInput } from '@/lib/validations/usuario'

export function useCrearUsuario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CrearUsuarioInput) => unwrap(crearUsuario(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.admin.usuarios() }),
  })
}
