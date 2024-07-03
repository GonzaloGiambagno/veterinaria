import TabsCliente from "@/components/Clientes/TabsCliente";
import { ClienteProvider } from "@/context/ClienteProvider";

export default function Page() {
  return (
    <ClienteProvider>
      <TabsCliente />
    </ClienteProvider>
  );
}