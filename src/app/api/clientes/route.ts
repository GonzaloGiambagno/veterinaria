import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { Cliente } from '@/types/types';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
      if (!session) {
        return new NextResponse("No autenticado", { status: 401 });
      }

      const vete = session?.user.veterinariaId

      const clientes = await prisma.cliente.findMany({
        where: {
          veterinariaId: vete,
        },
        include: {
          veterinaria: true,
          mascotas: true, 
        },
      });

       return NextResponse.json({
          clientes,
           message: 'Lista de clientes obtenida correctamente'
         }, { status: 200 });
   } catch (error) {
       return NextResponse.json({
          clientes: null,
           message: 'Error obteniendo la lista de clientes'
         }, { status: 500 });
  }
}

//crear cliente
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

       const body: Cliente = await req.json() as Cliente;
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