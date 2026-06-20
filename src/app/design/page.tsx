'use client'

import { useState, useSyncExternalStore } from 'react'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import Field from '@/components/ui/Field'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Skeleton from '@/components/ui/Skeleton'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'
import { useToast } from '@/hooks/ui/useToast'

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-2xl text-fg border-b border-gold pb-2 mb-6">{children}</h2>
  )
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold uppercase tracking-wider text-fg-muted mb-3">{children}</h3>
}

const VERDE_SCALE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const
const DORADO_SCALE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const
const NEUTRO_SCALE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const

const SEMANTIC_TOKENS = [
  { name: 'bg', label: 'bg' },
  { name: 'surface', label: 'surface' },
  { name: 'surface-2', label: 'surface-2' },
  { name: 'surface-3', label: 'surface-3' },
  { name: 'border', label: 'border' },
  { name: 'border-strong', label: 'border-strong' },
  { name: 'fg', label: 'fg' },
  { name: 'fg-muted', label: 'fg-muted' },
  { name: 'fg-subtle', label: 'fg-subtle' },
  { name: 'primary', label: 'primary' },
  { name: 'primary-hover', label: 'primary-hover' },
  { name: 'accent', label: 'accent' },
  { name: 'gold', label: 'gold' },
  { name: 'gold-strong', label: 'gold-strong' },
  { name: 'danger', label: 'danger' },
  { name: 'danger-hover', label: 'danger-hover' },
  { name: 'success', label: 'success' },
  { name: 'warning', label: 'warning' },
  { name: 'info', label: 'info' },
]

