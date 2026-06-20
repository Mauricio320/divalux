-- CreateEnum
CREATE TYPE "EstadoCotizacion" AS ENUM ('BORRADOR', 'ENVIADA', 'APROBADA', 'RECHAZADA', 'VENCIDA');

-- AlterTable
ALTER TABLE "Organizacion" ADD COLUMN     "secuenciaCotizacion" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Cotizacion" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "estado" "EstadoCotizacion" NOT NULL DEFAULT 'BORRADOR',
    "numero" INTEGER NOT NULL,
    "prefix" TEXT NOT NULL DEFAULT 'COT',
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validezHasta" TIMESTAMP(3),
    "clienteId" TEXT NOT NULL,
    "clienteIdentificationNumber" TEXT NOT NULL,
    "clienteName" TEXT NOT NULL,
    "vendedorId" TEXT NOT NULL,
    "paymentFormId" INTEGER NOT NULL DEFAULT 1,
    "paymentMethodId" INTEGER NOT NULL DEFAULT 10,
    "notes" TEXT,
    "headNote" TEXT,
    "footNote" TEXT,
    "lineExtensionAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "taxExclusiveAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "taxInclusiveAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "allowanceTotalAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "chargeTotalAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "payableAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "facturaGeneradaId" TEXT,
    "convertidaEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cotizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CotizacionLinea" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "cotizacionId" TEXT NOT NULL,
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

    CONSTRAINT "CotizacionLinea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CotizacionLineaImpuesto" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "cotizacionLineaId" TEXT NOT NULL,
    "taxId" INTEGER NOT NULL,
    "percent" DECIMAL(5,2) NOT NULL,
    "taxableAmount" DECIMAL(18,2) NOT NULL,
    "taxAmount" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "CotizacionLineaImpuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CotizacionImpuesto" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "cotizacionId" TEXT NOT NULL,
    "taxId" INTEGER NOT NULL,
    "percent" DECIMAL(5,2) NOT NULL,
    "taxableAmount" DECIMAL(18,2) NOT NULL,
    "taxAmount" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "CotizacionImpuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CotizacionAllowanceCharge" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "cotizacionId" TEXT NOT NULL,
    "chargeIndicator" BOOLEAN NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "baseAmount" DECIMAL(18,2) NOT NULL,
    "discountId" INTEGER,
    "allowanceChargeReason" TEXT NOT NULL,

    CONSTRAINT "CotizacionAllowanceCharge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cotizacion_facturaGeneradaId_key" ON "Cotizacion"("facturaGeneradaId");

-- CreateIndex
CREATE INDEX "Cotizacion_organizacionId_estado_idx" ON "Cotizacion"("organizacionId", "estado");

-- CreateIndex
CREATE INDEX "Cotizacion_organizacionId_clienteId_idx" ON "Cotizacion"("organizacionId", "clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "Cotizacion_organizacionId_prefix_numero_key" ON "Cotizacion"("organizacionId", "prefix", "numero");

-- CreateIndex
CREATE INDEX "CotizacionLinea_cotizacionId_idx" ON "CotizacionLinea"("cotizacionId");

-- CreateIndex
CREATE INDEX "CotizacionLinea_organizacionId_idx" ON "CotizacionLinea"("organizacionId");

-- CreateIndex
CREATE INDEX "CotizacionLineaImpuesto_cotizacionLineaId_idx" ON "CotizacionLineaImpuesto"("cotizacionLineaId");

-- CreateIndex
CREATE INDEX "CotizacionLineaImpuesto_organizacionId_idx" ON "CotizacionLineaImpuesto"("organizacionId");

-- CreateIndex
CREATE INDEX "CotizacionImpuesto_cotizacionId_idx" ON "CotizacionImpuesto"("cotizacionId");

-- CreateIndex
CREATE INDEX "CotizacionImpuesto_organizacionId_idx" ON "CotizacionImpuesto"("organizacionId");

-- CreateIndex
CREATE INDEX "CotizacionAllowanceCharge_cotizacionId_idx" ON "CotizacionAllowanceCharge"("cotizacionId");

-- CreateIndex
CREATE INDEX "CotizacionAllowanceCharge_organizacionId_idx" ON "CotizacionAllowanceCharge"("organizacionId");

-- AddForeignKey
ALTER TABLE "Cotizacion" ADD CONSTRAINT "Cotizacion_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cotizacion" ADD CONSTRAINT "Cotizacion_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cotizacion" ADD CONSTRAINT "Cotizacion_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cotizacion" ADD CONSTRAINT "Cotizacion_facturaGeneradaId_fkey" FOREIGN KEY ("facturaGeneradaId") REFERENCES "Factura"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CotizacionLinea" ADD CONSTRAINT "CotizacionLinea_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CotizacionLinea" ADD CONSTRAINT "CotizacionLinea_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "Cotizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CotizacionLinea" ADD CONSTRAINT "CotizacionLinea_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CotizacionLineaImpuesto" ADD CONSTRAINT "CotizacionLineaImpuesto_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CotizacionLineaImpuesto" ADD CONSTRAINT "CotizacionLineaImpuesto_cotizacionLineaId_fkey" FOREIGN KEY ("cotizacionLineaId") REFERENCES "CotizacionLinea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CotizacionImpuesto" ADD CONSTRAINT "CotizacionImpuesto_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CotizacionImpuesto" ADD CONSTRAINT "CotizacionImpuesto_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "Cotizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CotizacionAllowanceCharge" ADD CONSTRAINT "CotizacionAllowanceCharge_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CotizacionAllowanceCharge" ADD CONSTRAINT "CotizacionAllowanceCharge_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "Cotizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
