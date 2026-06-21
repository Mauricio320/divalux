'use client'

import { Controller, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { crearCotizacionSchema, type CrearCotizacionInput } from '@/lib/validations/cotizacion'
import type { DocumentoFormValues } from '@/lib/validations/factura'
import { useClientes } from '@/hooks/clientes/use-clientes'
import { useProductos } from '@/hooks/productos/use-productos'
import { useCatalogos } from '@/hooks/catalogos/use-catalogos'
import { useCrearCotizacion } from '@/hooks/cotizaciones/use-crear-cotizacion'
import { useToast } from '@/hooks/ui/useToast'
import { SelectBuscador } from '@/components/ui/SelectBuscador'
import LineasDocumento from '@/components/ui/LineasDocumento'
import DescuentosCargosDocumento from '@/components/ui/DescuentosCargosDocumento'
import ResumenTotalesDocumento from '@/components/ui/ResumenTotalesDocumento'
import Card from '@/components/ui/Card'
import Field from '@/components/ui/Field'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

export default function FormCotizacion() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: clientes } = useClientes()
  const { data: productos } = useProductos()
  const { data: catalogos } = useCatalogos()
  const crear = useCrearCotizacion()

  const { control, register, setValue, handleSubmit, formState } = useForm<DocumentoFormValues>({
    resolver: zodResolver(crearCotizacionSchema) as Resolver<DocumentoFormValues>,
    defaultValues: {
      clienteId: '',
      paymentFormId: 1,
      paymentMethodId: 10,
      lineas: [{ productoId: '', cantidad: 1, precioUnitarioSinImpuesto: 0, taxId: 1, percent: 0, unitMeasureId: 70 }],
      descuentosCargos: [],
    },
  })

  async function onSubmit(data: DocumentoFormValues) {
    const input: CrearCotizacionInput = {
      clienteId: data.clienteId,
      validezHasta: data.validezHasta,
      paymentFormId: data.paymentFormId,
      paymentMethodId: data.paymentMethodId,
      fecha: data.fecha,
      notes: data.notes,
      headNote: data.headNote,
      footNote: data.footNote,
      lineas: data.lineas,
      descuentosCargos: data.descuentosCargos,
    }
    try {
      const res = await crear.mutateAsync(input)
      router.push(`/cotizaciones/${res.id}`)
    } catch (e) {
      toast({ type: 'error', message: e instanceof Error ? e.message : 'No se pudo crear la cotización' })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, () =>
        toast({ type: 'error', message: 'Revisa los campos marcados antes de guardar' }),
      )}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-semibold text-fg">Nueva cotización</h1>
        <p className="mt-1 text-sm text-fg-muted">Completa los datos para guardar la cotización como borrador.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-6">
          <Card>
            <Card.Header title="Cliente" />
            <Card.Body>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Cliente"
                  htmlFor="clienteId"
                  required
                  error={formState.errors.clienteId?.message}
                >
                  <Controller
                    control={control}
                    name="clienteId"
                    render={({ field }) => (
                      <SelectBuscador
                        opciones={(clientes?.items ?? []).map((c) => ({
                          value: c.id,
                          label: c.name,
                          searchText: `${c.name} ${c.identificationNumber}`,
                        }))}
                        value={field.value ?? ''}
                        onChange={(v) => field.onChange(v)}
                        placeholder="Seleccionar cliente"
                      />
                    )}
                  />
                </Field>

                <Field label="Válida hasta" htmlFor="validezHasta">
                  <Input
                    id="validezHasta"
                    type="date"
                    {...register('validezHasta', { setValueAs: (v) => (v ? new Date(v) : undefined) })}
                  />
                </Field>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header title="Pago" />
            <Card.Body>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Forma de pago" htmlFor="paymentFormId">
                  <Select id="paymentFormId" {...register('paymentFormId', { valueAsNumber: true })}>
                    <option value={1}>Contado</option>
                    <option value={2}>Crédito</option>
                  </Select>
                </Field>

                <Field label="Método de pago" htmlFor="paymentMethodId">
                  <Select id="paymentMethodId" {...register('paymentMethodId', { valueAsNumber: true })}>
                    {(catalogos?.metodosPago ?? []).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header title="Líneas" />
            <Card.Body>
              <LineasDocumento
                control={control}
                register={register}
                setValue={setValue}
                productos={productos?.items ?? []}
              />
            </Card.Body>
          </Card>

          <Card>
            <Card.Header title="Descuentos y cargos" />
            <Card.Body>
              <DescuentosCargosDocumento control={control} register={register} />
            </Card.Body>
          </Card>

          <Card>
            <Card.Header title="Notas" />
            <Card.Body>
              <Field label="Notas" htmlFor="notes">
                <Textarea id="notes" {...register('notes')} rows={3} />
              </Field>
            </Card.Body>
          </Card>
        </div>

        <div className="lg:sticky lg:top-6 space-y-4">
          <ResumenTotalesDocumento control={control} />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={formState.isSubmitting}
          >
            Guardar cotización
          </Button>
        </div>
      </div>
    </form>
  )
}
