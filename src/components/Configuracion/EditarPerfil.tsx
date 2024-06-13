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
import { useToast } from "@/components/ui/use-toast"
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
  const { toast } = useToast()

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        toast({
          description: "Cambio de contraseña exitoso",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Hubo un error al cambiar de contraseña",
        })
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
    }
  };

  return (
    <fieldset className="grid rounded-lg border p-4">
      <legend className=" px-1 text-sm font-medium">
          Mi perfil
      </legend>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
          <CardContent className="grid space-y-5">
            <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel className="">Usuario</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} disabled/>
                      </FormControl>
                      <FormMessage className=""/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newEmail"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel className="">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage className=""/>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className=''>Contraseña Actual</FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="******" type="password" {...field} />
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className=''>Nueva contraseña</FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="******" type="password" {...field} />
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Reingrese la nueva contraseña</FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="******" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
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
