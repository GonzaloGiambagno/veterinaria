import { ToogleThemes } from "@/components/ui/toogleThemes";

export default function Navbar() {
  return (
    <div className="border flex flex-row p-2 rounded-xl bg-muted">
        <div className="flex w-full justify-end">
            <ToogleThemes />
        </div>
    </div>
  );
}