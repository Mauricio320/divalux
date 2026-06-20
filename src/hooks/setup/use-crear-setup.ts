'use client'

import { useMutation } from '@tanstack/react-query'
import { unwrapVoid } from '@/lib/unwrapResult'
import { crearSetup } from '@/actions/setup'
import type { SetupInput } from '@/lib/validations/setup'

export function useCrearSetup() {
  return useMutation({
    mutationFn: (input: SetupInput) => unwrapVoid(crearSetup(input)),
  })
}
