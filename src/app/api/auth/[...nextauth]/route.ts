import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
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
        async authorize(credentials) {
          if (!credentials) {
              return null;
          }

          const user = await prisma.user.findUnique({
              where: {
                  username: credentials?.username,
              }
          });
          if (!user) throw new Error('Usuario no encontrado');

          const passwordMach = await compare(credentials.password, user.password);

          if (!passwordMach) throw new Error('Contraseña incorrecta');

          return user;

          }
      })
  ],
  callbacks: {
    async jwt({ token, user, session }){
      console.log({token, user, session})
      if(user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          email: user.email,
          rol: user.rol,
          id_veterinaria: user.id_veterinaria,
        }
      }
      return token
    },
    async session({ session, token, user }){
      console.log({token, user, session})
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          email: token.email,
          rol: token.rol,
          id_veterinaria: token.id_veterinaria,
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