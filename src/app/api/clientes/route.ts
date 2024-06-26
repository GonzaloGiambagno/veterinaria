import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

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