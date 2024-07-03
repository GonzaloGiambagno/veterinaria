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
import { useToast } from "@/components/ui/use-toast";
import { Cliente } from "@/types/types"

const formSchema = z.object({
  nombre: z.string().optional(),
  apellido: z.string().optional(),
  email: z.string().email().optional(),
  telefono: z.string().optional(),
  telefono2: z.string().optional().nullable(),
  observaciones: z.string().optional(),
});

const EditarCliente = ({ id }: { id: number }) => {
  const { clientes, updateCliente, fetchClientes } = useCliente();

  const cliente = clientes.find(cliente => cliente.id === id);

  const form = useForm<Cliente>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: cliente?.nombre || "",
      apellido: cliente?.apellido || "",
      dni: cliente?.dni || "",
      email: cliente?.email || "",
      telefono: cliente?.telefono || "",
      telefono2: cliente?.telefono2 || "",
      observaciones: cliente?.observaciones || ""
    },
  });

  useEffect(() => {
    fetchClientes(); 
  }, []);

  useEffect(() => {
    if (cliente) {
      form.reset(cliente);
    }
  }, [cliente]);

  const handleSubmit = (data: Cliente) => {
     updateCliente(id, data);
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
          <DialogTitle>Editar cliente</DialogTitle>
          <DialogDescription>Editar el cliente</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="py-4 flex flex-col gap-4">
            <div className="flex flex-row gap-2">
              <div className="w-1/2 items-center gap-4">
                <Label htmlFor="nombre" className="">
                  Nombre
                </Label>
                <Controller
                  name="nombre"
                  control={form.control}
                  render={({ field }) => <Input id="nombre" {...field} />}
                />
              </div>
              <div className="w-1/2 items-center gap-4">
                <Label htmlFor="apellido" className="">
                  Apellido
                </Label>
                <Controller
                  name="apellido"
                  control={form.control}
                  render={({ field }) => <Input id="apellido" {...field} />}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="dni">N° Documento</Label>
              <Controller
                name="dni"
                control={form.control}
                render={({ field }) => <Input id="dni" {...field} />}
              />
            </div>
            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-2 w-1/2">
                <Label htmlFor="telefono">Telefono</Label>
                <Controller
                  name="telefono"
                  control={form.control}
                  render={({ field }) => <Input id="telefono" {...field} />}
                />
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <Label htmlFor="telefono2">Telefono 2</Label>
                <Controller
                  name="telefono2"
                  control={form.control}
                  render={({ field }) => <Input id="telefono2" {...field} />}
                  no-require
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={form.control}
                render={({ field }) => <Input id="email" type="email" {...field} />}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Controller
                name="observaciones"
                control={form.control}
                render={({ field }) => <Input id="observaciones" {...field} />}
              />
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

export default EditarCliente;
