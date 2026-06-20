import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const tiposDocIdent = [
  { id: 1, nombre: 'Registro Civil' },
  { id: 2, nombre: 'Tarjeta de Identidad' },
  { id: 3, nombre: 'Cédula de Ciudadanía' },
  { id: 4, nombre: 'Tarjeta de Extranjería' },
  { id: 5, nombre: 'Cédula de Extranjería' },
  { id: 6, nombre: 'NIT' },
  { id: 7, nombre: 'Pasaporte' },
  { id: 11, nombre: 'NUIP' },
]

const tiposOrganizacion = [
  { id: 1, nombre: 'Persona Jurídica' },
  { id: 2, nombre: 'Persona Natural' },
]

const tiposRegimen = [
  { id: 1, nombre: 'Responsable de IVA' },
  { id: 2, nombre: 'No Responsable de IVA' },
]

const tiposResponsabilidad = [
  { id: 7, nombre: 'Gran contribuyente' },
  { id: 9, nombre: 'Autorretenedor' },
  { id: 14, nombre: 'Agente de retención IVA' },
  { id: 112, nombre: 'Régimen Simple de Tributación' },
  { id: 117, nombre: 'No responsable' },
]

const formasPago = [
  { id: 1, nombre: 'Contado' },
  { id: 2, nombre: 'Crédito' },
]

const metodosPago = [
  { id: 10, nombre: 'Efectivo' },
  { id: 30, nombre: 'Transferencia débito bancaria' },
  { id: 42, nombre: 'Consignación bancaria' },
  { id: 47, nombre: 'Transferencia crédito bancaria' },
  { id: 71, nombre: 'Instrumento no definido' },
  { id: 75, nombre: 'Tarjeta de crédito' },
]

const unidadesMedida = [
  { id: 70, nombre: 'Unidad' },
  { id: 94, nombre: 'Kilogramo' },
  { id: 1, nombre: 'Metro' },
]

const impuestos = [
  { id: 1, nombre: 'IVA' },
  { id: 4, nombre: 'INC' },
  { id: 5, nombre: 'INC Bolsas Plásticas' },
  { id: 6, nombre: 'INC Carbono' },
  { id: 22, nombre: 'No aplica' },
]

const tiposDocElectronico = [
  { id: 1, nombre: 'Factura de Venta Nacional' },
  { id: 4, nombre: 'Nota Crédito' },
  { id: 5, nombre: 'Nota Débito' },
]

// Subset operativo. El catálogo completo se sincroniza en fase 2 (reports/master/database).
const departamentos = [
  { id: 11, nombre: 'Bogotá D.C.' },
  { id: 85, nombre: 'Casanare' },
]

const municipios = [
  { id: 439, nombre: 'Bogotá, D.C.', departamentoId: 11 },
  { id: 580, nombre: 'Yopal', departamentoId: 85 },
]

async function seedCatalogo<T extends { id: number }>(
  tabla: { upsert: (a: { where: { id: number }; create: T; update: Partial<T> }) => Promise<unknown> },
  filas: T[],
) {
  for (const fila of filas) {
    await tabla.upsert({ where: { id: fila.id }, create: fila, update: fila })
  }
}

async function main() {
  await seedCatalogo(prisma.tipoDocumentoIdentificacion, tiposDocIdent)
  await seedCatalogo(prisma.tipoOrganizacion, tiposOrganizacion)
  await seedCatalogo(prisma.tipoRegimen, tiposRegimen)
  await seedCatalogo(prisma.tipoResponsabilidad, tiposResponsabilidad)
  await seedCatalogo(prisma.formaPago, formasPago)
  await seedCatalogo(prisma.metodoPago, metodosPago)
  await seedCatalogo(prisma.unidadMedida, unidadesMedida)
  await seedCatalogo(prisma.impuesto, impuestos)
  await seedCatalogo(prisma.tipoDocumentoElectronico, tiposDocElectronico)
  await seedCatalogo(prisma.departamento, departamentos)
  await seedCatalogo(prisma.municipio, municipios)

  const organizacion = await prisma.organizacion.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      nombre: 'Empresa Demo',
      slug: 'demo',
      razonSocial: 'EMPRESA DEMO SAS',
      nit: '900000000',
      dv: 0,
      softwareName: 'Divalus Facturas',
      municipalityId: 439,
      typeRegimeId: 1,
      typeOrganizationId: 1,
      merchantRegistration: '0000000-00',
      email: 'demo@divalus.test',
    },
  })

  await prisma.usuario.upsert({
    where: { email: 'admin@divalus.test' },
    update: {},
    create: {
      email: 'admin@divalus.test',
      passwordHash: await bcrypt.hash('Admin123!', 10),
      nombre: 'Administrador Demo',
      role: 'ADMIN',
      organizacionId: organizacion.id,
    },
  })

  await prisma.cliente.upsert({
    where: {
      organizacionId_identificationNumber: {
        organizacionId: organizacion.id,
        identificationNumber: '222222222222',
      },
    },
    update: {},
    create: {
      organizacionId: organizacion.id,
      identificationNumber: '222222222222',
      name: 'CONSUMIDOR FINAL',
      merchantRegistration: '0000000-00',
      typeDocumentIdentId: 3,
      esConsumidorFinal: true,
    },
  })

  const resolucionExistente = await prisma.resolucionDian.findFirst({
    where: { organizacionId: organizacion.id, prefix: 'SETP' },
  })
  if (!resolucionExistente) {
    await prisma.resolucionDian.create({
      data: {
        organizacionId: organizacion.id,
        resolutionNumber: '18760000001',
        prefix: 'SETP',
        rangoDesde: 990000000,
        rangoHasta: 995000000,
        ultimoNumero: 989999999,
        activa: true,
      },
    })
  }

  console.log('Seed completado: catálogos DIAN + empresa demo (admin@divalus.test / Admin123!)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
