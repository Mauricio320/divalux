'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

export type OpcionSelect<T extends string | number = string> = {
  value: T
  label: string
  searchText?: string
}

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
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const seleccionada = opciones.find((o) => o.value === value)

  const filtradas = useMemo(() => {
    if (!filtro) return opciones
    const q = filtro.toLowerCase()
    return opciones.filter((o) => (o.searchText ?? o.label).toLowerCase().includes(q))
  }, [opciones, filtro])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setAbierto((v) => !v)}
        className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm disabled:bg-gray-100"
      >
        <span className={seleccionada ? '' : 'text-gray-400'}>{seleccionada?.label ?? placeholder}</span>
        <span className="ml-2 text-gray-400">▾</span>
      </button>

      {abierto && (
        <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {conBuscador && (
            <input
              autoFocus
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Buscar…"
              className="w-full border-b border-gray-100 px-3 py-2 text-sm outline-none"
            />
          )}
          {permitirVaciar && (
            <button
              type="button"
              onClick={() => {
                onChange('')
                setAbierto(false)
                setFiltro('')
              }}
              className="block w-full px-3 py-2 text-left text-sm text-gray-400 hover:bg-gray-50"
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
                setAbierto(false)
                setFiltro('')
              }}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${o.value === value ? 'bg-gray-50 font-medium' : ''}`}
            >
              {o.label}
            </button>
          ))}
          {filtradas.length === 0 && <div className="px-3 py-2 text-sm text-gray-400">Sin resultados</div>}
        </div>
      )}
    </div>
  )
}
