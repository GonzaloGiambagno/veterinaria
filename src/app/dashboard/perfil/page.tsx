import type { Metadata } from "next";
import { EditarPerfil } from "@/components/Configuracion/EditarPerfil";
import { PerfilVete } from "@/components/Configuracion/PerfilVete";

export const metadata: Metadata = {
  title: "SGVeterinaria",
  description: "Bienvenidos al sistema de gestion veterinaria",
};


export default function Page() {
  return (
    <div className="flex flex-col gap-4 sm:w-1/2">
        <div className="flex items-center w-full">
          <h1 className="text-lg font-semibold md:text-2xl">Configuración</h1>
        </div>
        
        <PerfilVete />
        <EditarPerfil />

    </div>
  );
}