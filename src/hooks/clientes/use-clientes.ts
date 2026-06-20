'use client'

import { useQuery } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { listarClientes } from '@/actions/clientes'

export type FiltrosClientes = { q?: string; page?: number; pageSize?: number }

export function useClientes(filtros?: FiltrosClientes) {
  return useQuery({
    queryKey: queryKeys.clientes.lista(filtros),
    queryFn: () => unwrap(listarClientes(filtros ?? {})),
  })
}
