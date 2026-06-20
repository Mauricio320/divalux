'use client'

import { useQuery } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { getFactura } from '@/actions/facturas'

export function useFactura(id: string) {
  return useQuery({
    queryKey: queryKeys.facturas.detalle(id),
    queryFn: () => unwrap(getFactura(id)),
    enabled: !!id,
  })
}
