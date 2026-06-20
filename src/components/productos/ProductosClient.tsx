'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useProductos } from '@/hooks/productos/use-productos'
import { useCrearProducto } from '@/hooks/productos/use-crear-producto'
import { useCatalogos } from '@/hooks/catalogos/use-catalogos'
import { productoSchema, type ProductoInput } from '@/lib/validations/producto'
import { SelectBuscador } from '@/components/ui/SelectBuscador'
import { formatCOP } from '@/lib/format'

const campo = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm'

export default function ProductosClient() {
  const { data: productos, isLoading } = useProductos()
  const { data: catalogos } = useCatalogos()
  const crear = useCrearProducto()
  const { register, handleSubmit, reset, control, formState } = useForm<ProductoInput>({
    resolver: zodResolver(productoSchema),
    defaultValues: { unitMeasureId: 70, taxId: 1, percent: 0, controlaStock: true, typeItemIdentId: 4 },
  })

  async function onSubmit(data: ProductoInput) {
    await crear.mutateAsync(data)
    reset({ code: '', nombre: '', precioSinImpuesto: 0, unitMeasureId: 70, taxId: 1, percent: 0, controlaStock: true, typeItemIdentId: 4 })
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Productos</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 grid grid-cols-2 gap-3 rounded-lg border border-gray-200 p-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Código</label>
          <input {...register('code')} className={campo} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">Nombre</label>
          <input {...register('nombre')} className={campo} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Precio (sin IVA)</label>
          <input type="number" step="0.01" {...register('precioSinImpuesto', { valueAsNumber: true })} className={campo} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Impuesto</label>
          <Controller
            control={control}
            name="taxId"
            render={({ field }) => (
              <SelectBuscador
                opciones={(catalogos?.impuestos ?? []).map((i) => ({ value: i.id, label: i.nombre }))}
                value={field.value ?? ''}
                onChange={(v) => v !== '' && field.onChange(v)}
                permitirVaciar={false}
              />
            )}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">% IVA</label>
          <input type="number" step="0.01" {...register('percent', { valueAsNumber: true })} className={campo} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Unidad</label>
          <Controller
            control={control}
            name="unitMeasureId"
            render={({ field }) => (
              <SelectBuscador
                opciones={(catalogos?.unidadesMedida ?? []).map((u) => ({ value: u.id, label: u.nombre }))}
                value={field.value ?? ''}
                onChange={(v) => v !== '' && field.onChange(v)}
                permitirVaciar={false}
              />
            )}
          />
        </div>
        <label className="flex items-center gap-2 pt-5 text-sm text-gray-700">
          <input type="checkbox" {...register('controlaStock')} /> Controla stock
        </label>
        <div className="flex items-end">
          <button type="submit" disabled={formState.isSubmitting} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            Crear producto
          </button>
        </div>
      </form>

      {isLoading ? (
        <p className="text-sm text-gray-500">Cargando…</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2">Código</th>
              <th className="py-2">Nombre</th>
              <th className="py-2 text-right">Precio</th>
              <th className="py-2 text-right">IVA</th>
            </tr>
          </thead>
          <tbody>
            {productos?.items.map((p) => (
              <tr key={p.id} className="border-b border-gray-100">
                <td className="py-2">{p.code}</td>
                <td className="py-2">{p.nombre}</td>
                <td className="py-2 text-right">{formatCOP(p.precioSinImpuesto)}</td>
                <td className="py-2 text-right">{p.percent}%</td>
              </tr>
            ))}
            {productos?.items.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-400">Sin productos</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
