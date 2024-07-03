'use client'

import { useCliente } from "@/context/ClienteProvider";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
  
  export function EliminarCliente({ id }: { id: number }) {
    const { deleteCliente  } = useCliente();


  const handleEliminar = async () => {
    await deleteCliente(id);
    // Aquí podrías añadir lógica adicional después de eliminar el cliente, como refrescar la lista de clientes, etc.
  };
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destroy" size="xsm"><Trash className="w-4 h-4 p-0 m-0"/></Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estas seguro de querer eliminar el cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Una vez eliminado el cliente tambien se borrar toda la información asociada a el mismo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEliminar}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  