import { EditarPerfil } from "@/components/Login/EditarPerfil";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 sm:w-1/2">
        <div className="flex items-center w-full">
          <h1 className="text-lg font-semibold md:text-2xl">Configuración</h1>
        </div>

        <EditarPerfil />

    </div>
  );
}