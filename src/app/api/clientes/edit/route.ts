import { NextResponse, NextRequest } from "next/server";
import db from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";
import prisma from '@/lib/db';

const updateClienteSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  email: z.string().email(),
  dni: z.string().max(11),
  password: z.string().min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/).optional(),
  telefono: z.string(),
  telefono2: z.string().optional(),
  observaciones: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const parsedBody = updateClienteSchema.parse(body);

    const { nombre, apellido, email, dni, password, telefono, telefono2, observaciones } = body;
    const idVete = session?.user.veterinariaId;

    const clienteExistente = await prisma.cliente.findFirst({
      where: { dni: dni  }
    })
    if (!clienteExistente) {
        return NextResponse.json({ user: null, 
            message: 'Este cliente No existe'
        }, { status: 409})
    }

    const updateCliente = await db.cliente.update({
      where: { id: idVete },
      data: {
        nombre, 
        apellido, 
        email,
        dni,
        password,
        telefono,
        telefono2,
        observaciones,
      },
    });

    return new NextResponse(JSON.stringify(updateCliente), { status: 200 });
  } catch (error) {
    return new NextResponse("Error al actualizar el cliente", { status: 500 });
  }
}
