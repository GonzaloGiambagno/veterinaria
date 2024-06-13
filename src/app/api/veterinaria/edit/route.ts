import { NextResponse, NextRequest } from "next/server";
import db from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";

const updateUserSchema = z.object({
  nombre: z.string().optional(),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  proprietario: z.string().optional(),
  proprietario2: z.string().optional(),
  logoImage: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const parsedBody = updateUserSchema.parse(body);

    const { nombre, direccion, telefono,  proprietario, proprietario2, logoImage } = parsedBody;
    const idVete = session?.user.veterinaria.id;

    const existeVete = await db.veterinaria.findUnique({
      where: { id: idVete },
    });

    if (!existeVete) {
      return new NextResponse("La veterinaria no existe", { status: 404 });
    }

    const updatedUser = await db.veterinaria.update({
      where: { id: idVete },
      data: {
        nombre: nombre,
        direccion: direccion,
        telefono: telefono,
        proprietario: proprietario,
        proprietario2: proprietario2,
        logoImage: logoImage,
      },
    });

    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    return new NextResponse("Error al actualizar la veterinaria", { status: 500 });
  }
}
