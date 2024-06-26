import { NextResponse } from "next/server";
import prisma from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";

interface clientBody {
    nombre: string;
    apellido: string; 
    email: string;
    dni: string;
    password: string;
    telefono: string;
    telefono2: string;
    observaciones: string;
    veterinariaId: number;
}

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

export async function POST(req: Request) {
   try {
        const session = await getServerSession(authOptions);
        const idVete = session?.user.veterinariaId;
        if (!idVete) {
            return NextResponse.json({
                cliente: null,
                message: 'No se encontro un Id ',
            }, { status: 400 });
        }

        const body: clientBody = await req.json() as clientBody;
        const { nombre, apellido, email, dni, password, telefono, telefono2, observaciones } = body;

        const clienteExistente = await prisma.cliente.findFirst({
            where: { dni: dni  }
        })
        if (clienteExistente) {
            return NextResponse.json({ user: null, 
                message: 'Este cliente ya existe'
            }, { status: 409})
        }

        const newClient = await prisma.cliente.create({
            data: {
                nombre, 
                apellido, 
                email,
                dni,
                password,
                telefono,
                telefono2,
                observaciones,
                veterinariaId: idVete,
            }
        })

        return NextResponse.json({
            cliente: newClient,
            message: 'Cliente creada correctamente'
          }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({
            cliente: null,
            message: 'Error procesando la solicitud',
          }, { status: 500 });
   }
}
