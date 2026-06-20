'use client'

import { useState } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { crearFacturaSchema, type CrearFacturaInput, type DocumentoFormValues } from '@/lib/validations/factura'
import { useClientes } from '@/hooks/clientes/use-clientes'
import { useBodegas } from '@/hooks/bodegas/use-bodegas'
import { useProductos } from '@/hooks/productos/use-productos'
import { useCatalogos } from '@/hooks/catalogos/use-catalogos'
import { useCrearFactura } from '@/hooks/facturas/use-crear-factura'
import { SelectBuscador } from '@/components/ui/SelectBuscador'
import LineasDocumento from '@/components/ui/LineasDocumento'
import DescuentosCargosDocumento from '@/components/ui/DescuentosCargosDocumento'
import ResumenTotalesDocumento from '@/components/ui/ResumenTotalesDocumento'

const campo = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm'

export default function FormFactura() {
  const router = useRouter()
  const [error, setError] = useState('')
  const { data: clientes } = useClientes()
  const { data: bodegas } = useBodegas()
  const { data: productos } = useProductos()
  const { data: catalogos } = useCatalogos()
  const crear = useCrearFactura()

  const { control, register, setValue, handleSubmit, formState } = useForm<DocumentoFormValues>({
    resolver: zodResolver(crearFacturaSchema) as Resolver<DocumentoFormValues>,
    defaultValues: {
      clienteId: '',
      bodegaId: '',
      paymentFormId: 1,
      paymentMethodId: 10,
      sendmail: false,
      lineas: [{ productoId: '', cantidad: 1, precioUnitarioSinImpuesto: 0, taxId: 1, percent: 0, unitMeasureId: 70 }],
      descuentosCargos: [],
    },
  })

  async function onSubmit(data: DocumentoFormValues) {
    setError('')
    const input: CrearFacturaInput = {
      clienteId: data.clienteId,
      bodegaId: data.bodegaId ?? '',
      paymentFormId: data.paymentFormId,
      paymentMethodId: data.paymentMethodId,
      paymentDueDate: data.paymentDueDate,
      durationMeasure: data.durationMeasure,
      fecha: data.fecha,
      notes: data.notes,
      headNote: data.headNote,
      footNote: data.footNote,
      sendmail: data.sendmail ?? false,
      lineas: data.lineas,
      descuentosCargos: data.descuentosCargos,
    }
    try {
      const res = await crear.mutateAsync(input)
      router.push(`/facturas/${res.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo crear la factura')
    }
  }

  const consumidorFinal = clientes?.items.find((c) => c.esConsumidorFinal)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">Nueva factura</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-medium text-gray-600">Cliente</label>
            {consumidorFinal && (
              <button type="button" onClick={() => setValue('clienteId', consumidorFinal.id)} className="text-xs text-blue-600 hover:underline">
                Consumidor final
              </button>
            )}
          </div>
          <Controller
            control={control}
            name="clienteId"
            render={({ field }) => (
              <SelectBuscador
                opciones={(clientes?.items ?? []).map((c) => ({ value: c.id, label: c.name, searchText: `${c.name} ${c.identificationNumber}` }))}
                value={field.value ?? ''}
                onChange={(v) => field.onChange(v)}
                placeholder="Seleccionar cliente"
              />
            )}
          />
          {formState.errors.clienteId && <p className="text-xs text-red-600">{formState.errors.clienteId.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Bodega</label>
          <Controller
            control={control}
            name="bodegaId"
            render={({ field }) => (
              <SelectBuscador
                opciones={(bodegas ?? []).map((b) => ({ value: b.id, label: b.nombre }))}
                value={field.value ?? ''}
                onChange={(v) => field.onChange(v)}
                placeholder="Seleccionar bodega"
              />
            )}
          />
          {formState.errors.bodegaId && <p className="text-xs text-red-600">{formState.errors.bodegaId.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Forma de pago</label>
          <select {...register('paymentFormId', { valueAsNumber: true })} className={campo}>
            <option value={1}>Contado</option>
            <option value={2}>Crédito</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Método de pago</label>
          <select {...register('paymentMethodId', { valueAsNumber: true })} className={campo}>
            {(catalogos?.metodosPago ?? []).map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <LineasDocumento control={control} register={register} setValue={setValue} productos={productos?.items ?? []} />
      <DescuentosCargosDocumento control={control} register={register} />

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Notas</label>
        <textarea {...register('notes')} rows={2} className={campo} />
      </div>

      <ResumenTotalesDocumento control={control} />

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={formState.isSubmitting} className="rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-50">
          {formState.isSubmitting ? 'Guardando…' : 'Guardar borrador'}
        </button>
      </div>
    </form>
  )
}
