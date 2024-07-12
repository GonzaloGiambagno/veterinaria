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
import EditarCliente from "./EditarCliente";
import { EliminarCliente } from "./EliminarCliente";
import VerMascota from "../Mascotas/VerMascota";

export const TablaClientes = () => {
  const { clientes, fetchClientes } = useCliente();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.dni.toString().includes(searchTerm)
  );

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Clientes</CardTitle>
          <CardDescription className="mt-1">
            Estos son los clientes de la veterinaria:
          </CardDescription>
        </div>
        <div className="flex flex-row">
          <Input
            type="search"
            placeholder="Buscar por nombre, apellido o documento"
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
              <TableHead className="">Apellido</TableHead>
              <TableHead className="">Nombre</TableHead>
              <TableHead className="">Email</TableHead>
              <TableHead className="">DNI</TableHead>
              <TableHead className="">Telefono</TableHead>
              <TableHead className="">Telefono 2</TableHead>
              <TableHead className="">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(filteredClientes) && filteredClientes.length > 0 ? (
              filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.apellido}</TableCell>
                  <TableCell>{cliente.nombre}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.dni}</TableCell>
                  <TableCell>{cliente.telefono}</TableCell>
                  <TableCell>{cliente.telefono2 || "N/A"}</TableCell>
                  <TableCell><EditarCliente id={cliente.id}/><EliminarCliente id={cliente.id}/><VerMascota id={cliente.id}/></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>No hay clientes disponibles</TableCell>
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
