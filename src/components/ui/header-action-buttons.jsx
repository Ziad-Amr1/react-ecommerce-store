import { Button } from "@/components/ui/button";
import { BellDot, Sun, LogOut } from "lucide-react";

export default function HeaderActionButtons() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="icon" className="rounded-full">
        <BellDot size={20} aria-label="Notifications" />
      </Button>

      <Button variant="outline" size="icon" className="rounded-full">
        <Sun size={20} aria-label="Toggle theme" />
      </Button>

      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-link)] text-white text-sm select-none">
        <span className="size-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
          A
        </span>
        Admin
      </div>

      <Button className="bg-[var(--color-error)] hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer">
        <LogOut size={20} aria-label="Logout" /> Logout
      </Button>
    </div>
  );
}