function PaletteSection() {
  return (
    <section>
      <SectionTitle>Paleta</SectionTitle>
      <SubTitle>Verde (forest/oliva)</SubTitle>
      <div className="flex flex-wrap gap-2 mb-6">
        {VERDE_SCALE.map((step) => (
          <div key={step} className="flex flex-col items-center gap-1">
            <div
              className={`w-12 h-12 rounded-lg border border-border`}
              style={{ backgroundColor: `var(--color-verde-${step})` }}
            />
            <span className="text-xs text-fg-muted">{step}</span>
          </div>
        ))}
      </div>
      <SubTitle>Dorado (premium)</SubTitle>
      <div className="flex flex-wrap gap-2 mb-6">
        {DORADO_SCALE.map((step) => (
          <div key={step} className="flex flex-col items-center gap-1">
            <div
              className={`w-12 h-12 rounded-lg border border-border`}
              style={{ backgroundColor: `var(--color-dorado-${step})` }}
            />
            <span className="text-xs text-fg-muted">{step}</span>
          </div>
        ))}
      </div>
      <SubTitle>Neutro (cálido)</SubTitle>
      <div className="flex flex-wrap gap-2 mb-6">
        {NEUTRO_SCALE.map((step) => (
          <div key={step} className="flex flex-col items-center gap-1">
            <div
              className={`w-12 h-12 rounded-lg border border-border`}
              style={{ backgroundColor: `var(--color-neutro-${step})` }}
            />
            <span className="text-xs text-fg-muted">{step}</span>
          </div>
        ))}
      </div>
      <SubTitle>Tokens semánticos</SubTitle>
      <div className="flex flex-wrap gap-2">
        {SEMANTIC_TOKENS.map(({ name, label }) => (
          <div key={name} className="flex flex-col items-center gap-1">
            <div
              className="w-14 h-10 rounded-lg border border-border-strong"
              style={{ backgroundColor: `var(--${name})` }}
            />
            <span className="text-xs text-fg-muted whitespace-nowrap">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function TypographySection() {
  return (
    <section>
      <SectionTitle>Tipografía</SectionTitle>
      <div className="space-y-6">
        <div>
          <SubTitle>Sans — Plus Jakarta Sans</SubTitle>
          <div className="space-y-2">
            <p className="font-sans text-4xl font-bold text-fg">Sistema de Facturación</p>
            <p className="font-sans text-2xl font-semibold text-fg">Inventario Multi-bodega</p>
            <p className="font-sans text-xl text-fg">Gestión de clientes y productos</p>
            <p className="font-sans text-base text-fg">Texto de cuerpo estándar para UI funcional</p>
            <p className="font-sans text-sm text-fg-muted">Texto secundario y etiquetas de campo</p>
            <p className="font-sans text-xs text-fg-subtle">Texto auxiliar, hints y metadatos</p>
          </div>
        </div>
        <div>
          <SubTitle>Serif — Fraunces (marca)</SubTitle>
          <div className="space-y-2">
            <p className="font-serif text-5xl font-bold text-fg">Divailux</p>
            <p className="font-serif text-3xl text-fg">Poder Natural</p>
            <p className="font-serif text-xl text-fg-muted italic">Facturación electrónica DIAN</p>
          </div>
        </div>
        <div>
          <SubTitle>Mono — JetBrains Mono</SubTitle>
          <p className="font-mono text-sm text-fg bg-surface-2 px-3 py-2 rounded-lg">
            CUFE: abc123def456...  |  NIT: 900.123.456-7
          </p>
        </div>
      </div>
    </section>
  )
}

function ButtonSection() {
  return (
    <section>
      <SectionTitle>Botones</SectionTitle>
      <div className="space-y-6">
        {(['primary', 'secondary', 'ghost', 'danger'] as const).map((variant) => (
          <div key={variant}>
            <SubTitle>{variant}</SubTitle>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant={variant} size="sm">Pequeño</Button>
              <Button variant={variant} size="md">Mediano</Button>
              <Button variant={variant} size="lg">Grande</Button>
              <Button variant={variant} size="md" disabled>Deshabilitado</Button>
              <Button variant={variant} size="md" isLoading>Cargando</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function FormSection() {
  return (
    <section>
      <SectionTitle>Inputs</SectionTitle>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 max-w-2xl">
        <Field label="Campo normal" htmlFor="f1">
          <Input id="f1" placeholder="Escribe algo..." />
        </Field>
        <Field label="Con hint" htmlFor="f2" hint="Este campo es opcional">
          <Input id="f2" placeholder="Opcional..." />
        </Field>
        <Field label="Con error" htmlFor="f3" error="Este campo es obligatorio" required>
          <Input id="f3" error placeholder="Requerido..." />
        </Field>
        <Field label="Deshabilitado" htmlFor="f4">
          <Input id="f4" disabled value="Valor fijo" readOnly />
        </Field>
        <Field label="Textarea" htmlFor="f5" hint="Máximo 500 caracteres">
          <Textarea id="f5" placeholder="Escribe una observación..." rows={3} />
        </Field>
        <Field label="Select" htmlFor="f6">
          <Select id="f6">
            <option value="">-- Selecciona --</option>
            <option value="admin">Administrador</option>
            <option value="vendedor">Vendedor</option>
          </Select>
        </Field>
        <Field label="Select con error" htmlFor="f7" error="Selecciona una opción válida">
          <Select id="f7" error>
            <option value="">-- Selecciona --</option>
          </Select>
        </Field>
      </div>
    </section>
  )
}

function CardSection() {
  return (
    <section>
      <SectionTitle>Card</SectionTitle>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 max-w-2xl">
        <Card>
          <Card.Header title="Factura #001" subtitle="Cliente: Empresa Demo S.A.S" />
          <Card.Body>
            <p className="text-sm text-fg-muted">
              Contenido del cuerpo de la tarjeta. Puede incluir cualquier elemento.
            </p>
          </Card.Body>
          <Card.Footer>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm">Cancelar</Button>
              <Button size="sm">Guardar</Button>
            </div>
          </Card.Footer>
        </Card>
        <Card padding>
          <p className="text-sm font-semibold text-fg mb-1">Card con padding directo</p>
          <p className="text-sm text-fg-muted">Sin subcomponentes Header/Body/Footer.</p>
        </Card>
        <Card>
          <Card.Header
            title="Con acción"
            subtitle="Línea de subtítulo"
            action={<Button size="sm">Nueva factura</Button>}
          />
          <Card.Body>
            <Badge variant="success">Confirmada</Badge>
          </Card.Body>
        </Card>
      </div>
    </section>
  )
}

function TableSection() {
  const rows = [
    { id: '001', cliente: 'Empresa ABC S.A.S', total: '$ 1.250.000', estado: 'CONFIRMADA' },
    { id: '002', cliente: 'Comercial XYZ Ltda.', total: '$ 890.500', estado: 'BORRADOR' },
    { id: '003', cliente: 'Distribuciones Sur', total: '$ 3.100.000', estado: 'ANULADA' },
  ]

  const badgeVariant = (estado: string) => {
    if (estado === 'CONFIRMADA') return 'success' as const
    if (estado === 'ANULADA') return 'danger' as const
    return 'neutral' as const
  }

  return (
    <section>
      <SectionTitle>Tabla</SectionTitle>
      <Table>
        <Table.Head>
          <tr>
            <Table.HeaderCell>Factura</Table.HeaderCell>
            <Table.HeaderCell>Cliente</Table.HeaderCell>
            <Table.HeaderCell align="right">Total</Table.HeaderCell>
            <Table.HeaderCell align="center">Estado</Table.HeaderCell>
          </tr>
        </Table.Head>
        <Table.Body>
          {rows.map((row, i) => (
            <Table.Row key={row.id} zebra zebraOdd={i % 2 !== 0}>
              <Table.Cell>
                <span className="font-mono text-xs text-fg-muted">FV-{row.id}</span>
              </Table.Cell>
              <Table.Cell>{row.cliente}</Table.Cell>
              <Table.Cell align="right">
                <span className="font-medium text-fg">{row.total}</span>
              </Table.Cell>
              <Table.Cell align="center">
                <Badge variant={badgeVariant(row.estado)} size="sm">{row.estado}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
          <Skeleton.Row cols={4} />
        </Table.Body>
      </Table>
      <div className="mt-6">
        <EmptyState
          title="No hay facturas"
          description="Crea tu primera factura para comenzar."
          action={<Button size="sm">Nueva factura</Button>}
        />
      </div>
    </section>
  )
}

function BadgeSection() {
  const variants = ['neutral', 'success', 'danger', 'info', 'warning', 'gold'] as const

  return (
    <section>
      <SectionTitle>Badges</SectionTitle>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {variants.map((v) => (
            <div key={v} className="flex flex-col items-center gap-1">
              <Badge variant={v} size="md">{v}</Badge>
              <Badge variant={v} size="sm">{v} sm</Badge>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Confirmada</Badge>
          <Badge variant="danger">Anulada</Badge>
          <Badge variant="neutral">Borrador</Badge>
          <Badge variant="warning">Pendiente</Badge>
          <Badge variant="gold">Premium</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>
    </section>
  )
}

function SpinnerSection() {
  return (
    <section>
      <SectionTitle>Spinner</SectionTitle>
      <div className="flex items-end gap-6">
        <div className="flex flex-col items-center gap-2">
          <Spinner size="sm" />
          <span className="text-xs text-fg-muted">sm</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner size="md" />
          <span className="text-xs text-fg-muted">md</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner size="lg" />
          <span className="text-xs text-fg-muted">lg</span>
        </div>
      </div>
    </section>
  )
}

function ModalSection() {
  const [open, setOpen] = useState(false)

  return (
    <section>
      <SectionTitle>Modal</SectionTitle>
      <Button onClick={() => setOpen(true)}>Abrir modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirmar acción"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              Confirmar
            </Button>
          </>
        }
      >
        <p className="text-sm text-fg-muted">
          Esta es una ventana modal con título, cuerpo y pie de página. Presiona Escape o el botón
          de cerrar para cerrarla.
        </p>
      </Modal>
    </section>
  )
}

function ToastSection() {
  const { toast } = useToast()

  return (
    <section>
      <SectionTitle>Toasts</SectionTitle>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          onClick={() => toast({ type: 'success', message: 'Factura guardada correctamente.' })}
        >
          Toast éxito
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast({ type: 'error', message: 'Error al conectar con el servidor.' })}
        >
          Toast error
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast({ type: 'info', message: 'Recuerda completar la resolución DIAN.' })}
        >
          Toast info
        </Button>
      </div>
    </section>
  )
}

function LogoSection() {
  return (
    <section>
      <SectionTitle>Logo</SectionTitle>
      <div className="flex flex-wrap items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Logo variant="mark" width={40} height={40} />
          <span className="text-xs text-fg-muted">mark 40px</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Logo variant="mark" width={64} height={64} />
          <span className="text-xs text-fg-muted">mark 64px</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Logo variant="full" width={160} priority />
          <span className="text-xs text-fg-muted">full</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-verde-800 p-4 rounded-xl">
          <Logo variant="full-white" width={160} priority />
          <span className="text-xs text-neutro-300">full-white (dark)</span>
        </div>
        <div className="flex items-center gap-3">
          <Logo variant="mark" width={32} height={32} />
          <span className="font-serif text-2xl font-bold text-fg">Divailux</span>
        </div>
      </div>
    </section>
  )
}

function useThemeIsDark() {
  return useSyncExternalStore(
    (onChange) => {
      const observer = new MutationObserver(onChange)
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
      return () => observer.disconnect()
    },
    () => document.documentElement.classList.contains('dark'),
    () => false,
  )
}

export default function DesignPage() {
  const dark = useThemeIsDark()

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('tema', next ? 'dark' : 'light')
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="sticky top-0 z-40 bg-surface border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo variant="mark" width={28} height={28} />
          <span className="font-serif text-xl font-bold text-fg">Divailux</span>
          <Badge variant="gold" size="sm">Design System</Badge>
        </div>
        <Button variant="secondary" size="sm" onClick={toggleTheme}>
          {dark ? 'Claro' : 'Oscuro'}
        </Button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        <header>
          <p className="font-serif text-4xl font-bold text-fg mb-2">Divailux</p>
          <p className="text-lg text-fg-muted">Revisión visual del design system — Fase 1</p>
        </header>

        <LogoSection />
        <PaletteSection />
        <TypographySection />
        <ButtonSection />
        <SpinnerSection />
        <FormSection />
        <CardSection />
        <TableSection />
        <BadgeSection />
        <ModalSection />
        <ToastSection />
      </div>
    </div>
  )
}
