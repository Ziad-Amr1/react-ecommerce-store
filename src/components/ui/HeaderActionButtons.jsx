import { Button } from "@/components/ui/button";
import { Sun, LogOut, Moon } from "lucide-react";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { DropdownMenuIcons } from "../ui/DropdownMenuIcons";
import NotificationsDropdown from "./NotificationsDropdown";

export default function HeaderActionButtons() {
  const { logout } = useAuth();
  const [mode, setMode] = useState("Light");

  function toggleTheme() {
    if (mode === "Light") {
      setMode("Dark");
    } else {
      setMode("Light");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <NotificationsDropdown />

      <Button
        onClick={toggleTheme}
        variant="outline"
        size="icon"
        className="rounded-full"
      >
        {mode === "Light" ? (
          <Sun size={20} aria-label="Light mode" />
        ) : (
          <Moon size={20} aria-label="Dark mode" />
        )}
      </Button>

      <DropdownMenuIcons className="border w-[200px]" />

      <Button
        onClick={logout}
        className="bg-[var(--color-error)] hover:bg-red-600 text-white px-4 py-2 rounded-md px-4 py-2  text-sm flex items-center gap-2 cursor-pointer"
      >
        <LogOut size={20} aria-label="Logout" />
        <span className="hidden md:inline-flex">Logout</span>
      </Button>
    </div>
  );
}
