'use client'

import Image from "next/image"
import Link from "next/link"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react';
import { ErrorLogin } from "@/components/Login/ErrorLogin"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  username: z.string().min(5, {
    message: "El numero de usuario debe tener más de 5 caracteres",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener más de 6 caracteres",
  }),
}) 

export default function Page() {
  const [loginError, setLoginError] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    router.push('/dashboard/inicio')
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })
 
  const onSubmit = async(data: z.infer<typeof formSchema>) => {
    const res = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false,
    })

    if (res?.error) {
      setLoginError(true);
    } else {
      router.push('/dashboard/inicio')
    }
  }
  

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 h-screen">
      <div className="flex sm:items-center sm:justify-center">
        <Card className="grid w-full sm:w-[400px]">
          <CardHeader className="grid text-center">
            <h1 className="text-3xl font-bold">Iniciar Sesion</h1>
            <p className="text-balance text-muted-foreground">
              Ingrese usuario y contraseña
            </p>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              <CardContent className="grid gap-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usuario</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese su nombre de usuario" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>Contraseña</FormLabel>
                          <Link
                              href="/forgot-password"
                              className="ml-auto inline-block text-sm underline"
                            >
                              Olvidaste tu contraseña?
                          </Link>
                        </div>
                        <FormControl>
                          <Input placeholder="******" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <Button type="submit" className="w-full">
                  Iniciar Sesión 
                </Button>
              </CardContent>
            </form>
          </Form>
          <CardFooter className="justify-center text-sm w-full flex-col gap-5">
          {loginError && <ErrorLogin />}
            <Link href="#" className="underline">
              Sistema de Gestión Veterinaria
            </Link>
          </CardFooter>
        </Card>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
