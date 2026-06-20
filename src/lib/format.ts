export function formatCOP(n: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n)
}

export function formatNumero(n: number): string {
  return new Intl.NumberFormat('es-CO').format(n)
}

export function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
