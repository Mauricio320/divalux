'use client'

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { SelectBuscador } from '@/components/ui/SelectBuscador'
import { useProductos } from '@/hooks/productos/use-productos'
import { useBodegas } from '@/hooks/bodegas/use-bodegas'
import { useRegistrarEntrada } from '@/hooks/inventario/use-registrar-entrada'
import { useRegistrarAjuste } from '@/hooks/inventario/use-registrar-ajuste'

type FormData = { productoId: string; bodegaId: string; cantidad: number; motivo?: string }

export default function FormMovimiento() {
  const [modo, setModo] = useState<'entrada' | 'ajuste'>('entrada')
  const [error, setError] = useState('')
  const { data: productos } = useProductos()
  const { data: bodegas } = useBodegas()
  const entrada = useRegistrarEntrada()
  const ajuste = useRegistrarAjuste()
  const { control, register, handleSubmit, reset, formState } = useForm<FormData>()

  async function onSubmit(d: FormData) {
    setError('')
    try {
      if (modo === 'entrada') {
        await entrada.mutateAsync({ productoId: d.productoId, bodegaId: d.bodegaId, cantidad: d.cantidad, motivo: d.motivo })
      } else {
        await ajuste.mutateAsync({ productoId: d.productoId, bodegaId: d.bodegaId, cantidadFinal: d.cantidad, motivo: d.motivo })
      }
      reset({ productoId: '', bodegaId: '', cantidad: undefined, motivo: '' })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-lg border border-gray-200 p-4">
      <div className="flex gap-2">
        {(['entrada', 'ajuste'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setModo(m)}
            className={`rounded-md px-3 py-1 text-sm ${modo === m ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {m === 'entrada' ? 'Entrada' : 'Ajuste'}
          </button>
        ))}
      </div>
      <Controller
        control={control}
        name="productoId"
        rules={{ required: true }}
        render={({ field }) => (
          <SelectBuscador
            opciones={(productos?.items ?? []).filter((p) => p.controlaStock).map((p) => ({ value: p.id, label: `${p.code} — ${p.nombre}` }))}
            value={field.value ?? ''}
            onChange={(v) => field.onChange(v)}
            placeholder="Producto"
          />
        )}
      />
      <Controller
        control={control}
        name="bodegaId"
        rules={{ required: true }}
        render={({ field }) => (
          <SelectBuscador
            opciones={(bodegas ?? []).map((b) => ({ value: b.id, label: b.nombre }))}
            value={field.value ?? ''}
            onChange={(v) => field.onChange(v)}
            placeholder="Bodega"
          />
        )}
      />
      <input
        type="number"
        step="0.001"
        placeholder={modo === 'entrada' ? 'Cantidad a ingresar' : 'Cantidad final'}
        {...register('cantidad', { valueAsNumber: true, required: true })}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <input {...register('motivo')} placeholder="Motivo (opcional)" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={formState.isSubmitting} className="w-full rounded-md bg-gray-900 py-2 text-sm font-medium text-white disabled:opacity-50">
        Registrar {modo}
      </button>
    </form>
  )
}
