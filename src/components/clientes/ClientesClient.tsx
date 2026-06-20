'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useClientes } from '@/hooks/clientes/use-clientes'
import { useCrearCliente } from '@/hooks/clientes/use-crear-cliente'
import { useCatalogos } from '@/hooks/catalogos/use-catalogos'
import { clienteSchema, type ClienteInput } from '@/lib/validations/cliente'
import { SelectBuscador } from '@/components/ui/SelectBuscador'

const campo = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm'

export default function ClientesClient() {
  const { data: clientes, isLoading } = useClientes()
  const { data: catalogos } = useCatalogos()
  const crear = useCrearCliente()
  const { register, handleSubmit, reset, control, formState } = useForm<ClienteInput>({
    resolver: zodResolver(clienteSchema),
    defaultValues: { typeDocumentIdentId: 3, esConsumidorFinal: false },
  })

  async function onSubmit(data: ClienteInput) {
    await crear.mutateAsync(data)
    reset({ identificationNumber: '', name: '', phone: '', address: '', email: '', typeDocumentIdentId: 3, esConsumidorFinal: false })
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Clientes</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 grid grid-cols-2 gap-3 rounded-lg border border-gray-200 p-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Tipo doc.</label>
          <Controller
            control={control}
            name="typeDocumentIdentId"
            render={({ field }) => (
              <SelectBuscador
                opciones={(catalogos?.tiposDocumentoIdentificacion ?? []).map((t) => ({ value: t.id, label: t.nombre }))}
                value={field.value ?? ''}
                onChange={(v) => v !== '' && field.onChange(v)}
                permitirVaciar={false}
              />
            )}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Identificación</label>
          <input {...register('identificationNumber')} className={campo} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">DV</label>
          <input type="number" {...register('dv', { valueAsNumber: true, setValueAs: (v) => (v === '' || Number.isNaN(v) ? undefined : Number(v)) })} className={campo} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">Nombre / Razón social</label>
          <input {...register('name')} className={campo} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Teléfono</label>
          <input {...register('phone')} className={campo} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">Dirección</label>
          <input {...register('address')} className={campo} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Correo</label>
          <input type="email" {...register('email')} className={campo} />
        </div>
        <div className="flex items-end">
          <button type="submit" disabled={formState.isSubmitting} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            Crear cliente
          </button>
        </div>
      </form>

      {isLoading ? (
        <p className="text-sm text-gray-500">Cargando…</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2">Identificación</th>
              <th className="py-2">Nombre</th>
              <th className="py-2">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {clientes?.items.map((c) => (
              <tr key={c.id} className="border-b border-gray-100">
                <td className="py-2">{c.identificationNumber}{c.dv != null ? `-${c.dv}` : ''}</td>
                <td className="py-2">{c.name}</td>
                <td className="py-2">{c.phone ?? '—'}</td>
              </tr>
            ))}
            {clientes?.items.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-400">Sin clientes</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
