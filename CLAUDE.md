# Divalus Facturas — Facturación electrónica e inventario multi-empresa

Sistema multi-empresa (multi-tenant) de **facturación electrónica DIAN (Colombia)** e **inventario multi-bodega**.
ADMIN gestiona empresa, usuarios, productos, bodegas, inventario y config del emisor; VENDEDOR crea/consulta facturas y consulta stock. Al **confirmar** una factura se descuenta el inventario de la bodega elegida.

## Stack

Next.js 16 (App Router + Server Actions) · React 19 · Tailwind v4 · TypeScript 5 strict · Prisma 7 + PostgreSQL (Neon) · NextAuth v5 (credentials) · TanStack Query v5 · react-hook-form + Zod v4 · pnpm.

### Notas críticas del stack real (no obvias — respetar)

- Middleware vive en `src/proxy.ts`, NO en `middleware.ts`.
- Prisma 7: cliente desde `@/generated/prisma/client`, NO `@prisma/client`. Generado en `src/generated/prisma` (gitignored).
- `params` en páginas es `Promise<{ ... }>` → siempre `await params`.
- Prisma singleton en `src/lib/prisma.ts` exporta `prisma` (named), adapter Neon.
- `pnpm-workspace.yaml` lleva `allowBuilds`/`onlyBuiltDependencies` (pnpm 11 exige aprobar build scripts: sharp, prisma, @prisma/engines, esbuild, unrs-resolver).
- Tailwind v4: tokens y tema en `globals.css` con `@import "tailwindcss"` y `@theme`. SIN `tailwind.config.js`.

## Convenciones de estructura (dónde va cada cosa)

- Server Actions: `src/actions/<dominio>.ts` (facturas, inventario, productos, clientes, bodegas, catalogos, admin, setup).
- Hooks: `src/hooks/<dominio>/`, uno por archivo, TanStack Query, solo en Client Components.
- Componentes UI genéricos en `src/components/ui/`; por dominio en `src/components/<dominio>/`.
- `src/lib/`: `prisma.ts` (solo servidor), `auth*.ts`, `tenant.ts` (`requireOrg`/`getSessionContext`), `queryKeys.ts`, `unwrapResult.ts`, `totales.ts` (cálculo DIAN puro), `nextpyme/` (mapper sin I/O), `inventario/` (helpers stock), `dian/dv.ts`, `validations/` (Zod).
- Rutas: `(auth)/` públicas (login, setup) · `(dashboard)/` protegidas con layout.

## Roles

- `ADMIN`: gestiona todo (empresa, usuarios, productos, bodegas, inventario, config emisor). Ve y hace todo.
- `VENDEDOR`: crea/consulta facturas y consulta stock. Sin administración ni mutaciones de inventario.

## Flujo de la factura

`BORRADOR → CONFIRMADA → ANULADA`

- `BORRADOR`: no consume consecutivo ni toca stock.
- `CONFIRMADA`: asigna consecutivo (desde `ResolucionDian`), congela `payloadNextpyme`, descuenta stock de la bodega (movimiento VENTA).
- `ANULADA`: revierte el inventario (movimiento REVERSA). Solo ADMIN.
- `EMITIDA`/`RECHAZADA`: reservados para **fase 2** (emisión real DIAN vía Nextpyme).

## Regla DIAN/Nextpyme — "MODELO LISTO, EMISIÓN DESPUÉS"

v1 captura toda la data, calcula totales conforme al spec de Nextpyme y arma el mapper tipado al JSON (`src/lib/nextpyme/`), pero **NO** llama la API. El modelo cumple el spec para que la fase 2 sea solo conectar la emisión (POST `/invoice`, guardar `cufe/uuid_dian`, `urlinvoice pdf/xml/attached`, `IsValid`, `StatusCode`, `StatusMessage`, `certificate_days_left`, `resolution_days_left`).

---

## Reglas duras — non-negotiable

### Multi-tenant (regla clave)

- TODA entidad de negocio lleva `organizacionId`.
- TODA Server Action verifica con `requireOrg(roles?)` de `@/lib/tenant` y filtra/crea SIEMPRE con `ctx.organizacionId`.
- Nunca confiar en `organizacionId` del cliente. Validar pertenencia de cada id recibido (clienteId, bodegaId, productoId) al tenant.

### Seguridad

- Toda Server Action: `Zod.safeParse → requireOrg(roles) → Prisma → { success, data } | { success, error }`. En ese orden.
- `src/proxy.ts` verifica auth y rol por prefijo de ruta. El guard fino (p.ej. lectura vs escritura de inventario) vive en las actions.
- Nunca exponer mensajes internos de Prisma ni stack traces. `error` siempre en español.

### Prisma / Base de datos

