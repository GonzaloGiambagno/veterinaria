/*
  Warnings:

  - You are about to drop the column `id_veterinaria` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "id_veterinaria",
ADD COLUMN     "veterinariaId" INTEGER;

-- CreateTable
CREATE TABLE "Veterinaria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "proprietario" TEXT NOT NULL,
    "proprietario2" TEXT,
    "logoImage" TEXT NOT NULL,

    CONSTRAINT "Veterinaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mascota" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "peso" INTEGER,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "veterinariaId" INTEGER NOT NULL,

    CONSTRAINT "Mascota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "telefono2" TEXT,
    "observaciones" TEXT,
    "veterinariaId" INTEGER NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Veterinaria_nombre_key" ON "Veterinaria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Veterinaria_direccion_key" ON "Veterinaria"("direccion");

-- CreateIndex
CREATE UNIQUE INDEX "Veterinaria_telefono_key" ON "Veterinaria"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "Veterinaria_logoImage_key" ON "Veterinaria"("logoImage");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_veterinariaId_fkey" FOREIGN KEY ("veterinariaId") REFERENCES "Veterinaria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mascota" ADD CONSTRAINT "Mascota_veterinariaId_fkey" FOREIGN KEY ("veterinariaId") REFERENCES "Veterinaria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mascota" ADD CONSTRAINT "Mascota_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_veterinariaId_fkey" FOREIGN KEY ("veterinariaId") REFERENCES "Veterinaria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
