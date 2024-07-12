import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";
import prisma from '@/lib/db';
import moment from "moment";

const updateMascotaSchema = z.object({
  nombre: z.string().optional(),
  especie: z.string().optional(),
  peso: z.number().optional(),
  fecha_nacimiento: z.string(),
  fotoMascota: z.string().optional()
});

interface Params {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
  const session = await getServerSession(authOptions);
  if (!session) {
      return new NextResponse("No autenticado", { status: 401 });
  }

  const { id } = params;

  const mascota = await prisma.mascota.findUnique({
      where: { id: Number(id) },
      include: {
      veterinaria: true,
      cliente: true,
      },
  });

  if (!mascota) {
      return NextResponse.json(
      { mascota: null, message: 'Esta mascota no existe' },
      { status: 409 }
      );
  }

  return NextResponse.json({
      mascota,
      message: 'mascota obtenida exitosamente'
  }, { status: 200 });
  } catch (error) {
  return new NextResponse("mascota no encontrado", { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {

    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("No autenticado", { status: 401 });
    }

    const { id } = params;
    
    const body = await req.json();

    const { nombre, especie, peso, fecha_nacimiento, fotoMascota } = updateMascotaSchema.parse(body);
    const fechaNacimiento = moment(fecha_nacimiento, "YYYY-MM-DD").utc().toDate();

    if (!moment(fecha_nacimiento, "YYYY-MM-DD").isValid()) {
      return NextResponse.json({
        mascota: null,
        message: 'Fecha de nacimiento no válida',
      }, { status: 400 });
    }

    const mascotaExistente = await prisma.mascota.findFirst({
      where: { id: Number(id) }
    });
    if (!mascotaExistente) {
        return NextResponse.json({ user: null, 
            message: 'Esta mascota no existe'
        }, { status: 409})
    }

    const updateMascota = await prisma.mascota.update({
      where: { id: mascotaExistente.id },
      data: {
        nombre,
        especie,
        peso,
        fecha_nacimiento: fechaNacimiento,
        fotoMascota
      },
    });
    

    return new NextResponse(JSON.stringify(updateMascota), { status: 200 });
  } catch (error) {
    return new NextResponse("Error al actualizar la mascota", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("No autenticado", { status: 401 });
    }

    const { id } = params;

    const mascota = await prisma.mascota.findFirst({
      where: { id: Number(id) },
    });

    if (!mascota) {
      return NextResponse.json(
        { user: null, message: 'Esta mascota no existe' },
        { status: 409 }
      );
    }

    await prisma.mascota.delete({
      where: { id: mascota.id },
    });

    return new NextResponse("mascota eliminado con éxito", { status: 200 });
  } catch (error) {
    return new NextResponse("Error al eliminar el mascota", { status: 500 });
  }
}