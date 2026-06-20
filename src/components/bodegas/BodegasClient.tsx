'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBodegas } from '@/hooks/bodegas/use-bodegas'
import { useCrearBodega } from '@/hooks/bodegas/use-crear-bodega'
import { bodegaSchema, type BodegaInput } from '@/lib/validations/inventario'

export default function BodegasClient() {
  const { data: bodegas, isLoading } = useBodegas()
  const crear = useCrearBodega()
  const { register, handleSubmit, reset, formState } = useForm<BodegaInput>({
    resolver: zodResolver(bodegaSchema),
    defaultValues: { esPrincipal: false },
  })

  async function onSubmit(data: BodegaInput) {
    await crear.mutateAsync(data)
    reset({ nombre: '', esPrincipal: false })
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Bodegas</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 flex items-end gap-3 rounded-lg border border-gray-200 p-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Nueva bodega</label>
          <input {...register('nombre')} placeholder="Nombre" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm text-gray-700">
          <input type="checkbox" {...register('esPrincipal')} /> Principal
        </label>
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Crear
        </button>
      </form>

      {isLoading ? (
        <p className="text-sm text-gray-500">Cargando…</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2">Nombre</th>
              <th className="py-2">Principal</th>
              <th className="py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {bodegas?.map((b) => (
              <tr key={b.id} className="border-b border-gray-100">
                <td className="py-2">{b.nombre}</td>
                <td className="py-2">{b.esPrincipal ? 'Sí' : '—'}</td>
                <td className="py-2">{b.activo ? 'Activa' : 'Inactiva'}</td>
              </tr>
            ))}
            {bodegas?.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-400">
                  Sin bodegas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
