import * as React from 'react'
import { cn } from '@/lib/cn'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, Props>(({ error, className, ...rest }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-lg border bg-surface px-3 py-2 text-fg placeholder:text-fg-subtle',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none',
        error ? 'border-danger' : 'border-border',
        className,
      )}
      {...rest}
    />
  )
})

Input.displayName = 'Input'

export default Input
