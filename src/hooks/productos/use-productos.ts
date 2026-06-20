'use client'

import { useQuery } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { listarProductos } from '@/actions/productos'

export type FiltrosProductos = { q?: string; page?: number; pageSize?: number }

export function useProductos(filtros?: FiltrosProductos) {
  return useQuery({
    queryKey: queryKeys.productos.lista(filtros),
    queryFn: () => unwrap(listarProductos(filtros ?? {})),
  })
}
