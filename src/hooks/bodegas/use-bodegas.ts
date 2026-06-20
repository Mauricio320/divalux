'use client'

import { useQuery } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { listarBodegas } from '@/actions/bodegas'

export function useBodegas() {
  return useQuery({
    queryKey: queryKeys.bodegas.lista(),
    queryFn: () => unwrap(listarBodegas()),
  })
}
