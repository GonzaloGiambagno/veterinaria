import { NextResponse, NextRequest } from "next/server";
import db from '@/lib/db';
import { hash, compare } from "bcrypt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";

const updateUserSchema = z.object({
  newUsername: z.string().min(5).optional(),
  newEmail: z.string().email().optional(),
  currentPassword: z.string(),
  newPassword: z.string().min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/).optional(),
  confirmPassword: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const parsedBody = updateUserSchema.parse(body);

    const { newUsername, newEmail, currentPassword, newPassword, confirmPassword } = parsedBody;
    const userId = session?.user.id;

    const existingUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return new NextResponse("El usuario no existe", { status: 404 });
    }

    const isPasswordValid = await compare(currentPassword, existingUser.password);
    if (!isPasswordValid) {
      return new NextResponse("La contraseña actual es incorrecta", { status: 400 });
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (newUsername) updateData.username = newUsername;
    if (newEmail) updateData.email = newEmail;

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        return new NextResponse("Las contraseñas no coinciden", { status: 400 });
      }
      updateData.password = await hash(newPassword, 10);
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return new NextResponse("Error al actualizar el usuario", { status: 500 });
  }
}
