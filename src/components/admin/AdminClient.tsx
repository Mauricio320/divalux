'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { useEmpresa } from '@/hooks/admin/use-empresa'
import { useUsuarios } from '@/hooks/admin/use-usuarios'
import { useCrearUsuario } from '@/hooks/admin/use-crear-usuario'
import { crearUsuarioSchema, type CrearUsuarioInput } from '@/lib/validations/usuario'
import { useToast } from '@/hooks/ui/useToast'
import { estadoBadgeVariant } from '@/lib/estados'
import Card from '@/components/ui/Card'
import Field from '@/components/ui/Field'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'

export default function AdminClient() {
  const { data: empresa } = useEmpresa()
  const { data: usuarios, isLoading: loadingUsuarios } = useUsuarios()
  const crear = useCrearUsuario()
  const { toast } = useToast()
  const { register, handleSubmit, reset, formState } = useForm<CrearUsuarioInput>({
    resolver: zodResolver(crearUsuarioSchema),
    defaultValues: { role: 'VENDEDOR' },
  })

  async function onSubmit(data: CrearUsuarioInput) {
    try {
      await crear.mutateAsync(data)
      reset({ nombre: '', email: '', password: '', role: 'VENDEDOR' })
      toast({ type: 'success', message: 'Usuario creado correctamente' })
    } catch (err) {
      toast({ type: 'error', message: err instanceof Error ? err.message : 'Error al crear usuario' })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-fg">Administración</h1>

      {empresa && (
        <Card>
          <Card.Body>
            <p className="text-base font-semibold text-fg">{empresa.nombre}</p>
            <p className="text-sm text-fg-muted">{empresa.razonSocial}</p>
            <p className="text-sm text-fg-muted">NIT: {empresa.nit}-{empresa.dv}</p>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Header title="Usuarios" subtitle="Gestión de accesos al sistema" />
        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Nombre" htmlFor="nombre" required error={formState.errors.nombre?.message}>
              <Input
                id="nombre"
                {...register('nombre')}
                placeholder="Nombre completo"
                error={!!formState.errors.nombre}
              />
            </Field>
            <Field label="Correo" htmlFor="email" required error={formState.errors.email?.message}>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="correo@empresa.com"
                error={!!formState.errors.email}
              />
            </Field>
            <Field label="Contraseña" htmlFor="password" required error={formState.errors.password?.message}>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Contraseña"
                error={!!formState.errors.password}
              />
            </Field>
            <Field label="Rol" htmlFor="role" required>
              <Select id="role" {...register('role')}>
                <option value="VENDEDOR">Vendedor</option>
                <option value="ADMIN">Administrador</option>
              </Select>
            </Field>
            <div className="sm:col-span-2 lg:col-span-4">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={formState.isSubmitting}
                leftIcon={<UserPlus size={16} />}
              >
                Crear usuario
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      <Table>
        <Table.Head>
          <tr>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
            <Table.HeaderCell>Correo</Table.HeaderCell>
            <Table.HeaderCell>Rol</Table.HeaderCell>
            <Table.HeaderCell>Estado</Table.HeaderCell>
          </tr>
        </Table.Head>
        <Table.Body>
          {loadingUsuarios && (
            <>
              <Skeleton.Row cols={4} />
              <Skeleton.Row cols={4} />
              <Skeleton.Row cols={4} />
              <Skeleton.Row cols={4} />
            </>
          )}
          {!loadingUsuarios && usuarios?.map((u) => (
            <Table.Row key={u.id} zebra>
              <Table.Cell>{u.nombre}</Table.Cell>
              <Table.Cell>{u.email}</Table.Cell>
              <Table.Cell>{u.role}</Table.Cell>
              <Table.Cell>
                <Badge variant={estadoBadgeVariant(u.activo ? 'APROBADA' : 'ANULADA')} size="sm">
                  {u.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {!loadingUsuarios && (!usuarios || usuarios.length === 0) && (
        <EmptyState
          title="Sin usuarios registrados"
          description="Crea el primer usuario usando el formulario anterior."
        />
      )}
    </div>
  )
}
