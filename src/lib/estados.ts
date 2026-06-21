export type EstadoVariant = 'neutral' | 'success' | 'danger' | 'info' | 'warning' | 'gold'

const MAP: Record<string, EstadoVariant> = {
  BORRADOR: 'neutral',
  CONFIRMADA: 'success',
  APROBADA: 'success',
  ENVIADA: 'info',
  EMITIDA: 'info',
  ANULADA: 'danger',
  RECHAZADA: 'danger',
  VENCIDA: 'warning',
}

export function estadoBadgeVariant(estado: string): EstadoVariant {
  return MAP[estado] ?? 'neutral'
}
