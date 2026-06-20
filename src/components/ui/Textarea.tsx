import * as React from 'react'
import { cn } from '@/lib/cn'

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ error, className, rows = 3, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full rounded-lg border bg-surface px-3 py-2 text-fg placeholder:text-fg-subtle',
          'resize-y transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none',
          error ? 'border-danger' : 'border-border',
          className,
        )}
        {...rest}
      />
    )
  },
)

Textarea.displayName = 'Textarea'

export default Textarea
