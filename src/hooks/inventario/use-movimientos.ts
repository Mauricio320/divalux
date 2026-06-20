'use client'

import { useQuery } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { listarMovimientos } from '@/actions/inventario'

export function useMovimientos(filtros?: { bodegaId?: string; productoId?: string }) {
  return useQuery({
    queryKey: queryKeys.inventario.movimientos(filtros),
    queryFn: () => unwrap(listarMovimientos(filtros ?? {})),
  })
}
