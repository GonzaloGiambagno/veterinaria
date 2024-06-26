import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth'
import prisma from '@/lib/db';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const vete = session?.user.veterinariaId;

        if (!vete) {
            return NextResponse.json({
                veterinaria: null,
                message: 'Usuario no autenticado o falta veterinariaId'
            }, { status: 400 });
        }

        const veterinaria = await prisma.veterinaria.findUnique({
            where: { id: vete },
        });

        return NextResponse.json({
            veterinaria,
            message: 'Veterinaria obtenida correctamente'
        }, { status: 200 });
    } catch (error) {
        console.error('Error obteniendo la veterinaria:', error);
        return NextResponse.json({
            veterinarias: null,
            message: 'Error interno obteniendo la veterinaria'
        }, { status: 500 });
    }
}
