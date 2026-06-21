'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export type OpcionSelect<T extends string | number = string> = {
  value: T
  label: string
  searchText?: string
}

type Coords = { top: number; left: number; width: number }

type Props<T extends string | number> = {
  opciones: OpcionSelect<T>[]
  value: T | ''
  onChange: (value: T | '') => void
  placeholder?: string
  permitirVaciar?: boolean
  conBuscador?: boolean
  disabled?: boolean
}

export function SelectBuscador<T extends string | number>({
  opciones,
  value,
  onChange,
  placeholder = 'Seleccionar…',
  permitirVaciar = true,
  conBuscador = true,
  disabled = false,
}: Props<T>) {
  const [abierto, setAbierto] = useState(false)
  const [filtro, setFiltro] = useState('')
  const [coords, setCoords] = useState<Coords | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  function calcular() {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setCoords({ top: r.bottom + 4, left: r.left, width: r.width })
  }

  function toggle() {
    if (!abierto) calcular()
    setAbierto((v) => !v)
  }

  function cerrar() {
    setAbierto(false)
    setFiltro('')
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const t = e.target as Node
      if (triggerRef.current?.contains(t)) return
      if (panelRef.current?.contains(t)) return
      cerrar()
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    if (!abierto) return
    function reposicionar() {
      calcular()
    }
    window.addEventListener('scroll', reposicionar, true)
    window.addEventListener('resize', reposicionar)
    return () => {
      window.removeEventListener('scroll', reposicionar, true)
      window.removeEventListener('resize', reposicionar)
    }
  }, [abierto])

  const seleccionada = opciones.find((o) => o.value === value)

  const filtradas = useMemo(() => {
    if (!filtro) return opciones
    const q = filtro.toLowerCase()
    return opciones.filter((o) => (o.searchText ?? o.label).toLowerCase().includes(q))
  }, [opciones, filtro])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={toggle}
        className={cn(
          'flex w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-left text-sm text-fg transition-colors',
          'hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        <span className={cn('truncate', !seleccionada && 'text-fg-subtle')}>
          {seleccionada?.label ?? placeholder}
        </span>
        <ChevronDown size={16} className="ml-2 shrink-0 text-fg-muted" aria-hidden="true" />
      </button>

      {abierto && coords &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: 'fixed', top: coords.top, left: coords.left, width: coords.width, zIndex: 1000 }}
            className="max-h-64 overflow-auto rounded-lg border border-border bg-surface shadow-lg"
          >
            {conBuscador && (
              <input
                autoFocus
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                placeholder="Buscar…"
                className="w-full border-b border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-subtle outline-none"
              />
            )}
            {permitirVaciar && (
              <button
                type="button"
                onClick={() => {
                  onChange('')
                  cerrar()
                }}
                className="block w-full px-3 py-2 text-left text-sm text-fg-subtle hover:bg-surface-2"
              >
                — Ninguno —
              </button>
            )}
            {filtradas.map((o) => (
              <button
                key={String(o.value)}
                type="button"
                onClick={() => {
                  onChange(o.value)
                  cerrar()
                }}
                className={cn(
                  'block w-full px-3 py-2 text-left text-sm text-fg hover:bg-surface-2',
                  o.value === value && 'bg-surface-2 font-medium',
                )}
              >
                {o.label}
              </button>
            ))}
            {filtradas.length === 0 && (
              <div className="px-3 py-2 text-sm text-fg-subtle">Sin resultados</div>
            )}
          </div>,
          document.body,
        )}
    </>
  )
}
