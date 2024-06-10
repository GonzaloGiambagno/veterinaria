"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardContent } from "@/components/ui/card";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

const formSchema = z.object({
  // username: z.string().min(5).optional(),
  newEmail: z.string().email().optional(),
  currentPassword: z.string(),
  newPassword: z.string().min(6).optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => !data.newPassword || data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export function EditarPerfil() {
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      newEmail: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (session && session.user) {
      const { name, email } = session.user;
      form.setValue("name", name || "");
      form.setValue("newEmail", email || "" );
    }
  }, [session]);


  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch("/api/auth/editPerfil", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          ...values,
        }),
      });

      if (res.ok) {
        console.log("Perfil actualizado con éxito");
      } else {
        const error = await res.json();
        console.log("Error al actualizar el perfil:", error);
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
    }
  };

  return (
    <fieldset className="grid gap-6 rounded-lg border p-4">
      <legend className=" px-1 text-sm font-medium">
          Mi perfil
      </legend>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="grid gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} disabled/>
                    </FormControl>
                    <FormMessage className="text-white/70"/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage className="text-white/70"/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className='text-white'>Contraseña Actual</FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="******" type="password" {...field} />
                    </FormControl>
                    <FormMessage className="text-white/70" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className='text-white'>Nueva Contraseña</FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="******" type="password" {...field} />
                    </FormControl>
                    <FormMessage className="text-white/70" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className='text-white'>Reingrese la Contraseña</FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="******" type="password" {...field} />
                    </FormControl>
                    <FormMessage className="text-white/70" />
                  </FormItem>
                )}
              />
            <Button type="submit" className="justify-self-start">
              Editar Perfil
            </Button>
          </CardContent>
        </form>
      </Form>
    </fieldset>
  );
}
