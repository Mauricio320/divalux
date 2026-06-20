import { cache } from 'react'
import { makeQueryClient } from './queryClient'

export const getQueryClient = cache(makeQueryClient)
