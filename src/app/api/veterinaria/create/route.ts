import { NextResponse } from "next/server";
import db from '@/lib/db'
import { hash } from "bcrypt";
import { PrismaClient, Veterinaria } from "@prisma/client";
const prisma = new PrismaClient();


interface VeteBody {
    nombre: string;
    direccion: string;
    telefono: string;
    proprietario: string;
    proprietario2: string;
    logoImage: string
}

export async function POST(req: Request) {
   try {
        const body: VeteBody = await req.json() as VeteBody;
        const { nombre, direccion,telefono,  proprietario, proprietario2, logoImage } = body;

        const existeVeterinaria = await prisma.veterinaria.findUnique({
            where: { nombre: nombre  }
        })
        if (existeVeterinaria) {
            return NextResponse.json({ user: null, 
                message: 'Esta veterinaria ya existe'
            }, { status: 409})
        }

        const newVete = await prisma.veterinaria.create({
            data: {
                nombre, 
                direccion,
                telefono,
                proprietario,
                proprietario2,
                logoImage
            }
        })

        return NextResponse.json({
            user: newVete,
            message: 'Veterinaria creada correctamente'
          }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({
            user: null,
            message: 'Error procesando la solicitud',
          }, { status: 500 });
   }
}
