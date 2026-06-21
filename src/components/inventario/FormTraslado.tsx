'use client'

import { Controller, useForm } from 'react-hook-form'
import { SelectBuscador } from '@/components/ui/SelectBuscador'
import { useProductos } from '@/hooks/productos/use-productos'
import { useBodegas } from '@/hooks/bodegas/use-bodegas'
import { useTrasladar } from '@/hooks/inventario/use-trasladar'
import { useToast } from '@/hooks/ui/useToast'
import Card from '@/components/ui/Card'
import Field from '@/components/ui/Field'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

type FormData = { productoId: string; bodegaOrigenId: string; bodegaDestinoId: string; cantidad: number; motivo?: string }

export default function FormTraslado() {
  const { toast } = useToast()
  const { data: productos } = useProductos()
  const { data: bodegas } = useBodegas()
  const trasladar = useTrasladar()
  const { control, register, handleSubmit, reset, formState } = useForm<FormData>()

  async function onSubmit(d: FormData) {
    try {
      await trasladar.mutateAsync(d)
      reset({ productoId: '', bodegaOrigenId: '', bodegaDestinoId: '', cantidad: undefined, motivo: '' })
      toast({ type: 'success', message: 'Traslado registrado correctamente' })
    } catch (e) {
      toast({ type: 'error', message: e instanceof Error ? e.message : 'Error al registrar traslado' })
    }
  }

  const opcBodegas = (bodegas ?? []).map((b) => ({ value: b.id, label: b.nombre }))

  return (
    <Card>
      <Card.Header title="Traslado entre bodegas" />
      <Card.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Producto" required>
            <Controller
              control={control}
              name="productoId"
              rules={{ required: true }}
              render={({ field }) => (
                <SelectBuscador
                  opciones={(productos?.items ?? []).filter((p) => p.controlaStock).map((p) => ({ value: p.id, label: `${p.code} — ${p.nombre}` }))}
                  value={field.value ?? ''}
                  onChange={(v) => field.onChange(v)}
                  placeholder="Seleccionar producto"
                />
              )}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Origen" required>
              <Controller
                control={control}
                name="bodegaOrigenId"
                rules={{ required: true }}
                render={({ field }) => (
                  <SelectBuscador
                    opciones={opcBodegas}
                    value={field.value ?? ''}
                    onChange={(v) => field.onChange(v)}
                    placeholder="Bodega origen"
                  />
                )}
              />
            </Field>

            <Field label="Destino" required>
              <Controller
                control={control}
                name="bodegaDestinoId"
                rules={{ required: true }}
                render={({ field }) => (
                  <SelectBuscador
                    opciones={opcBodegas}
                    value={field.value ?? ''}
                    onChange={(v) => field.onChange(v)}
                    placeholder="Bodega destino"
                  />
                )}
              />
            </Field>
          </div>

          <Field label="Cantidad" required>
            <Input
              type="number"
              step="0.001"
              placeholder="Cantidad"
              {...register('cantidad', { valueAsNumber: true, required: true })}
            />
          </Field>

          <Field label="Motivo">
            <Input
              {...register('motivo')}
              placeholder="Motivo (opcional)"
            />
          </Field>

          <Button type="submit" fullWidth isLoading={formState.isSubmitting}>
            Trasladar
          </Button>
        </form>
      </Card.Body>
    </Card>
  )
}
