'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { crearProducto } from '@/actions/productos'
import type { ProductoInput } from '@/lib/validations/producto'

export function useCrearProducto() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: ProductoInput) => unwrap(crearProducto(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.productos.all }),
  })
}
