// pages/api/clientes/[id].js
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/db';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";

const updateClienteSchema = z.object({
    nombre: z.string().optional(),
    apellido: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/).optional(),
    telefono: z.string().optional(),
    telefono2: z.string().optional().nullable(),
    observaciones: z.string().optional().optional(),
});

interface Params {
    id: string;
}
// traer un cliente por ID
export async function GET(req: NextRequest, { params }: { params: Params }) {
    try {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("No autenticado", { status: 401 });
    }

    const { id } = params;

    const cliente = await prisma.cliente.findUnique({
        where: { id: Number(id) },
        include: {
        veterinaria: true,
        mascotas: true,
        },
    });

    if (!cliente) {
        return NextResponse.json(
        { cliente: null, message: 'Este cliente no existe' },
        { status: 409 }
        );
    }

    return NextResponse.json({
        cliente,
        message: 'Cliente obtenido exitosamente'
    }, { status: 200 });
    } catch (error) {
    return new NextResponse("Cliente no encontrado", { status: 500 });
    }
}
// Editar cliente 
export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("No autenticado", { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const parsedBody = updateClienteSchema.parse(body);

    const { nombre, apellido, email, password, telefono, telefono2, observaciones } = parsedBody;

    const clienteExistente = await prisma.cliente.findFirst({
      where: { id: Number(id) },
    });

    if (!clienteExistente) {
      return NextResponse.json(
        { user: null, message: 'Este cliente no existe' },
        { status: 409 }
      );
    }

    const updateCliente = await prisma.cliente.update({
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
// Eliminar cliente
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("No autenticado", { status: 401 });
    }

    const { id } = params;

    const clienteExistente = await prisma.cliente.findFirst({
      where: { id: Number(id) },
    });

    if (!clienteExistente) {
      return NextResponse.json(
        { user: null, message: 'Este cliente no existe' },
        { status: 409 }
      );
    }

    await prisma.cliente.delete({
      where: { id: clienteExistente.id },
    });

    return new NextResponse("Cliente eliminado con éxito", { status: 200 });
  } catch (error) {
    return new NextResponse("Error al eliminar el cliente", { status: 500 });
  }
}
