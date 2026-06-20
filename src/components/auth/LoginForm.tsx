'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type FormData = { email: string; password: string }

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState } = useForm<FormData>()

  async function onSubmit(data: FormData) {
    setError('')
    const res = await signIn('credentials', { ...data, redirect: false })
    if (res?.error) {
      setError('Correo o contraseña inválidos')
      return
    }
    router.push('/')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Iniciar sesión</h1>
        <p className="text-sm text-gray-500">Divalus Facturas</p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Correo</label>
        <input
          type="email"
          autoComplete="email"
          {...register('email', { required: true })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Contraseña</label>
        <input
          type="password"
          autoComplete="current-password"
          {...register('password', { required: true })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={formState.isSubmitting}
        className="w-full rounded-md bg-gray-900 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {formState.isSubmitting ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  )
}
