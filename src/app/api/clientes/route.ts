import { NextResponse } from 'next/server';
import { getSession  } from 'next-auth/react';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
      const session = await getSession()

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