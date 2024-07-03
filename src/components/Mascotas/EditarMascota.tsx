import * as React from "react";
import { useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useCliente } from "@/context/ClienteProvider";
import { Mascota } from "@/types/types";
import moment from "moment";

const formSchema = z.object({
  nombre: z.string(),
  especie: z.string(),
  peso: z.number(),
  fecha_nacimiento: z.string(),
});

const EditarMascota = ({ id }: { id: number }) => {
  const { mascotas, updateMascota, fetchMascotas } = useCliente();

  const mascota = mascotas.find((mascota) => mascota.id === id);

  const form = useForm<Mascota>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: mascota?.nombre,
      especie: mascota?.especie,
      peso: mascota?.peso,
      fecha_nacimiento: mascota?.fecha_nacimiento,
    },
  });
  
  const handleSubmit = (data: Mascota) => {
    data.fecha_nacimiento = moment(data.fecha_nacimiento).utc().format("YYYY-MM-DD");
    updateMascota(id, data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="xsm">
          <Pencil className="w-4 h-4 p-0 m-0" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>Editar mascota</DialogTitle>
          <DialogDescription>Formulario para realizar cambios de la mascota</DialogDescription>
        </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="py-4 flex flex-col gap-4">
              <div className="flex flex-row gap-2">
                <div className="w-1/2 items-center gap-4">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Controller
                    name="nombre"
                    control={form.control}
                    render={({ field }) => <Input id="nombre" {...field} />}
                  />
                </div>
                <div className="w-1/2 items-center gap-4">
                  <Label htmlFor="especie">Especie</Label>
                  <Controller
                    name="especie"
                    control={form.control}
                    render={({ field }) => <Input id="especie" {...field} />}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <div className="w-1/2 items-center gap-4">
                  <Label htmlFor="peso">Peso</Label>
                  <Controller
                    name="peso"
                    control={form.control}
                    render={({ field }) => <Input id="peso" type="number" {...field} />}
                  />
                </div>
                <div className="w-1/2 items-center gap-4">
                  <Label htmlFor="fecha_nacimiento">Fecha Nacimiento:</Label>
                  <Controller
                    name="fecha_nacimiento"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        id="fecha_nacimiento"
                        type="date"
                        value={moment(field.value).utc().format("YYYY-MM-DD")}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-2 py-2">
                <div className="flex flex-col gap-2 w-1/2">
                  <Label>Nombre y Apellido del dueño</Label>
                  <Input id="clienteApellido" value={`${mascota?.cliente?.apellido}, ${mascota?.cliente?.nombre} `} disabled />
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                  <Label>DNI dueño</Label>
                  <Input id="clienteApellido" value={mascota?.cliente?.dni} disabled />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogTrigger asChild>
                <Button type="submit">Guardar Cambios</Button>
              </DialogTrigger>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarMascota;