- `lib/prisma.ts` es el único lugar donde se instancia `PrismaClient` (singleton). Nunca `new PrismaClient()` en otro archivo.
- Importar `lib/prisma.ts` SOLO en Server Components, Server Actions y route handlers. NUNCA en `'use client'` ni en hooks.
- Tipos desde `@/generated/prisma/client`. Cero `any`, `as never`, `as unknown as`.
- Montos `Decimal(18,2)`; cantidades `Decimal(18,3)`; `percent` `Decimal(5,2)`. `Prisma.Decimal` nunca cruza a `'use client'`: serializar a `string` (`.toFixed(2)`) en los DTO.
- El pooler de Neon no sostiene `FOR UPDATE` crudo → usar `decrement`+check o `Serializable`+retry.

### React / Next.js

- Server Component por defecto. `'use client'` solo con interactividad real. Máx. ~200 líneas por componente.
- Lecturas: Server Component hace `requireOrg` + prefetch (`getQueryClient`) + `HydrationBoundary`; el Client consume `useQuery` con mismo key/queryFn. Nunca `fetch()` crudo.
- Mutaciones: `useMutation` + `invalidateQueries`. Nunca `router.refresh()` para datos.
- Prohibido llamar Server Actions desde componentes: solo desde hooks en `src/hooks/<dominio>/`.
- Query keys en `src/lib/queryKeys.ts`. `unwrap()/unwrapVoid()` de `src/lib/unwrapResult.ts`.
- Formularios: react-hook-form + Zod (mismo schema en action y `zodResolver`). Nunca `useState` para campos.

### Estilo de código

- Cero comentarios (excepción: WHY no obvio). Cero `console.log/warn/info`.
- Todo texto visible al usuario en **español**.
- Named exports para utilidades, hooks y actions. Default export para componentes React.

---

## Divailux Design System (REGLA OBLIGATORIA de UI)

App SaaS de uso diario: limpia y sobria, marca como acento, NO landing page.

### Colores — SOLO vía tokens `@theme` en `globals.css`, NUNCA hex hardcodeado en JSX

- Verde primario: `#3d5a26 → #4a6b2e` (forest/oliva, principal)
- Verde hoja: `#5a8a3a` (hover / estado activo)
- Dorado premium: `#c9a24f → #b8923f` (acentos, totales, líneas finas)
- Neutro fondo: `#faf8f3` (off-white cálido, NUNCA blanco puro)
- Texto: `#2a2a24`
- Dark base: `#14180f` (verde-casi-negro, NUNCA negro puro)
- Escalas 50–900 para verde, dorado y neutros. Hex suelto en JSX = rechazar.

### Tipografía

- UI: sans moderna legible. PROHIBIDO Inter, Roboto, Arial, Space Grotesk.
- Serif/display elegante SOLO para títulos de marca. Nunca script en UI funcional.

### Logos (assets en `/public` — usar, NUNCA redibujar ni inventar)

- Sidebar expandido: `/brand/divailux-mark.svg` + texto "Divailux" en HTML con la serif de marca.
- Sidebar colapsado / avatar / spinner: `/brand/divailux-mark.svg`.
- EmptyState: `/brand/divailux-mark.svg` como watermark sutil, baja opacidad.
- Login / splash / PDF de factura / emails: `/brand/divailux-full.svg`.
- Dark mode / fondos oscuros: `/brand/divailux-full-white.svg`.
- Favicon `/favicon.ico` · PWA `/icon-192.png` `/icon-512.png` `/icon-maskable.png` `/apple-touch-icon.png`.
- Nunca estirar el logo: respetar proporción y aire.

### Componentes

- Reutilizar siempre los componentes base (Button, Input, Select, Card, Table, Modal, Toast, EmptyState, Skeleton). NO crear variantes ad-hoc por pantalla.

### Motion (Framer Motion) — sobrio

- Transiciones de página suaves, micro-interacciones en botones/inputs, skeletons al cargar tablas.
- "Organic morphing" (blobs/hojas) SOLO en login/splash, nunca en pantallas internas.
- OBLIGATORIO: `prefers-reduced-motion` con fallback estático.

### Accesibilidad

- Contraste AA mínimo, foco visible (anillo verde), labels correctos, navegable por teclado.

---

## Documentación — consultar Context7 MCP SIEMPRE antes de usar APIs de:

Next.js 16 (App Router, Server Actions, middleware) · Prisma 7 (queries con `include`/`select`, transacciones, `upsert`, `isolationLevel`/concurrencia, driver adapters, `@/generated/prisma`) · NextAuth v5 / Auth.js · TanStack Query v5 · Zod v4.

## Notas de entorno

- El token de emisión Nextpyme es POR EMPRESA: vive en `Organizacion.nextpymeToken` (BD), NUNCA en `.env`.
- Variables base: `DATABASE_URL` (Neon pooled), `AUTH_SECRET` (≥32 chars), `AUTH_URL`, `NEXTPYME_BASE_URL` (fase 2). Ver `.env.example`.
- Scripts no obvios: `pnpm db:seed` puebla catálogos DIAN + demo. El resto, ver `package.json`.
