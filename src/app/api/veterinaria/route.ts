import { NextResponse } from 'next/server';
import { getSession  } from 'next-auth/react';
import { PrismaClient, Veterinaria } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
      const session = await getSession()

      if (!session ||!session?.user.veterinariaId) {
        return NextResponse.json({ error: 'User not authenticated or missing veterinarian ID' }, { status: 400 });
        
      }

      const veterinaria = await prisma.veterinaria.findUnique({
        where: { id: session?.user.veterinariaId },
      });

      // const veterinarias: Veterinaria[] = await prisma.veterinaria.findMany();

       return NextResponse.json({
          veterinaria,
           message: 'Lista de veterinarias obtenida correctamente'
         }, { status: 200 });
   } catch (error) {
       return NextResponse.json({
          veterinarias: null,
           message: 'Error obteniendo la lista de usuarios'
         }, { status: 500 });
  }
}