import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"
import { User } from "@auth/core/types"
import { AdapterUser } from "next-auth/adapters"

declare module "next-auth" {
  interface Session {
    user: {
      id:string;
      username: string,
      rol: string, 
      id_veterinaria: number,
      accessToken: string
    } & DefaultSession
  }

  interface User extends DefaultUser {
    username: string,
    rol: string, 
    id_veterinaria: number,
  }

  interface User extends AdapterUser {
    username: string,
    rol: string, 
    id_veterinaria: number,
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    username: string,
    rol: string, 
    id_veterinaria: number,
  }
}

declare module "@auth/core/types" {
  interface User {
    username: string,
    rol: string, 
    id_veterinaria: number,
  }
}