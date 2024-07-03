import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "../ui/button"
import { File, PlusCircle } from "lucide-react"
import { TablaClientes } from "./TablaClientes"
import { TablaMascotas } from "../Mascotas/TablaMascotas"


const TabsCliente = () => {
  return (
    <Tabs defaultValue="clientes">
        <div className="flex items-center">
            <TabsList>
                <TabsTrigger value="clientes">Clientes</TabsTrigger>
                <TabsTrigger value="mascotas">Mascotas</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-7 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Exportar
                  </span>
                </Button>
                <Button size="sm" className="h-7 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Agregar Cliente/mascota
                  </span>
                </Button>
            </div>
        </div>
        <TabsContent value="clientes">
          <TablaClientes />
        </TabsContent>
        <TabsContent value="mascotas">
          <TablaMascotas />
        </TabsContent>

    </Tabs>
)
}

export default TabsCliente