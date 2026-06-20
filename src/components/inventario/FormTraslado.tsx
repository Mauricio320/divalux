'use client'

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { SelectBuscador } from '@/components/ui/SelectBuscador'
import { useProductos } from '@/hooks/productos/use-productos'
import { useBodegas } from '@/hooks/bodegas/use-bodegas'
import { useTrasladar } from '@/hooks/inventario/use-trasladar'

type FormData = { productoId: string; bodegaOrigenId: string; bodegaDestinoId: string; cantidad: number; motivo?: string }

export default function FormTraslado() {
  const [error, setError] = useState('')
  const { data: productos } = useProductos()
  const { data: bodegas } = useBodegas()
  const trasladar = useTrasladar()
  const { control, register, handleSubmit, reset, formState } = useForm<FormData>()

  async function onSubmit(d: FormData) {
    setError('')
    try {
      await trasladar.mutateAsync(d)
      reset({ productoId: '', bodegaOrigenId: '', bodegaDestinoId: '', cantidad: undefined, motivo: '' })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    }
  }

  const opcBodegas = (bodegas ?? []).map((b) => ({ value: b.id, label: b.nombre }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-lg border border-gray-200 p-4">
      <p className="text-sm font-semibold text-gray-700">Traslado entre bodegas</p>
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
      <div className="grid grid-cols-2 gap-2">
        <Controller
          control={control}
          name="bodegaOrigenId"
          rules={{ required: true }}
          render={({ field }) => (
            <SelectBuscador opciones={opcBodegas} value={field.value ?? ''} onChange={(v) => field.onChange(v)} placeholder="Origen" />
          )}
        />
        <Controller
          control={control}
          name="bodegaDestinoId"
          rules={{ required: true }}
          render={({ field }) => (
            <SelectBuscador opciones={opcBodegas} value={field.value ?? ''} onChange={(v) => field.onChange(v)} placeholder="Destino" />
          )}
        />
      </div>
      <input
        type="number"
        step="0.001"
        placeholder="Cantidad"
        {...register('cantidad', { valueAsNumber: true, required: true })}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <input {...register('motivo')} placeholder="Motivo (opcional)" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={formState.isSubmitting} className="w-full rounded-md bg-gray-900 py-2 text-sm font-medium text-white disabled:opacity-50">
        Trasladar
      </button>
    </form>
  )
}
