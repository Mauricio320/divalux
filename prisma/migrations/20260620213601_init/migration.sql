-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'VENDEDOR');

-- CreateEnum
CREATE TYPE "EstadoFactura" AS ENUM ('BORRADOR', 'CONFIRMADA', 'ANULADA', 'EMITIDA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('ENTRADA', 'AJUSTE', 'TRASLADO_SALIDA', 'TRASLADO_ENTRADA', 'VENTA', 'REVERSA');

-- CreateTable
CREATE TABLE "Organizacion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "dv" INTEGER NOT NULL,
    "softwareName" TEXT NOT NULL,
    "merchantRegistration" TEXT,
    "direccion" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "typeRegimeId" INTEGER NOT NULL DEFAULT 1,
    "typeOrganizationId" INTEGER NOT NULL DEFAULT 1,
    "typeDocumentIdentId" INTEGER NOT NULL DEFAULT 6,
    "municipalityId" INTEGER NOT NULL,
    "permitirStockNegativo" BOOLEAN NOT NULL DEFAULT false,
    "nextpymeBaseUrl" TEXT NOT NULL DEFAULT 'https://api.nextpyme.plus/api/ubl2.1',
    "nextpymeToken" TEXT,
    "certificateDaysLeft" INTEGER,

    CONSTRAINT "Organizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResolucionDian" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "resolutionNumber" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "rangoDesde" INTEGER NOT NULL,
    "rangoHasta" INTEGER NOT NULL,
    "ultimoNumero" INTEGER NOT NULL DEFAULT 0,
    "vigenteDesde" TIMESTAMP(3),
    "vigenteHasta" TIMESTAMP(3),
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResolucionDian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VENDEDOR',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "organizacionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "identificationNumber" TEXT NOT NULL,
    "dv" INTEGER,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "email" TEXT,
    "merchantRegistration" TEXT,
    "typeDocumentIdentId" INTEGER NOT NULL DEFAULT 3,
    "typeOrganizationId" INTEGER,
    "typeLiabilityId" INTEGER,
    "municipalityId" INTEGER,
    "typeRegimeId" INTEGER,
    "esConsumidorFinal" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "unitMeasureId" INTEGER NOT NULL DEFAULT 70,
    "typeItemIdentId" INTEGER NOT NULL DEFAULT 4,
    "precioSinImpuesto" DECIMAL(18,2) NOT NULL,
    "taxId" INTEGER NOT NULL DEFAULT 1,
    "percent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "controlaStock" BOOLEAN NOT NULL DEFAULT true,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bodega" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "esPrincipal" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bodega_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "bodegaId" TEXT NOT NULL,
    "cantidad" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimientoInventario" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "tipo" "TipoMovimiento" NOT NULL,
    "productoId" TEXT NOT NULL,
    "bodegaId" TEXT NOT NULL,
    "cantidad" DECIMAL(18,3) NOT NULL,
    "saldoResultante" DECIMAL(18,3) NOT NULL,
    "trasladoGrupoId" TEXT,
    "facturaId" TEXT,
    "registradoPorId" TEXT NOT NULL,
    "motivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimientoInventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "estado" "EstadoFactura" NOT NULL DEFAULT 'BORRADOR',
    "typeDocumentId" INTEGER NOT NULL DEFAULT 1,
    "numero" INTEGER,
    "prefix" TEXT,
    "resolutionNumber" TEXT,
    "resolucionId" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hora" TEXT,
    "clienteId" TEXT NOT NULL,
    "clienteIdentificationNumber" TEXT NOT NULL,
    "clienteName" TEXT NOT NULL,
    "bodegaId" TEXT NOT NULL,
    "vendedorId" TEXT NOT NULL,
    "paymentFormId" INTEGER NOT NULL DEFAULT 1,
    "paymentMethodId" INTEGER NOT NULL DEFAULT 10,
    "paymentDueDate" TIMESTAMP(3),
    "durationMeasure" TEXT,
    "notes" TEXT,
    "headNote" TEXT,
    "footNote" TEXT,
    "sendmail" BOOLEAN NOT NULL DEFAULT false,
    "sendmailtome" BOOLEAN NOT NULL DEFAULT false,
    "lineExtensionAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "taxExclusiveAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "taxInclusiveAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "allowanceTotalAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "chargeTotalAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "payableAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "payloadNextpyme" JSONB,
    "cufe" TEXT,
    "uuidDian" TEXT,
    "urlInvoicePdf" TEXT,
    "urlInvoiceXml" TEXT,
    "urlInvoiceAttached" TEXT,
    "dianIsValid" BOOLEAN,
    "dianStatusCode" TEXT,
    "dianStatusMessage" TEXT,
    "emitidaAt" TIMESTAMP(3),
    "motivoAnulacion" TEXT,
    "anuladoPorId" TEXT,
    "anuladoEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacturaLinea" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "facturaId" TEXT NOT NULL,
    "productoId" TEXT,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "unitMeasureId" INTEGER NOT NULL DEFAULT 70,
    "invoicedQuantity" DECIMAL(18,3) NOT NULL,
    "baseQuantity" DECIMAL(18,3) NOT NULL DEFAULT 1,
    "priceAmount" DECIMAL(18,2) NOT NULL,
    "lineExtensionAmount" DECIMAL(18,2) NOT NULL,
    "freeOfChargeIndicator" BOOLEAN NOT NULL DEFAULT false,
    "typeItemIdentId" INTEGER NOT NULL DEFAULT 4,

    CONSTRAINT "FacturaLinea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacturaLineaImpuesto" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "facturaLineaId" TEXT NOT NULL,
    "taxId" INTEGER NOT NULL,
    "percent" DECIMAL(5,2) NOT NULL,
    "taxableAmount" DECIMAL(18,2) NOT NULL,
    "taxAmount" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "FacturaLineaImpuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacturaImpuesto" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "facturaId" TEXT NOT NULL,
    "taxId" INTEGER NOT NULL,
    "percent" DECIMAL(5,2) NOT NULL,
    "taxableAmount" DECIMAL(18,2) NOT NULL,
    "taxAmount" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "FacturaImpuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllowanceCharge" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "facturaId" TEXT NOT NULL,
    "chargeIndicator" BOOLEAN NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "baseAmount" DECIMAL(18,2) NOT NULL,
    "discountId" INTEGER,
    "allowanceChargeReason" TEXT NOT NULL,

    CONSTRAINT "AllowanceCharge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoDocumentoIdentificacion" (
    "id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TipoDocumentoIdentificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoOrganizacion" (
    "id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "TipoOrganizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoRegimen" (
    "id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "TipoRegimen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoResponsabilidad" (
    "id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "TipoResponsabilidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormaPago" (
    "id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "FormaPago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetodoPago" (
    "id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "MetodoPago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnidadMedida" (
    "id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "UnidadMedida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Impuesto" (
    "id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Impuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoDocumentoElectronico" (
    "id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "TipoDocumentoElectronico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departamento" (
    "id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Municipio" (
    "id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "departamentoId" INTEGER,

    CONSTRAINT "Municipio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organizacion_slug_key" ON "Organizacion"("slug");

-- CreateIndex
CREATE INDEX "ResolucionDian_organizacionId_activa_idx" ON "ResolucionDian"("organizacionId", "activa");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_organizacionId_idx" ON "Usuario"("organizacionId");

-- CreateIndex
CREATE INDEX "Cliente_organizacionId_idx" ON "Cliente"("organizacionId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_organizacionId_identificationNumber_key" ON "Cliente"("organizacionId", "identificationNumber");

-- CreateIndex
CREATE INDEX "Producto_organizacionId_idx" ON "Producto"("organizacionId");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_organizacionId_code_key" ON "Producto"("organizacionId", "code");

-- CreateIndex
CREATE INDEX "Bodega_organizacionId_idx" ON "Bodega"("organizacionId");

-- CreateIndex
CREATE INDEX "Stock_organizacionId_bodegaId_idx" ON "Stock"("organizacionId", "bodegaId");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_organizacionId_productoId_bodegaId_key" ON "Stock"("organizacionId", "productoId", "bodegaId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_organizacionId_productoId_idx" ON "MovimientoInventario"("organizacionId", "productoId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_organizacionId_bodegaId_idx" ON "MovimientoInventario"("organizacionId", "bodegaId");

-- CreateIndex
CREATE INDEX "MovimientoInventario_facturaId_idx" ON "MovimientoInventario"("facturaId");

-- CreateIndex
CREATE INDEX "Factura_organizacionId_estado_idx" ON "Factura"("organizacionId", "estado");

-- CreateIndex
CREATE INDEX "Factura_organizacionId_clienteId_idx" ON "Factura"("organizacionId", "clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_organizacionId_prefix_numero_key" ON "Factura"("organizacionId", "prefix", "numero");

-- CreateIndex
CREATE INDEX "FacturaLinea_facturaId_idx" ON "FacturaLinea"("facturaId");

-- CreateIndex
CREATE INDEX "FacturaLinea_organizacionId_idx" ON "FacturaLinea"("organizacionId");

-- CreateIndex
CREATE INDEX "FacturaLineaImpuesto_facturaLineaId_idx" ON "FacturaLineaImpuesto"("facturaLineaId");

-- CreateIndex
CREATE INDEX "FacturaLineaImpuesto_organizacionId_idx" ON "FacturaLineaImpuesto"("organizacionId");

-- CreateIndex
CREATE INDEX "FacturaImpuesto_facturaId_idx" ON "FacturaImpuesto"("facturaId");

-- CreateIndex
CREATE INDEX "FacturaImpuesto_organizacionId_idx" ON "FacturaImpuesto"("organizacionId");

-- CreateIndex
CREATE INDEX "AllowanceCharge_facturaId_idx" ON "AllowanceCharge"("facturaId");

-- CreateIndex
CREATE INDEX "AllowanceCharge_organizacionId_idx" ON "AllowanceCharge"("organizacionId");

-- CreateIndex
CREATE INDEX "Municipio_departamentoId_idx" ON "Municipio"("departamentoId");

-- AddForeignKey
ALTER TABLE "ResolucionDian" ADD CONSTRAINT "ResolucionDian_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bodega" ADD CONSTRAINT "Bodega_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_bodegaId_fkey" FOREIGN KEY ("bodegaId") REFERENCES "Bodega"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_bodegaId_fkey" FOREIGN KEY ("bodegaId") REFERENCES "Bodega"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_bodegaId_fkey" FOREIGN KEY ("bodegaId") REFERENCES "Bodega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_anuladoPorId_fkey" FOREIGN KEY ("anuladoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_resolucionId_fkey" FOREIGN KEY ("resolucionId") REFERENCES "ResolucionDian"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturaLinea" ADD CONSTRAINT "FacturaLinea_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturaLinea" ADD CONSTRAINT "FacturaLinea_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturaLinea" ADD CONSTRAINT "FacturaLinea_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturaLineaImpuesto" ADD CONSTRAINT "FacturaLineaImpuesto_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturaLineaImpuesto" ADD CONSTRAINT "FacturaLineaImpuesto_facturaLineaId_fkey" FOREIGN KEY ("facturaLineaId") REFERENCES "FacturaLinea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturaImpuesto" ADD CONSTRAINT "FacturaImpuesto_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacturaImpuesto" ADD CONSTRAINT "FacturaImpuesto_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllowanceCharge" ADD CONSTRAINT "AllowanceCharge_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllowanceCharge" ADD CONSTRAINT "AllowanceCharge_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Municipio" ADD CONSTRAINT "Municipio_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
