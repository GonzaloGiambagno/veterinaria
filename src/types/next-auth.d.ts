import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"
import { User } from "@auth/core/types"
import { AdapterUser } from "next-auth/adapters"
import { Veterinaria } from "./veterinaria"

declare module "next-auth" {
  interface Session {
    user: {
      id:string;
      name: string;
      email: string;
      username: string,
      rol: string, 
      veterinariaId: number | null,
      veterinaria: Veterinaria
    } & DefaultSession
  }

  interface User extends DefaultUser {
    username: string,
    rol: string, 
    veterinariaId: number | null,
  }

  interface User extends AdapterUser {
    username: string,
    rol: string, 
    veterinariaId: number | null,
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    username: string,
    rol: string, 
    veterinariaId: number | null,
  }
}

declare module "@auth/core/types" {
  interface User {
    username: string,
    rol: string, 
    veterinariaId: number | null,
  }
}