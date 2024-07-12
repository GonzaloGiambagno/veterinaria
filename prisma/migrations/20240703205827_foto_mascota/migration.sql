-- AlterTable
ALTER TABLE "Mascota" ADD COLUMN     "fotoMascota" TEXT;

-- AlterTable
ALTER TABLE "Veterinaria" ALTER COLUMN "logoImage" DROP NOT NULL;
