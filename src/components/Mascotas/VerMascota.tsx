import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar, PawPrint } from "lucide-react";
import { useCliente } from "@/context/ClienteProvider";
import Image from "next/image";
import moment from 'moment';

const VerMascota = ({ id }: { id: number }) => {
    const { mascotas, updateMascota, fetchMascotas } = useCliente();    

    const mascotasCliente = mascotas.filter((mascota) => mascota.clienteId === id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="xsm">
          <PawPrint className="w-4 h-4 p-0 m-0" />
        </Button>
      </DialogTrigger>
      {mascotasCliente.length > 0 ? (
        mascotasCliente.map((mascota) => (
          <DialogContent key={mascota.id} className="sm:max-w-1/2 border border-b-2 border-black">
            <div className="flex flex-row gap-3">
              {mascota?.fotoMascota ? (
                <Image
                  alt=""
                  className="aspect-square rounded-md object-cover"
                  height="100"
                  src={mascota?.fotoMascota}
                  width="100"
                />
              ) : (
                <p>No hay imagen cargada</p>
              )}
              <div className="flex flex-col">
                <p className="font-bold text-xl">{mascota?.nombre}</p>
                <p>Fecha nacimiento: <span className="font-bold">{moment(mascota?.fecha_nacimiento).utc().format("DD/MM/YYYY")}</span></p>
                <p>Peso: <span className="font-bold">{mascota?.peso}Kg</span></p>
                <p>Especie: <span className="font-bold">{mascota?.especie}</span></p>
              </div>
            </div>
            <DialogFooter>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Ver Historial
                </Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Vacunas
                </Button>
              </DialogTrigger>
            </DialogFooter>
          </DialogContent>
        ))
      ) : (
        <p>No se encontraron mascotas para este cliente.</p>
      )}
    </Dialog>
  );
}

export default VerMascota;
