import { NextResponse } from "next/server";
import db from '@/lib/db'
import { RegisterBody } from "@/types/types";
import { hash } from "bcrypt";
import { PrismaClient, User } from "@prisma/client";

// Traer usuarios
export async function GET(req: Request) {
    try {
         const users: User[] = await prisma.user.findMany();
 
         return NextResponse.json({
             users: users,
             message: 'Lista de usuarios obtenida correctamente'
           }, { status: 200 });
     } catch (error) {
         return NextResponse.json({
             users: null,
             message: 'Error obteniendo la lista de usuarios'
           }, { status: 500 });
    }
}

const prisma = new PrismaClient();

export async function POST(req: Request) {
   try {
        const body: RegisterBody = await req.json() as RegisterBody;
        const { email, username, name, password, rol, veterinariaId } = body;

        const emailExistente = await db.user.findUnique({
            where: { email: email}
        })
        if (emailExistente) {
            return NextResponse.json({ user: null, 
                message: 'Ese email ya se encuentra registrado'
            }, { status: 409})
        }

        const usuarioExistente = await prisma.user.findUnique({
            where: { username: username}
        })
        if (usuarioExistente) {
            return NextResponse.json({ user: null, 
                message: 'Ese usuario ya se encuentra registrado'
            }, { status: 409})
        }

        const criptPassword = await hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                name,
                password: criptPassword, 
                rol,
                veterinariaId
            }
        })

        return NextResponse.json({
            user: newUser,
            message: 'Usuario creado correctamente'
          }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({
            user: null,
            message: 'Error procesando la solicitud',
          }, { status: 500 });
   }
}

// modelo json para crear usuario por postman
// POST localhost:3000/api/user
// {
//     "username" : "test",
//     "email" : "test@test.com",
//     "password" : "123123",
//     "rol" : "admin",
//     "id_veterinaria" : 1
// }