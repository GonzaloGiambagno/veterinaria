'use client';

import { useCliente } from "@/context/ClienteProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import EditarMascota from "./EditarMascota";
import { EliminarMascota } from "./EliminarMascota";
import moment from "moment";
import Image from "next/image";
import VerMascota from "./VerMascota";

export const TablaMascotas = () => {
  const { mascotas, fetchMascotas } = useCliente();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMascotas();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredMascota = mascotas.filter(mascota =>
    mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mascota.cliente?.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mascota.especie.toString().includes(searchTerm)
  );


  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>        
          <CardTitle>Animales</CardTitle>
          <CardDescription className="mt-1">
            Listado de mascotas de la veterinaria:
          </CardDescription>
        </div>
        <div className="flex flex-row">
            <Input
              type="search"
              placeholder="Buscar por nombre, especie o documento"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Especie</TableHead>
              <TableHead>Peso</TableHead>
              <TableHead>Fecha Nacimiento</TableHead>
              <TableHead>Dueño</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(filteredMascota) && filteredMascota.length > 0 ? (
              filteredMascota.map((mascota) => (
                <TableRow key={mascota.id}>
                      <TableCell className="hidden sm:table-cell">
                        { mascota.fotoMascota ? 
                          <Image
                            alt=""
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={mascota.fotoMascota}
                            width="64"
                          /> : <p> -- </p>
                        }
                      </TableCell>
                  <TableCell>{mascota.nombre}</TableCell>
                  <TableCell>{mascota.especie}</TableCell>
                  <TableCell>{mascota.peso}Kg</TableCell>
                  <TableCell>{moment(mascota.fecha_nacimiento).utc().format("DD/MM/YYYY")}</TableCell>
                  <TableCell>{mascota.cliente?.apellido} {mascota.cliente?.nombre}</TableCell>
                  <TableCell><EditarMascota id={mascota.id}/><EliminarMascota id={mascota.id}/></TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>No hay mascotas disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">Paginacion</div>
      </CardFooter>
    </Card>
  );
};
