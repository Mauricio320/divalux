'use client'

import { useQuery } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { getCatalogos } from '@/actions/catalogos'

export function useCatalogos() {
  return useQuery({
    queryKey: queryKeys.catalogos.dian('todos'),
    queryFn: () => unwrap(getCatalogos()),
    staleTime: 30 * 60 * 1000,
  })
}
