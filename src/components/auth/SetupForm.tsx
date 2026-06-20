'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { setupSchema, type SetupInput } from '@/lib/validations/setup'
import { useCrearSetup } from '@/hooks/setup/use-crear-setup'

const campo = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm'
const etiqueta = 'mb-1 block text-sm font-medium text-gray-700'

export default function SetupForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const crear = useCrearSetup()
  const { register, handleSubmit, formState } = useForm<SetupInput>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      typeRegimeId: 1,
      typeOrganizationId: 1,
      softwareName: 'Divalus Facturas',
      municipalityId: 439,
      dv: 0,
    },
  })

  async function onSubmit(data: SetupInput) {
    setError('')
    try {
      await crear.mutateAsync(data)
      await signIn('credentials', { email: data.adminEmail, password: data.adminPassword, redirect: false })
      router.push('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo configurar')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Configuración inicial</h1>
        <p className="text-sm text-gray-500">Crea tu empresa y el usuario administrador</p>
      </div>

      <p className="text-sm font-semibold text-gray-700">Empresa</p>
      <div>
        <label className={etiqueta}>Nombre comercial</label>
        <input {...register('empresaNombre')} className={campo} />
        {formState.errors.empresaNombre && <p className="text-xs text-red-600">{formState.errors.empresaNombre.message}</p>}
      </div>
      <div>
        <label className={etiqueta}>Razón social</label>
        <input {...register('razonSocial')} className={campo} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <label className={etiqueta}>NIT</label>
          <input {...register('nit')} className={campo} />
        </div>
        <div>
          <label className={etiqueta}>DV</label>
          <input type="number" {...register('dv', { valueAsNumber: true })} className={campo} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={etiqueta}>Régimen</label>
          <select {...register('typeRegimeId', { valueAsNumber: true })} className={campo}>
            <option value={1}>Responsable de IVA</option>
            <option value={2}>No Responsable de IVA</option>
          </select>
        </div>
        <div>
          <label className={etiqueta}>Organización</label>
          <select {...register('typeOrganizationId', { valueAsNumber: true })} className={campo}>
            <option value={1}>Persona Jurídica</option>
            <option value={2}>Persona Natural</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={etiqueta}>Código municipio DIAN</label>
          <input type="number" {...register('municipalityId', { valueAsNumber: true })} className={campo} />
        </div>
        <div>
          <label className={etiqueta}>Software</label>
          <input {...register('softwareName')} className={campo} />
        </div>
      </div>

      <p className="text-sm font-semibold text-gray-700">Administrador</p>
      <div>
        <label className={etiqueta}>Nombre</label>
        <input {...register('adminNombre')} className={campo} />
      </div>
      <div>
        <label className={etiqueta}>Correo</label>
        <input type="email" {...register('adminEmail')} className={campo} />
        {formState.errors.adminEmail && <p className="text-xs text-red-600">{formState.errors.adminEmail.message}</p>}
      </div>
      <div>
        <label className={etiqueta}>Contraseña</label>
        <input type="password" {...register('adminPassword')} className={campo} />
        {formState.errors.adminPassword && <p className="text-xs text-red-600">{formState.errors.adminPassword.message}</p>}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={formState.isSubmitting}
        className="w-full rounded-md bg-gray-900 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {formState.isSubmitting ? 'Creando…' : 'Crear empresa y administrador'}
      </button>
    </form>
  )
}
