import * as React from 'react'
import { cn } from '@/lib/cn'

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, Props>(({ error, className, children, ...rest }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'w-full appearance-none rounded-lg border bg-surface px-3 py-2 pr-8 text-fg',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none',
          error ? 'border-danger' : 'border-border',
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-fg-subtle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </div>
  )
})

Select.displayName = 'Select'

export default Select
