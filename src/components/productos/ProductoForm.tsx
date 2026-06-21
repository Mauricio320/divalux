'use client'

import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCatalogos } from '@/hooks/catalogos/use-catalogos'
import { useCrearProducto } from '@/hooks/productos/use-crear-producto'
import { useEditarProducto } from '@/hooks/productos/use-editar-producto'
import { useSubirImagenProducto } from '@/hooks/productos/use-subir-imagen-producto'
import { productoSchema, type ProductoInput } from '@/lib/validations/producto'
import type { ProductoDTO } from '@/actions/productos'
import { SelectBuscador } from '@/components/ui/SelectBuscador'
import ImageUploader from '@/components/ui/ImageUploader'
import Field from '@/components/ui/Field'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useToast } from '@/hooks/ui/useToast'

type Props = {
  producto?: ProductoDTO | null
  onDone?: () => void
}

export default function ProductoForm({ producto, onDone }: Props) {
  const { toast } = useToast()
  const { data: catalogos } = useCatalogos()
  const crear = useCrearProducto()
  const editar = useEditarProducto()
  const subirImagen = useSubirImagenProducto()
  const [subiendoImagen, setSubiendoImagen] = useState(false)

  const esEdicion = !!producto

  const { register, handleSubmit, control, setValue, formState } = useForm<ProductoInput>({
    resolver: zodResolver(productoSchema),
    defaultValues: producto
      ? {
          code: producto.code,
          nombre: producto.nombre,
          precioSinImpuesto: producto.precioSinImpuesto,
          unitMeasureId: producto.unitMeasureId,
          taxId: producto.taxId,
          percent: producto.percent,
          controlaStock: producto.controlaStock,
          typeItemIdentId: producto.typeItemIdentId,
          imagenUrl: producto.imagenUrl ?? undefined,
          imagenPublicId: undefined,
        }
      : {
          unitMeasureId: 70,
          taxId: 1,
          percent: 0,
          controlaStock: true,
          typeItemIdentId: 4,
          imagenUrl: undefined,
          imagenPublicId: undefined,
        },
  })

  async function onSubmit(data: ProductoInput) {
    try {
      if (esEdicion && producto) {
        await editar.mutateAsync({ ...data, id: producto.id })
        toast({ type: 'success', message: 'Producto actualizado' })
      } else {
        await crear.mutateAsync(data)
        toast({ type: 'success', message: 'Producto creado' })
      }
      onDone?.()
    } catch (e) {
      toast({ type: 'error', message: e instanceof Error ? e.message : 'No se pudo guardar el producto' })
    }
  }

  const errors = formState.errors
  const imagenUrl = useWatch({ control, name: 'imagenUrl' }) ?? null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Imagen del producto" className="sm:col-span-2">
        <ImageUploader
          value={imagenUrl}
          subir={(file) => subirImagen.mutateAsync(file)}
          onUploadingChange={setSubiendoImagen}
          onChange={(img) => {
            setValue('imagenUrl', img?.url ?? null, { shouldDirty: true })
            setValue('imagenPublicId', img?.publicId ?? null, { shouldDirty: true })
          }}
        />
      </Field>

      <Field label="Código" required error={errors.code?.message}>
        <Input {...register('code')} error={!!errors.code} />
      </Field>

      <Field label="Nombre" required error={errors.nombre?.message}>
        <Input {...register('nombre')} error={!!errors.nombre} />
      </Field>

      <Field label="Precio (sin IVA)" required error={errors.precioSinImpuesto?.message}>
        <Input
          type="number"
          step="0.01"
          {...register('precioSinImpuesto', { valueAsNumber: true })}
          error={!!errors.precioSinImpuesto}
        />
      </Field>

      <Field label="% IVA" error={errors.percent?.message}>
        <Input
          type="number"
          step="0.01"
          {...register('percent', { valueAsNumber: true })}
          error={!!errors.percent}
        />
      </Field>

      <Field label="Impuesto">
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
      </Field>

      <Field label="Unidad de medida">
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
      </Field>

      <label className="flex items-center gap-2 text-sm text-fg sm:col-span-2">
        <input type="checkbox" {...register('controlaStock')} className="h-4 w-4 rounded border-border" />
        Controla stock
      </label>

      <div className="flex justify-end gap-2 sm:col-span-2">
        {onDone && (
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={formState.isSubmitting} disabled={subiendoImagen}>
          {esEdicion ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </form>
  )
}
