'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useClientes } from '@/hooks/clientes/use-clientes'
import { useCrearCliente } from '@/hooks/clientes/use-crear-cliente'
import { useCatalogos } from '@/hooks/catalogos/use-catalogos'
import { clienteSchema, type ClienteInput } from '@/lib/validations/cliente'
import { SelectBuscador } from '@/components/ui/SelectBuscador'
import Field from '@/components/ui/Field'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Table from '@/components/ui/Table'
import Skeleton from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import Modal from '@/components/ui/Modal'

export default function ClientesClient() {
  const { data: clientes, isLoading } = useClientes()
  const { data: catalogos } = useCatalogos()
  const crear = useCrearCliente()
  const [abierto, setAbierto] = useState(false)
  const { register, handleSubmit, reset, control, formState } = useForm<ClienteInput>({
    resolver: zodResolver(clienteSchema),
    defaultValues: { typeDocumentIdentId: 3, esConsumidorFinal: false },
  })

  function cerrar() {
    setAbierto(false)
    reset({ identificationNumber: '', name: '', phone: '', address: '', email: '', typeDocumentIdentId: 3, esConsumidorFinal: false })
  }

  async function onSubmit(data: ClienteInput) {
    await crear.mutateAsync(data)
    cerrar()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-fg">Clientes</h1>
        <Button leftIcon={<Plus size={16} aria-hidden="true" />} onClick={() => setAbierto(true)}>
          Nuevo cliente
        </Button>
      </div>

      <Table>
        <Table.Head>
          <tr>
            <Table.HeaderCell>Identificación</Table.HeaderCell>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
            <Table.HeaderCell>Teléfono</Table.HeaderCell>
          </tr>
        </Table.Head>
        <Table.Body>
          {isLoading ? (
            <>
              <Skeleton.Row cols={3} />
              <Skeleton.Row cols={3} />
              <Skeleton.Row cols={3} />
              <Skeleton.Row cols={3} />
            </>
          ) : clientes?.items.length === 0 ? (
            <tr>
              <td colSpan={3}>
                <EmptyState
                  title="Sin clientes"
                  description="Aún no hay clientes registrados."
                  action={
                    <Button leftIcon={<Plus size={16} aria-hidden="true" />} onClick={() => setAbierto(true)}>
                      Nuevo cliente
                    </Button>
                  }
                />
              </td>
            </tr>
          ) : (
            clientes?.items.map((c) => (
              <Table.Row key={c.id} zebra>
                <Table.Cell>{c.identificationNumber}{c.dv != null ? `-${c.dv}` : ''}</Table.Cell>
                <Table.Cell>{c.name}</Table.Cell>
                <Table.Cell>{c.phone ?? '—'}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      <Modal open={abierto} onClose={cerrar} title="Nuevo cliente" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Tipo doc." htmlFor="typeDocumentIdentId">
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
          </Field>

          <Field label="Identificación" htmlFor="identificationNumber" error={formState.errors.identificationNumber?.message}>
            <Input id="identificationNumber" {...register('identificationNumber')} error={!!formState.errors.identificationNumber} />
          </Field>

          <Field label="DV" htmlFor="dv" error={formState.errors.dv?.message}>
            <Input
              id="dv"
              type="number"
              {...register('dv', { valueAsNumber: true, setValueAs: (v) => (v === '' || Number.isNaN(v) ? undefined : Number(v)) })}
              error={!!formState.errors.dv}
            />
          </Field>

          <Field label="Nombre / Razón social" htmlFor="name" required error={formState.errors.name?.message} className="sm:col-span-2">
            <Input id="name" {...register('name')} error={!!formState.errors.name} />
          </Field>

          <Field label="Teléfono" htmlFor="phone" error={formState.errors.phone?.message}>
            <Input id="phone" {...register('phone')} error={!!formState.errors.phone} />
          </Field>

          <Field label="Dirección" htmlFor="address" error={formState.errors.address?.message} className="sm:col-span-2">
            <Input id="address" {...register('address')} error={!!formState.errors.address} />
          </Field>

          <Field label="Correo" htmlFor="email" error={formState.errors.email?.message}>
            <Input id="email" type="email" {...register('email')} error={!!formState.errors.email} />
          </Field>

          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="ghost" onClick={cerrar}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={formState.isSubmitting}>
              Crear cliente
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
