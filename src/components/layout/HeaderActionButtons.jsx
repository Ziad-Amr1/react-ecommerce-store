import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  BellDot,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Loader2,
  Store,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { getUserIdentity } from "@/features/auth/utils/userIdentity";

export default function HeaderActionButtons() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const identity = getUserIdentity(user);
  const identityInitial = identity ? identity.charAt(0).toUpperCase() : "A";

  const avatar =
    typeof user?.avatar === "string" && user.avatar.trim()
      ? user.avatar.trim()
      : null;

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

  function handleBackToStore() {
    navigate("/");
  }

  return (
    <>
      <div className="relative flex items-center gap-1.5 sm:gap-2 md:gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 cursor-pointer rounded-full"
              aria-label={t("navigation.notifications")}
            >
              <BellDot size={20} aria-hidden="true" />
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

        {/* Theme */}
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 cursor-pointer rounded-full"
          onClick={toggleTheme}
          aria-pressed={isDark}
          aria-label={
            isDark
              ? t("navigation.theme.switchToLight")
              : t("navigation.theme.switchToDark")
          }
          title={
            isDark
              ? t("navigation.theme.switchToLight")
              : t("navigation.theme.switchToDark")
          }
        >
          {isDark ? (
            <Moon size={20} aria-hidden="true" />
          ) : (
            <Sun size={20} aria-hidden="true" />
          )}
        </Button>

        {/* Account */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex shrink-0 cursor-pointer select-none items-center gap-2 rounded-full bg-(--color-link) px-3 py-2 text-sm text-(--color-on-link) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-2"
              aria-label={t("navigation.accountDropdown")}
            >
              <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--color-on-link)/20 text-xs font-bold">
                {avatar ? (
                  <img src={avatar} alt="" className="size-full object-cover" />
                ) : (
                  identityInitial
                )}
              </span>

              <span
                className="hidden max-w-36 truncate text-sm font-semibold md:inline"
                title={identity ?? undefined}
              >
                {identity ?? t("navigation.roleAdmin")}
              </span>

              <ChevronDown size={14} aria-hidden="true" className="shrink-0" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {/* Mobile-only Store action */}
            <DropdownMenuItem
              className="cursor-pointer md:hidden"
              onSelect={handleBackToStore}
            >
              <Store size={16} aria-hidden="true" />
              <span>{t("navigation.backToStore")}</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="md:hidden" />

            <DropdownMenuLabel>{t("navigation.account")}</DropdownMenuLabel>

            <DropdownMenuGroup>
              <DropdownMenuLabel className="cursor-default gap-2 font-normal">
                <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--color-surface-secondary) text-xs font-bold">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    identityInitial
                  )}
                </span>

                <span className="flex min-w-0 flex-col">
                  <span className="max-w-40 truncate text-sm font-medium">
                    {identity ?? t("navigation.roleAdmin")}
                  </span>

                  <span className="text-xs text-(--color-text-secondary)">
                    {t("navigation.roleAdmin")}
                  </span>
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              variant="destructive"
              onSelect={handleLogout}
              disabled={isLoggingOut}
              aria-busy={isLoggingOut}
              className="cursor-pointer"
            >
              {isLoggingOut ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <LogOut size={16} aria-hidden="true" />
              )}

              <span>
                {isLoggingOut
                  ? t("auth.logout.loading")
                  : t("auth.logout.label")}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Desktop-only Store button */}
        <Button
          variant="outline"
          onClick={handleBackToStore}
          aria-label={t("navigation.backToStore")}
          className="hidden shrink-0 cursor-pointer items-center gap-2 rounded-full text-sm md:flex"
        >
          <Store size={20} aria-hidden="true" />
          <span>{t("navigation.backToStore")}</span>
        </Button>

        {/* Logout error */}
        {logoutError && (
          <p
            role="alert"
            className="absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-(--color-surface) px-2 py-1 text-xs text-(--color-error) shadow-sm"
          >
            {logoutError}
          </p>
        )}
      </div>
    </>
  );
}
