import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { BellDot, Sun, LogOut, Loader2 } from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function HeaderActionButtons() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutError("");
    try {
      await logout();
      navigate("/login");
    } catch {
      setLogoutError("Logout failed. Please try again.");
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="icon" className="rounded-full">
        <BellDot size={20} aria-label="Notifications" />
      </Button>

      <Button variant="outline" size="icon" className="rounded-full">
        <Sun size={20} aria-label="Toggle theme" />
      </Button>

      <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-link)] text-white text-sm select-none">
        <span className="size-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
          A
        </span>
        Admin
      </div>

      <Button
        variant="destructive"
        onClick={handleLogout}
        disabled={isLoggingOut}
        aria-busy={isLoggingOut}
        className="px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer"
      >
        {isLoggingOut ? (
          <Loader2 size={20} className="animate-spin" aria-label="Logging out" />
        ) : (
          <LogOut size={20} aria-label="Logout" />
        )}
        <span className="hidden md:inline-flex">
          {isLoggingOut ? "Logging out..." : "Logout"}
        </span>
      </Button>

      {logoutError && (
        <p role="alert" className="text-xs text-[var(--color-error)]">
          {logoutError}
        </p>
      )}
    </div>
  );
}
