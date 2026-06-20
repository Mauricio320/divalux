'use client'

import { useQuery } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { getStock } from '@/actions/inventario'

export function useStock(filtros?: { bodegaId?: string; productoId?: string }) {
  return useQuery({
    queryKey: queryKeys.inventario.stock(filtros?.bodegaId, filtros?.productoId),
    queryFn: () => unwrap(getStock(filtros ?? {})),
  })
}
