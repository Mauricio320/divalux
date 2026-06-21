'use client'

import {
  Controller,
  useFieldArray,
  type Control,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { SelectBuscador } from '@/components/ui/SelectBuscador'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { DocumentoFormValues } from '@/lib/validations/factura'
import type { ProductoDTO } from '@/actions/productos'

type Props = {
  control: Control<DocumentoFormValues>
  register: UseFormRegister<DocumentoFormValues>
  setValue: UseFormSetValue<DocumentoFormValues>
  productos: ProductoDTO[]
}

export default function LineasDocumento({ control, register, setValue, productos }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: 'lineas' })

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-160 border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2">
              <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-fg-muted">
                Producto
              </th>
              <th className="w-28 px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-fg-muted">
                Cantidad
              </th>
              <th className="w-36 px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-fg-muted">
                Precio
              </th>
              <th className="w-24 px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-fg-muted">
                % IVA
              </th>
              <th className="w-10 px-2 py-2.5" aria-label="Acciones" />
            </tr>
          </thead>
          <tbody>
            {fields.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-center text-sm text-fg-subtle">
                  Agrega al menos una línea
                </td>
              </tr>
            )}
            {fields.map((f, i) => (
              <tr key={f.id} className="border-b border-border last:border-0 hover:bg-surface-2 transition-colors duration-150">
                <td className="px-3 py-2">
                  <Controller
                    control={control}
                    name={`lineas.${i}.productoId`}
                    render={({ field }) => (
                      <SelectBuscador
                        opciones={productos.map((p) => ({
                          value: p.id,
                          label: `${p.code} — ${p.nombre}`,
                          searchText: `${p.code} ${p.nombre}`,
                        }))}
                        value={field.value ?? ''}
                        onChange={(v) => {
                          field.onChange(v)
                          const prod = productos.find((p) => p.id === v)
                          if (prod) {
                            setValue(`lineas.${i}.precioUnitarioSinImpuesto`, prod.precioSinImpuesto)
                            setValue(`lineas.${i}.taxId`, prod.taxId)
                            setValue(`lineas.${i}.percent`, prod.percent)
                            setValue(`lineas.${i}.unitMeasureId`, prod.unitMeasureId)
                          }
                        }}
                        placeholder="Seleccionar producto"
                      />
                    )}
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="0.000"
                    className="text-right"
                    {...register(`lineas.${i}.cantidad`, { valueAsNumber: true })}
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="text-right"
                    {...register(`lineas.${i}.precioUnitarioSinImpuesto`, { valueAsNumber: true })}
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="text-right"
                    {...register(`lineas.${i}.percent`, { valueAsNumber: true })}
                  />
                </td>
                <td className="px-2 py-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="Eliminar línea"
                    onClick={() => remove(i)}
                    className="text-danger hover:text-danger hover:bg-danger/10"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          leftIcon={<Plus size={16} aria-hidden="true" />}
          onClick={() =>
            append({
              productoId: '',
              cantidad: 1,
              precioUnitarioSinImpuesto: 0,
              taxId: 1,
              percent: 0,
              unitMeasureId: 70,
            })
          }
        >
          Agregar línea
        </Button>
      </div>
    </div>
  )
}
