'use client'

import {
  Controller,
  useFieldArray,
  type Control,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form'
import { SelectBuscador } from '@/components/ui/SelectBuscador'
import type { DocumentoFormValues } from '@/lib/validations/factura'
import type { ProductoDTO } from '@/actions/productos'

type Props = {
  control: Control<DocumentoFormValues>
  register: UseFormRegister<DocumentoFormValues>
  setValue: UseFormSetValue<DocumentoFormValues>
  productos: ProductoDTO[]
}

const campo = 'w-full rounded-md border border-gray-300 px-2 py-1 text-sm'

export default function LineasDocumento({ control, register, setValue, productos }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: 'lineas' })

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Líneas</h2>
        <button
          type="button"
          onClick={() => append({ productoId: '', cantidad: 1, precioUnitarioSinImpuesto: 0, taxId: 1, percent: 0, unitMeasureId: 70 })}
          className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
        >
          + Agregar
        </button>
      </div>

      <div className="space-y-2">
        {fields.map((f, i) => (
          <div key={f.id} className="grid grid-cols-12 items-center gap-2">
            <div className="col-span-5">
              <Controller
                control={control}
                name={`lineas.${i}.productoId`}
                render={({ field }) => (
                  <SelectBuscador
                    opciones={productos.map((p) => ({ value: p.id, label: `${p.code} — ${p.nombre}`, searchText: `${p.code} ${p.nombre}` }))}
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
                    placeholder="Producto"
                  />
                )}
              />
            </div>
            <input type="number" step="0.001" placeholder="Cant." {...register(`lineas.${i}.cantidad`, { valueAsNumber: true })} className={`col-span-2 ${campo}`} />
            <input type="number" step="0.01" placeholder="Precio" {...register(`lineas.${i}.precioUnitarioSinImpuesto`, { valueAsNumber: true })} className={`col-span-2 ${campo}`} />
            <input type="number" step="0.01" placeholder="% IVA" {...register(`lineas.${i}.percent`, { valueAsNumber: true })} className={`col-span-2 ${campo}`} />
            <button type="button" onClick={() => remove(i)} className="col-span-1 text-sm text-red-600">
              ✕
            </button>
          </div>
        ))}
        {fields.length === 0 && <p className="text-sm text-gray-400">Agrega al menos una línea</p>}
      </div>
    </div>
  )
}
