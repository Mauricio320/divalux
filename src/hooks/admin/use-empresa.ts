'use client'

import { useQuery } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { getEmpresa } from '@/actions/admin'

export function useEmpresa() {
  return useQuery({
    queryKey: queryKeys.admin.empresa(),
    queryFn: () => unwrap(getEmpresa()),
  })
}
