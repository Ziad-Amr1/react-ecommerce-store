import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { BellDot, Sun, LogOut, Loader2 } from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function HeaderActionButtons() {
  const { t } = useTranslation();
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
      setLogoutError(t("auth.errors.logoutFailed"));
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="icon" className="rounded-full">
        <BellDot size={20} aria-label={t("navigation.notifications")} />
      </Button>

      <Button variant="outline" size="icon" className="rounded-full">
        <Sun size={20} aria-label={t("navigation.toggleTheme")} />
      </Button>

      <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-link)] text-white text-sm select-none">
        <span className="size-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
          A
        </span>
        {t("navigation.roleAdmin")}
      </div>

      <Button
        variant="destructive"
        onClick={handleLogout}
        disabled={isLoggingOut}
        aria-busy={isLoggingOut}
        className="px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer"
      >
        {isLoggingOut ? (
          <Loader2 size={20} className="animate-spin" aria-label={t("auth.logout.loadingLabel")} />
        ) : (
          <LogOut size={20} aria-label={t("auth.logout.label")} />
        )}
        <span className="hidden md:inline-flex">
          {isLoggingOut ? t("auth.logout.loading") : t("auth.logout.label")}
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
