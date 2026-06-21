import Image from 'next/image'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'mark' | 'full' | 'full-white'

const SRC: Record<Variant, string> = {
  mark: '/brand/divailux-mark.svg',
  full: '/divailux-lockup/divailux-lockup-h.png',
  'full-white': '/divailux-lockup/divailux-lockup-h-white.png',
}

const INTRINSIC: Record<Variant, { width: number; height: number }> = {
  mark: { width: 533, height: 533 },
  full: { width: 1086, height: 1033 },
  'full-white': { width: 1086, height: 1033 },
}

const DISPLAY_HEIGHT: Record<Variant, number> = {
  mark: 40,
  full: 56,
  'full-white': 56,
}

type Props = {
  variant?: Variant
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export default function Logo({
  variant = 'mark',
  width,
  height,
  className,
  priority = false,
}: Props) {
  const intrinsic = INTRINSIC[variant]
  const style: CSSProperties =
    width != null
      ? { width, height: 'auto' }
      : { height: height ?? DISPLAY_HEIGHT[variant], width: 'auto' }

  return (
    <Image
      src={SRC[variant]}
      alt="Divailux"
      width={intrinsic.width}
      height={intrinsic.height}
      priority={priority}
      style={style}
      className={cn('object-contain', className)}
    />
  )
}
