"use client";

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
import { useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  nombre: z.string(),
  direccion: z.string(),
})

export function PerfilVete() {
  const { data: session } = useSession();
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      direccion: "",
    },
  });

  useEffect(() => {
    if (session && session.user.veterinaria) {
      const { nombre, direccion } = session.user.veterinaria;
      form.setValue("nombre", nombre || "");
      form.setValue("direccion", direccion || "" );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch("/api/veterinaria/edit", {
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
          description: "Cambio de datos exitoso",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Hubo un error al editar los datos de la veterinaria",
        })
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
    }
  };

  return (
    <fieldset className="grid rounded-lg border p-4">
      <legend className=" px-1 text-sm font-medium">
          Veterinaria
      </legend>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
          <CardContent className="grid space-y-5">
            <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel className="">Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field}/>
                      </FormControl>
                      <FormMessage className=""/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel className="">Direccion</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage className=""/>
                    </FormItem>
                  )}
                />
              </div>
            <Button type="submit" className="justify-self-start">
              Editar veterinaria
            </Button>
          </CardContent>
        </form>
      </Form>
    </fieldset>
  );
}
