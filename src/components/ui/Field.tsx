import { cn } from '@/lib/cn'

type Props = {
  label?: string
  htmlFor?: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export default function Field({ label, htmlFor, hint, error, required, children, className }: Props) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-fg">
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-fg-subtle">{hint}</p>}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
}
