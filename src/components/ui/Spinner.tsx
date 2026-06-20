import Image from 'next/image'
import { cn } from '@/lib/cn'

const sizes = {
  sm: 16,
  md: 24,
  lg: 40,
} as const

interface SpinnerProps {
  size?: keyof typeof sizes
  className?: string
}

export default function Spinner({ size = 'md', className }: SpinnerProps) {
  const px = sizes[size]

  return (
    <span
      role="status"
      aria-label="Cargando"
      className={cn('inline-flex shrink-0', className)}
    >
      <Image
        src="/brand/divailux-mark.svg"
        alt=""
        width={px}
        height={px}
        priority={false}
        className="animate-spin motion-reduce:animate-none"
        style={{ width: px, height: px }}
      />
    </span>
  )
}
