'use client'

import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import type { DocumentoFormValues } from '@/lib/validations/factura'

type Props = {
  control: Control<DocumentoFormValues>
  register: UseFormRegister<DocumentoFormValues>
}

export default function DescuentosCargosDocumento({ control, register }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: 'descuentosCargos' })

  return (
    <div className="space-y-3">
      {fields.length > 0 && (
        <div className="space-y-2">
          {fields.map((f, i) => (
            <div key={f.id} className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-3">
                <Select
                  {...register(`descuentosCargos.${i}.esCargo`, {
                    setValueAs: (v) => v === 'true' || v === true,
                  })}
                >
                  <option value="false">Descuento</option>
                  <option value="true">Cargo</option>
                </Select>
              </div>
              <div className="col-span-6">
                <Input
                  placeholder="Motivo"
                  {...register(`descuentosCargos.${i}.razon`)}
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="text-right"
                  {...register(`descuentosCargos.${i}.monto`, { valueAsNumber: true })}
                />
              </div>
              <div className="col-span-1 flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Eliminar fila"
                  onClick={() => remove(i)}
                  className="text-danger hover:text-danger hover:bg-danger/10"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {fields.length === 0 && (
        <p className="text-sm text-fg-subtle">Sin descuentos ni cargos adicionales</p>
      )}

      <div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          leftIcon={<Plus size={16} aria-hidden="true" />}
          onClick={() => append({ esCargo: false, monto: 0, razon: '' })}
        >
          Agregar descuento o cargo
        </Button>
      </div>
    </div>
  )
}
