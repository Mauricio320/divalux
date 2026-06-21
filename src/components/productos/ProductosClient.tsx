'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { useProductos } from '@/hooks/productos/use-productos'
import { formatCOP } from '@/lib/format'
import type { ProductoDTO } from '@/actions/productos'
import Button from '@/components/ui/Button'
import Table from '@/components/ui/Table'
import Skeleton from '@/components/ui/Skeleton'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'
import ProductoForm from '@/components/productos/ProductoForm'

export default function ProductosClient() {
  const { data: productos, isLoading } = useProductos()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<ProductoDTO | null>(null)

  function abrirCrear() {
    setEditando(null)
    setModalAbierto(true)
  }

  function abrirEditar(p: ProductoDTO) {
    setEditando(p)
    setModalAbierto(true)
  }

  function cerrar() {
    setModalAbierto(false)
    setEditando(null)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-fg">Productos</h1>
        <Button onClick={abrirCrear} leftIcon={<Plus size={16} />}>
          Nuevo producto
        </Button>
      </div>

      <Table>
        <Table.Head>
          <tr>
            <Table.HeaderCell>Imagen</Table.HeaderCell>
            <Table.HeaderCell>Código</Table.HeaderCell>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
            <Table.HeaderCell align="right">Precio</Table.HeaderCell>
            <Table.HeaderCell align="right">IVA</Table.HeaderCell>
            <Table.HeaderCell align="right">Acciones</Table.HeaderCell>
          </tr>
        </Table.Head>
        <Table.Body>
          {isLoading && (
            <>
              <Skeleton.Row cols={6} />
              <Skeleton.Row cols={6} />
              <Skeleton.Row cols={6} />
              <Skeleton.Row cols={6} />
              <Skeleton.Row cols={6} />
            </>
          )}
          {!isLoading && productos?.items.length === 0 && (
            <tr>
              <td colSpan={6}>
                <EmptyState
                  title="Sin productos"
                  description="Crea tu primer producto para empezar a facturar."
                  action={
                    <Button onClick={abrirCrear} size="sm" leftIcon={<Plus size={14} />}>
                      Nuevo producto
                    </Button>
                  }
                />
              </td>
            </tr>
          )}
          {!isLoading && productos?.items.map((p) => (
            <Table.Row key={p.id} hover>
              <Table.Cell>
                <div className="relative h-10 w-10 overflow-hidden rounded-md border border-border bg-surface-2">
                  {p.imagenUrl && (
                    <Image src={p.imagenUrl} alt={p.nombre} fill sizes="40px" className="object-cover" />
                  )}
                </div>
              </Table.Cell>
              <Table.Cell>{p.code}</Table.Cell>
              <Table.Cell>{p.nombre}</Table.Cell>
              <Table.Cell align="right">{formatCOP(p.precioSinImpuesto)}</Table.Cell>
              <Table.Cell align="right">{p.percent}%</Table.Cell>
              <Table.Cell align="right">
                <Button variant="ghost" size="sm" onClick={() => abrirEditar(p)}>
                  Editar
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Modal
        open={modalAbierto}
        onClose={cerrar}
        title={editando ? 'Editar producto' : 'Nuevo producto'}
        size="lg"
      >
        {modalAbierto && <ProductoForm producto={editando} onDone={cerrar} />}
      </Modal>
    </div>
  )
}
