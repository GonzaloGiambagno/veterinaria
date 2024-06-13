import { ToogleThemes } from "@/components/ui/toogleThemes";
import BreadcrumbDynamic from '@/components/DashboardLayout/BreadcrumbD'

export default function Navbar() {
  return (
    <div className="border flex flex-row p-2 rounded-xl bg-muted items-center px-4 sticky top-2">
      <div className="flex-1">
        <BreadcrumbDynamic />
      </div>
      <div className="flex">
        <ToogleThemes />
      </div>
    </div>
  );
}