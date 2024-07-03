import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { Mascota } from '@/types/types';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
      if (!session) {
        return new NextResponse("No autenticado", { status: 401 });
      }

      const vete = session?.user.veterinariaId

      const mascotas = await prisma.mascota.findMany({
        where: {
          veterinariaId: vete,
        },
        include: {
          veterinaria: true,
          cliente: true, 
        },
      });

       return NextResponse.json({
          mascotas,
           message: 'Lista de mascotas obtenida correctamente'
         }, { status: 200 });
   } catch (error) {
       return NextResponse.json({
          mascotas: null,
           message: 'Error obteniendo la lista de mascotas'
         }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
      const session = await getServerSession(authOptions);
      const idVete = session?.user.veterinariaId;
      if (!idVete) {
          return NextResponse.json({
              veterinariaId: null,
              message: 'No se encontró un Id',
          }, { status: 400 });
      }

      const body: Mascota = await req.json();

      const fechaNacimiento = new Date(body.fecha_nacimiento);
      if (isNaN(fechaNacimiento.getTime())) {
          return NextResponse.json({
              mascota: null,
              message: 'Fecha de nacimiento no válida',
          }, { status: 400 });
      }

      const { id, nombre, especie, peso, clienteId } = body;

      const mascotaExistente = await prisma.mascota.findFirst({
          where: { id: id }
      });
      if (mascotaExistente) {
          return NextResponse.json({
              mascota: null, 
              message: 'Esta mascota ya existe'
          }, { status: 409 });
      }

      const newMascota = await prisma.mascota.create({
          data: {
              id,
              nombre, 
              especie,
              peso,
              fecha_nacimiento: fechaNacimiento,
              clienteId,
              veterinariaId: idVete,
          }
      });

      return NextResponse.json({
          mascota: newMascota,
          message: 'Mascota creada correctamente'
      }, { status: 201 });
  } catch (error) {
      console.error("Error creando mascota:", error);
      return NextResponse.json({
          mascota: null,
          message: 'Error procesando la solicitud',
        }, { status: 500 });
 }
}
