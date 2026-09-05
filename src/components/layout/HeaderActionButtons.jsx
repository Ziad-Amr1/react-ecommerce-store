import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  BellDot,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { adminNavigation } from "@/config/navigation";

export default function HeaderActionButtons() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const isDark = theme === "dark";

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full cursor-pointer"
            aria-label={t("navigation.notifications")}
          >
            <BellDot size={20} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-4 py-2">
              {t("navigation.notificationsPanel.title")}
            </DropdownMenuLabel>

            <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
              <BellDot
                size={28}
                className="text-(--color-supporting-decorative)"
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-(--color-text-primary)">
                {t("navigation.notificationsPanel.emptyTitle")}
              </p>
              <p className="text-xs text-(--color-text-secondary)">
                {t("navigation.notificationsPanel.emptyMessage")}
              </p>
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        className="rounded-full cursor-pointer"
        onClick={toggleTheme}
        aria-pressed={isDark}
        title={isDark ? t("navigation.theme.switchToLight") : t("navigation.theme.switchToDark")}
      >
        {isDark ? (
          <Moon size={20} aria-label={t("navigation.theme.switchToLight")} />
        ) : (
          <Sun size={20} aria-label={t("navigation.theme.switchToDark")} />
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-(--color-link) text-(--color-on-link) text-sm select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-2"
            aria-label={t("navigation.accountDropdown")}
          >
            <span className="size-6 rounded-full bg-(--color-on-link)/20 flex items-center justify-center text-xs font-bold">
              A
            </span>
            <span>{t("navigation.roleAdmin")}</span>
            <ChevronDown size={14} aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t("navigation.account")}</DropdownMenuLabel>
          <DropdownMenuGroup>
            {adminNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <DropdownMenuItem key={item.path} asChild>
                  <Link to={item.path}>
                    <Icon size={16} />
                    {t(item.labelKey)}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

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
        <p role="alert" className="text-xs text-(--color-error)">
          {logoutError}
        </p>
      )}
    </div>
  );
}
