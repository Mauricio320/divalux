'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEmpresa } from '@/hooks/admin/use-empresa'
import { useUsuarios } from '@/hooks/admin/use-usuarios'
import { useCrearUsuario } from '@/hooks/admin/use-crear-usuario'
import { crearUsuarioSchema, type CrearUsuarioInput } from '@/lib/validations/usuario'

const campo = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm'

export default function AdminClient() {
  const { data: empresa } = useEmpresa()
  const { data: usuarios } = useUsuarios()
  const crear = useCrearUsuario()
  const { register, handleSubmit, reset, formState } = useForm<CrearUsuarioInput>({
    resolver: zodResolver(crearUsuarioSchema),
    defaultValues: { role: 'VENDEDOR' },
  })

  async function onSubmit(data: CrearUsuarioInput) {
    await crear.mutateAsync(data)
    reset({ nombre: '', email: '', password: '', role: 'VENDEDOR' })
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Administración</h1>

      {empresa && (
        <div className="mb-6 rounded-lg border border-gray-200 p-4 text-sm">
          <p className="font-semibold text-gray-900">{empresa.nombre}</p>
          <p className="text-gray-600">{empresa.razonSocial}</p>
          <p className="text-gray-600">NIT: {empresa.nit}-{empresa.dv}</p>
        </div>
      )}

      <h2 className="mb-2 text-sm font-semibold text-gray-700">Usuarios</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 grid grid-cols-2 gap-3 rounded-lg border border-gray-200 p-4 md:grid-cols-4">
        <input {...register('nombre')} placeholder="Nombre" className={campo} />
        <input type="email" {...register('email')} placeholder="Correo" className={campo} />
        <input type="password" {...register('password')} placeholder="Contraseña" className={campo} />
        <select {...register('role')} className={campo}>
          <option value="VENDEDOR">Vendedor</option>
          <option value="ADMIN">Administrador</option>
        </select>
        {formState.errors.password && <p className="col-span-full text-xs text-red-600">{formState.errors.password.message}</p>}
        <div className="md:col-span-4">
          <button type="submit" disabled={formState.isSubmitting} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            Crear usuario
          </button>
        </div>
      </form>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="py-2">Nombre</th>
            <th className="py-2">Correo</th>
            <th className="py-2">Rol</th>
            <th className="py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios?.map((u) => (
            <tr key={u.id} className="border-b border-gray-100">
              <td className="py-2">{u.nombre}</td>
              <td className="py-2">{u.email}</td>
              <td className="py-2">{u.role}</td>
              <td className="py-2">{u.activo ? 'Activo' : 'Inactivo'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
