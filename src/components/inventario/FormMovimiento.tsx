'use client'

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { SelectBuscador } from '@/components/ui/SelectBuscador'
import { useProductos } from '@/hooks/productos/use-productos'
import { useBodegas } from '@/hooks/bodegas/use-bodegas'
import { useRegistrarEntrada } from '@/hooks/inventario/use-registrar-entrada'
import { useRegistrarAjuste } from '@/hooks/inventario/use-registrar-ajuste'
import { useToast } from '@/hooks/ui/useToast'
import Card from '@/components/ui/Card'
import Field from '@/components/ui/Field'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

type FormData = { productoId: string; bodegaId: string; cantidad: number; motivo?: string }

export default function FormMovimiento() {
  const [modo, setModo] = useState<'entrada' | 'ajuste'>('entrada')
  const { toast } = useToast()
  const { data: productos } = useProductos()
  const { data: bodegas } = useBodegas()
  const entrada = useRegistrarEntrada()
  const ajuste = useRegistrarAjuste()
  const { control, register, handleSubmit, reset, formState } = useForm<FormData>()

  async function onSubmit(d: FormData) {
    try {
      if (modo === 'entrada') {
        await entrada.mutateAsync({ productoId: d.productoId, bodegaId: d.bodegaId, cantidad: d.cantidad, motivo: d.motivo })
      } else {
        await ajuste.mutateAsync({ productoId: d.productoId, bodegaId: d.bodegaId, cantidadFinal: d.cantidad, motivo: d.motivo })
      }
      reset({ productoId: '', bodegaId: '', cantidad: undefined, motivo: '' })
      toast({ type: 'success', message: `${modo === 'entrada' ? 'Entrada' : 'Ajuste'} registrado correctamente` })
    } catch (e) {
      toast({ type: 'error', message: e instanceof Error ? e.message : 'Error al registrar movimiento' })
    }
  }

  return (
    <Card>
      <Card.Header title="Registrar movimiento" />
      <Card.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2">
            {(['entrada', 'ajuste'] as const).map((m) => (
              <Button
                key={m}
                type="button"
                variant={modo === m ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setModo(m)}
              >
                {m === 'entrada' ? 'Entrada' : 'Ajuste'}
              </Button>
            ))}
          </div>

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

          <Field label="Bodega" required>
            <Controller
              control={control}
              name="bodegaId"
              rules={{ required: true }}
              render={({ field }) => (
                <SelectBuscador
                  opciones={(bodegas ?? []).map((b) => ({ value: b.id, label: b.nombre }))}
                  value={field.value ?? ''}
                  onChange={(v) => field.onChange(v)}
                  placeholder="Seleccionar bodega"
                />
              )}
            />
          </Field>

          <Field label={modo === 'entrada' ? 'Cantidad a ingresar' : 'Cantidad final'} required>
            <Input
              type="number"
              step="0.001"
              placeholder={modo === 'entrada' ? 'Cantidad a ingresar' : 'Cantidad final'}
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
            Registrar {modo}
          </Button>
        </form>
      </Card.Body>
    </Card>
  )
}
