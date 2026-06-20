'use client'

import { useQuery } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { listarFacturas } from '@/actions/facturas'

export type FiltrosFacturas = {
  estado?: 'BORRADOR' | 'CONFIRMADA' | 'ANULADA' | 'EMITIDA' | 'RECHAZADA'
  clienteId?: string
  page?: number
  pageSize?: number
}

export function useFacturas(filtros?: FiltrosFacturas) {
  return useQuery({
    queryKey: queryKeys.facturas.lista(filtros),
    queryFn: () => unwrap(listarFacturas(filtros ?? {})),
  })
}
