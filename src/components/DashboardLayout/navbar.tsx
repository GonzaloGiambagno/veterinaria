import { ToogleThemes } from "@/components/ui/toogleThemes";

export default function Navbar() {
  return (
    <div className="border-b sm:ml-[270px] flex flex-row p-2">
        
        <div className="flex w-full justify-end">
            <ToogleThemes />
        </div>
    </div>
  );
}