'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { editarProducto } from '@/actions/productos'
import type { EditarProductoInput } from '@/lib/validations/producto'

export function useEditarProducto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: EditarProductoInput) => unwrap(editarProducto(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.productos.all }),
  })
}
