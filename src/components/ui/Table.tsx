import { cn } from '@/lib/cn'

type Align = 'left' | 'center' | 'right'

const alignClass: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

type TableProps = {
  className?: string
  children: React.ReactNode
}

function TableRoot({ className, children }: TableProps) {
  return (
    <div
      className={cn(
        'overflow-x-auto rounded-xl border border-border bg-surface',
        className,
      )}
    >
      <table className="w-full border-collapse">{children}</table>
    </div>
  )
}

type HeadProps = {
  className?: string
  children: React.ReactNode
}

function Head({ className, children }: HeadProps) {
  return (
    <thead
      className={cn(
        'sticky top-0 z-10 bg-surface shadow-[0_1px_0_0_var(--color-border)]',
        className,
      )}
    >
      {children}
    </thead>
  )
}

type HeaderCellProps = {
  align?: Align
  sortable?: boolean
  sortDir?: 'asc' | 'desc' | null
  onSort?: () => void
  className?: string
  children: React.ReactNode
}

function HeaderCell({
  align = 'left',
  sortable = false,
  sortDir,
  onSort,
  className,
  children,
}: HeaderCellProps) {
  const inner = (
    <span className="flex items-center gap-1">
      {children}
      {sortable && (
        <SortIcon dir={sortDir ?? null} />
      )}
    </span>
  )

  if (sortable && onSort) {
    return (
      <th
        className={cn(
          'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-fg-muted',
          alignClass[align],
          className,
        )}
      >
        <button
          type="button"
          onClick={onSort}
          className="inline-flex items-center gap-1 transition-colors duration-150 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
        >
          {inner}
        </button>
      </th>
    )
  }

  return (
    <th
      className={cn(
        'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-fg-muted',
        alignClass[align],
        className,
      )}
    >
      {inner}
    </th>
  )
}

type SortIconProps = { dir: 'asc' | 'desc' | null }

function SortIcon({ dir }: SortIconProps) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M6 2L9 5H3L6 2Z"
        fill={dir === 'asc' ? 'currentColor' : 'var(--color-border-strong)'}
      />
      <path
        d="M6 10L3 7H9L6 10Z"
        fill={dir === 'desc' ? 'currentColor' : 'var(--color-border-strong)'}
      />
    </svg>
  )
}

type BodyProps = {
  className?: string
  children: React.ReactNode
}

function Body({ className, children }: BodyProps) {
  return <tbody className={cn('divide-y divide-border', className)}>{children}</tbody>
}

type RowProps = {
  hover?: boolean
  zebra?: boolean
  zebraOdd?: boolean
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

function Row({
  hover = true,
  zebra = false,
  zebraOdd = false,
  className,
  children,
  onClick,
}: RowProps) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'transition-colors duration-150',
        hover && 'hover:bg-surface-2 cursor-default',
        zebra && zebraOdd && 'bg-surface-2/40',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </tr>
  )
}

type CellProps = {
  align?: Align
  className?: string
  children?: React.ReactNode
}

function Cell({ align = 'left', className, children }: CellProps) {
  return (
    <td
      className={cn(
        'px-4 py-3 text-sm text-fg',
        alignClass[align],
        className,
      )}
    >
      {children}
    </td>
  )
}

const Table = Object.assign(TableRoot, {
  Head,
  HeaderCell,
  Body,
  Row,
  Cell,
})

export default Table
