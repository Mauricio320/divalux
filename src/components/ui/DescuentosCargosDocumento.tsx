'use client'

import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form'
import type { DocumentoFormValues } from '@/lib/validations/factura'

type Props = {
  control: Control<DocumentoFormValues>
  register: UseFormRegister<DocumentoFormValues>
}

const campo = 'rounded-md border border-gray-300 px-2 py-1 text-sm'

export default function DescuentosCargosDocumento({ control, register }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: 'descuentosCargos' })

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Descuentos / cargos</h2>
        <button
          type="button"
          onClick={() => append({ esCargo: false, monto: 0, razon: '' })}
          className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
        >
          + Agregar
        </button>
      </div>
      <div className="space-y-2">
        {fields.map((f, i) => (
          <div key={f.id} className="grid grid-cols-12 items-center gap-2">
            <select {...register(`descuentosCargos.${i}.esCargo`, { setValueAs: (v) => v === 'true' || v === true })} className={`col-span-3 ${campo}`}>
              <option value="false">Descuento</option>
              <option value="true">Cargo</option>
            </select>
            <input placeholder="Motivo" {...register(`descuentosCargos.${i}.razon`)} className={`col-span-6 ${campo}`} />
            <input type="number" step="0.01" placeholder="Monto" {...register(`descuentosCargos.${i}.monto`, { valueAsNumber: true })} className={`col-span-2 ${campo}`} />
            <button type="button" onClick={() => remove(i)} className="col-span-1 text-sm text-red-600">
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
