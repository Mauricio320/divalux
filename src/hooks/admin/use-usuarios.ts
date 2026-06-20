'use client'

import { useQuery } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { listarUsuarios } from '@/actions/admin'

export function useUsuarios() {
  return useQuery({
    queryKey: queryKeys.admin.usuarios(),
    queryFn: () => unwrap(listarUsuarios()),
  })
}
