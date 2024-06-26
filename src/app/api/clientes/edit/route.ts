import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from '@/lib/db';
import { z } from "zod";
import prisma from '@/lib/db';

const updateClienteSchema = z.object({
  nombre: z.string().optional(),
  apellido: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/).optional(),
  telefono: z.string().optional(),
  telefono2: z.string().optional().optional(),
  observaciones: z.string().optional().optional(),
});

export async function POST(req: NextRequest) {
  try {

    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("No autenticado", { status: 401 });
    }
    const body = await req.json();
    const parsedBody = updateClienteSchema.parse(body);

    const { id, nombre, apellido, email, password, telefono, telefono2, observaciones } = body;

    const clienteExistente = await prisma.cliente.findFirst({
      where: { id: id  }
    })
    if (!clienteExistente) {
        return NextResponse.json({ user: null, 
            message: 'Este cliente No existe'
        }, { status: 409})
    }

    const updateCliente = await db.cliente.update({
      where: { id: clienteExistente.id },
      data: {
        nombre, 
        apellido, 
        email,
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
