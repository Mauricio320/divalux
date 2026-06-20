import { cn } from '@/lib/cn'

type SkeletonProps = {
  className?: string
  width?: string
  height?: string
}

function SkeletonBase({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded bg-surface-2 animate-pulse motion-reduce:animate-none',
        className,
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

type SkeletonTextProps = {
  lines?: number
  className?: string
}

function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 rounded bg-surface-2 animate-pulse motion-reduce:animate-none',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full',
          )}
        />
      ))}
    </div>
  )
}

type SkeletonRowProps = {
  cols?: number
  className?: string
}

function SkeletonRow({ cols = 4, className }: SkeletonRowProps) {
  return (
    <tr className={cn('border-b border-border', className)} aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className={cn(
              'h-4 rounded bg-surface-2 animate-pulse motion-reduce:animate-none',
              i === 0 ? 'w-32' : 'w-full',
            )}
          />
        </td>
      ))}
    </tr>
  )
}

const Skeleton = Object.assign(SkeletonBase, {
  Text: SkeletonText,
  Row: SkeletonRow,
})

export default Skeleton
