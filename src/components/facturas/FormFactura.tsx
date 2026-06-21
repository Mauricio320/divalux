'use client'

import { Controller, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { UserCheck } from 'lucide-react'
import { crearFacturaSchema, type CrearFacturaInput, type DocumentoFormValues } from '@/lib/validations/factura'
import { useClientes } from '@/hooks/clientes/use-clientes'
import { useBodegas } from '@/hooks/bodegas/use-bodegas'
import { useProductos } from '@/hooks/productos/use-productos'
import { useCatalogos } from '@/hooks/catalogos/use-catalogos'
import { useCrearFactura } from '@/hooks/facturas/use-crear-factura'
import { useToast } from '@/hooks/ui/useToast'
import { SelectBuscador } from '@/components/ui/SelectBuscador'
import LineasDocumento from '@/components/ui/LineasDocumento'
import DescuentosCargosDocumento from '@/components/ui/DescuentosCargosDocumento'
import ResumenTotalesDocumento from '@/components/ui/ResumenTotalesDocumento'
import Card from '@/components/ui/Card'
import Field from '@/components/ui/Field'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

export default function FormFactura() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: clientes } = useClientes()
  const { data: bodegas } = useBodegas()
  const { data: productos } = useProductos()
  const { data: catalogos } = useCatalogos()
  const crear = useCrearFactura()

  const { control, register, setValue, handleSubmit, formState } = useForm<DocumentoFormValues>({
    resolver: zodResolver(crearFacturaSchema) as Resolver<DocumentoFormValues>,
    defaultValues: {
      clienteId: '',
      bodegaId: '',
      paymentFormId: 1,
      paymentMethodId: 10,
      sendmail: false,
      lineas: [{ productoId: '', cantidad: 1, precioUnitarioSinImpuesto: 0, taxId: 1, percent: 0, unitMeasureId: 70 }],
      descuentosCargos: [],
    },
  })

  async function onSubmit(data: DocumentoFormValues) {
    const input: CrearFacturaInput = {
      clienteId: data.clienteId,
      bodegaId: data.bodegaId ?? '',
      paymentFormId: data.paymentFormId,
      paymentMethodId: data.paymentMethodId,
      paymentDueDate: data.paymentDueDate,
      durationMeasure: data.durationMeasure,
      fecha: data.fecha,
      notes: data.notes,
      headNote: data.headNote,
      footNote: data.footNote,
      sendmail: data.sendmail ?? false,
      lineas: data.lineas,
      descuentosCargos: data.descuentosCargos,
    }
    try {
      const res = await crear.mutateAsync(input)
      router.push(`/facturas/${res.id}`)
    } catch (e) {
      toast({
        type: 'error',
        message: e instanceof Error ? e.message : 'No se pudo crear la factura',
      })
    }
  }

  const consumidorFinal = clientes?.items.find((c) => c.esConsumidorFinal)

  return (
    <form
      onSubmit={handleSubmit(onSubmit, () =>
        toast({ type: 'error', message: 'Revisa los campos marcados antes de guardar' }),
      )}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-semibold text-fg">Nueva factura</h1>
        <p className="mt-0.5 text-sm text-fg-muted">Completa los datos y agrega las líneas del documento</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-6">
          <Card>
            <Card.Header
              title="Cliente y bodega"
              action={
                consumidorFinal ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    leftIcon={<UserCheck size={15} aria-hidden="true" />}
                    onClick={() => setValue('clienteId', consumidorFinal.id)}
                  >
                    Consumidor final
                  </Button>
                ) : undefined
              }
            />
            <Card.Body className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

              <Field
                label="Bodega"
                htmlFor="bodegaId"
                required
                error={formState.errors.bodegaId?.message}
              >
                <Controller
                  control={control}
                  name="bodegaId"
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
            </Card.Body>
          </Card>

          <Card>
            <Card.Header title="Pago" />
            <Card.Body className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Forma de pago" htmlFor="paymentFormId">
                <Select
                  id="paymentFormId"
                  error={!!formState.errors.paymentFormId}
                  {...register('paymentFormId', { valueAsNumber: true })}
                >
                  <option value={1}>Contado</option>
                  <option value={2}>Crédito</option>
                </Select>
              </Field>

              <Field label="Método de pago" htmlFor="paymentMethodId">
                <Select
                  id="paymentMethodId"
                  error={!!formState.errors.paymentMethodId}
                  {...register('paymentMethodId', { valueAsNumber: true })}
                >
                  {(catalogos?.metodosPago ?? []).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </Select>
              </Field>
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
              <Field label="Notas internas" htmlFor="notes">
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="Observaciones opcionales del documento"
                  {...register('notes')}
                />
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
            {formState.isSubmitting ? 'Guardando…' : 'Guardar borrador'}
          </Button>
        </div>
      </div>
    </form>
  )
}
