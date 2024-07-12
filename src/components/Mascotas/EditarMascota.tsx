import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';
import { useCliente } from '@/context/ClienteProvider';
import { Mascota } from '@/types/types';
import moment from 'moment';
import Image from 'next/image';
import { z } from 'zod';
import { useState } from 'react'

const formSchema = z.object({
  nombre: z.string(),
  especie: z.string(),
  peso: z.number(),
  fecha_nacimiento: z.string(),
  fotoMascota: z.string().optional(),
});

const EditarMascota = ({ id }: { id: number }) => {
  const { mascotas, updateMascota } = useCliente();
  const [filePath, setFilePath] = useState();

  const mascota = mascotas.find((mascota) => mascota.id === id);

  const { control, handleSubmit } = useForm<Mascota>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: mascota?.nombre || '',
      especie: mascota?.especie || '',
      peso: mascota?.peso || 0,
      fecha_nacimiento: mascota?.fecha_nacimiento || '',
      fotoMascota: mascota?.fotoMascota || '',
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
  
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error("Upload failed");
        }
  
        const result = await response.json();
        if (result.success) {
          setFilePath(result.location); 
        } else {
          console.error("Upload failed:", result.message);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };
  

  const onSubmit = (data: Mascota) => {
    data.fecha_nacimiento = moment(data.fecha_nacimiento).utc().format('YYYY-MM-DD');
    if (filePath) {
      data.fotoMascota = filePath;
    }
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-row justify-between items-end mb-2'>
            {mascota?.fotoMascota ? (
                <Image
                  alt=""
                  className="aspect-square rounded-lg object-cover"
                  height="84"
                  src={mascota?.fotoMascota}
                  width="84"
                />
              ) : (
                <p>No hay imagen cargada</p>
              )}
            <div className="flex flex-col gap-2">
              <Label>Cambiar foto de la mascota:</Label>
              <Input type="file" name="file" className="" onChange={handleFileChange} />
            </div>
          </div>
          <div className="py-4 flex flex-col gap-4">
            <div className="flex flex-row gap-2">
              <div className="w-1/2 items-center gap-4">
                <Label htmlFor="nombre">Nombre</Label>
                <Controller
                  name="nombre"
                  control={control}
                  render={({ field }) => <Input id="nombre" {...field} />}
                />
              </div>
              <div className="w-1/2 items-center gap-4">
                <Label htmlFor="especie">Especie</Label>
                <Controller
                  name="especie"
                  control={control}
                  render={({ field }) => <Input id="especie" {...field} />}
                />
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="w-1/2 items-center gap-4">
                <Label htmlFor="peso">Peso</Label>
                <Controller
                  name="peso"
                  control={control}
                  render={({ field }) => <Input id="peso" type="number" {...field} />}
                />
              </div>
              <div className="w-1/2 items-center gap-4">
                <Label htmlFor="fecha_nacimiento">Fecha Nacimiento:</Label>
                <Controller
                  name="fecha_nacimiento"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fecha_nacimiento"
                      type="date"
                      value={moment(field.value).utc().format('YYYY-MM-DD')}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-row gap-2 py-2">
              <div className="flex flex-col gap-2 w-1/2">
                <Label>Nombre y Apellido del dueño</Label>
                <Input
                  id="clienteApellido"
                  value={`${mascota?.cliente?.apellido}, ${mascota?.cliente?.nombre} `}
                  disabled
                />
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
