import NextAuth, { NextAuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/lib/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { compare } from "bcrypt";

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text", placeholder: "usuario" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          if (!credentials) {
              return null;
          }

          const userFound = await db.user.findUnique({
              where: {
                  username: credentials?.username,
              }
          });
          if (!userFound) throw new Error('Usuario no encontrado');

          const passwordMach = await compare(credentials.password, userFound.password);

          if (!passwordMach) throw new Error('Contraseña incorrecta');

          return {
            id: String(userFound.id),
            username: userFound.username,
            email: userFound.email,
            rol: userFound.rol,
            id_veterinaria: userFound.id_veterinaria,
          }; 
        }
      })
  ],
  callbacks: {
    async jwt({ token, user }){
      if(user) {
        return {
          ...token,
          username: user.username
        }
      }
      return token
    },
    async session({ session, token }){
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username
        }
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: '/login',

  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }