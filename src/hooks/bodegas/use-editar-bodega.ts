'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { unwrap } from '@/lib/unwrapResult'
import { queryKeys } from '@/lib/queryKeys'
import { editarBodega } from '@/actions/bodegas'
import type { z } from 'zod'
import type { editarBodegaSchema } from '@/lib/validations/inventario'

export function useEditarBodega() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: z.input<typeof editarBodegaSchema>) => unwrap(editarBodega(input)),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.bodegas.all }),
  })
}
