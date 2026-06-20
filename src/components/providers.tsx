'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { makeQueryClient } from '@/lib/queryClient'
import ToastProvider from '@/components/ui/ToastProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient)
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {children}
      </ToastProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
