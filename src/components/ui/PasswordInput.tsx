'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/cn'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean
  toggleClassName?: string
}

const PasswordInput = React.forwardRef<HTMLInputElement, Props>(
  ({ error, className, toggleClassName, ...rest }, ref) => {
    const [visible, setVisible] = React.useState(false)

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? 'text' : 'password'}
          error={error}
          className={cn('pr-10', className)}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={visible}
          className={cn(
            'absolute inset-y-0 right-0 flex items-center pr-3 text-fg-subtle',
            'transition-colors duration-150 hover:text-fg',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-r-lg',
            toggleClassName,
          )}
        >
          {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
        </button>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
