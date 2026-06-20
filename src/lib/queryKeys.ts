export const queryKeys = {
  facturas: {
    all: ['facturas'] as const,
    lista: (filtros?: unknown) => ['facturas', 'lista', filtros ?? null] as const,
    detalle: (id: string) => ['facturas', 'detalle', id] as const,
  },
  cotizaciones: {
    all: ['cotizaciones'] as const,
    lista: (filtros?: unknown) => ['cotizaciones', 'lista', filtros ?? null] as const,
    detalle: (id: string) => ['cotizaciones', 'detalle', id] as const,
  },
  inventario: {
    all: ['inventario'] as const,
    stock: (bodegaId?: string, productoId?: string) =>
      ['inventario', 'stock', bodegaId ?? null, productoId ?? null] as const,
    movimientos: (filtros?: unknown) => ['inventario', 'movimientos', filtros ?? null] as const,
  },
  productos: {
    all: ['productos'] as const,
    lista: (filtros?: unknown) => ['productos', 'lista', filtros ?? null] as const,
    detalle: (id: string) => ['productos', 'detalle', id] as const,
  },
  clientes: {
    all: ['clientes'] as const,
    lista: (filtros?: unknown) => ['clientes', 'lista', filtros ?? null] as const,
    detalle: (id: string) => ['clientes', 'detalle', id] as const,
  },
  bodegas: {
    all: ['bodegas'] as const,
    lista: () => ['bodegas', 'lista'] as const,
  },
  admin: {
    usuarios: () => ['admin', 'usuarios'] as const,
    empresa: () => ['admin', 'empresa'] as const,
  },
  catalogos: {
    dian: (tabla: string) => ['catalogos', 'dian', tabla] as const,
  },
  organizacion: {
    resoluciones: () => ['organizacion', 'resoluciones'] as const,
  },
} as const
