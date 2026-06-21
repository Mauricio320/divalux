'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBodegas } from '@/hooks/bodegas/use-bodegas'
import { useCrearBodega } from '@/hooks/bodegas/use-crear-bodega'
import { bodegaSchema, type BodegaInput } from '@/lib/validations/inventario'
import Field from '@/components/ui/Field'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Table from '@/components/ui/Table'
import Skeleton from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'

export default function BodegasClient() {
  const { data: bodegas, isLoading } = useBodegas()
  const crear = useCrearBodega()
  const [abierto, setAbierto] = useState(false)
  const { register, handleSubmit, reset, formState } = useForm<BodegaInput>({
    resolver: zodResolver(bodegaSchema),
    defaultValues: { esPrincipal: false },
  })

  function cerrar() {
    setAbierto(false)
    reset({ nombre: '', esPrincipal: false })
  }

  async function onSubmit(data: BodegaInput) {
    await crear.mutateAsync(data)
    cerrar()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-fg">Bodegas</h1>
        <Button leftIcon={<Plus size={16} aria-hidden="true" />} onClick={() => setAbierto(true)}>
          Nueva bodega
        </Button>
      </div>

      <Table>
        <Table.Head>
          <tr>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
            <Table.HeaderCell>Principal</Table.HeaderCell>
            <Table.HeaderCell>Estado</Table.HeaderCell>
          </tr>
        </Table.Head>
        <Table.Body>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton.Row key={i} cols={3} />
            ))
          ) : bodegas && bodegas.length > 0 ? (
            bodegas.map((b) => (
              <Table.Row key={b.id} zebra>
                <Table.Cell>{b.nombre}</Table.Cell>
                <Table.Cell>{b.esPrincipal ? 'Sí' : '—'}</Table.Cell>
                <Table.Cell>
                  <Badge variant={b.activo ? 'success' : 'neutral'} size="sm">
                    {b.activo ? 'Activa' : 'Inactiva'}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <tr>
              <td colSpan={3}>
                <EmptyState
                  title="Sin bodegas"
                  description="Crea la primera bodega con el botón Nueva bodega."
                  action={
                    <Button leftIcon={<Plus size={16} aria-hidden="true" />} onClick={() => setAbierto(true)}>
                      Nueva bodega
                    </Button>
                  }
                />
              </td>
            </tr>
          )}
        </Table.Body>
      </Table>

      <Modal open={abierto} onClose={cerrar} title="Nueva bodega" size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Nombre" htmlFor="nombre" required error={formState.errors.nombre?.message}>
            <Input
              id="nombre"
              {...register('nombre')}
              placeholder="Nombre de la bodega"
              error={!!formState.errors.nombre}
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-fg cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('esPrincipal')}
              className="h-4 w-4 rounded border-border accent-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-colors duration-150"
            />
            Principal
          </label>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={cerrar}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={formState.isSubmitting}>
              Crear
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
