import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Moon, Sun, ShoppingCart, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import ComingSoonButton from "@/pages/landing/components/ComingSoonButton";

export default function StoreHeader() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";
  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-(--z-nav) border-b bg-(--color-surface)">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img
            src="/favicon.ico"
            alt={t("brand.logoAlt")}
            className="h-8 object-contain"
          />
          <span className="font-(--font-display) text-lg font-bold text-(--color-text-primary)">
            {t("brand.name")}
          </span>
        </Link>

        <nav
          aria-label={t("store.header.navLabel")}
          className="hidden items-center gap-1 md:flex"
        >
          <Button asChild variant="ghost" className="rounded-full cursor-pointer">
            <Link to="/">{t("store.header.nav.home")}</Link>
          </Button>
          <ComingSoonButton variant="ghost">
            {t("store.header.nav.shop")}
          </ComingSoonButton>
          <ComingSoonButton variant="ghost">
            {t("store.header.nav.about")}
          </ComingSoonButton>
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden rounded-full cursor-pointer sm:inline-flex"
            >
              <Link to="/admin">{t("store.header.adminLink")}</Link>
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            className="rounded-full cursor-pointer"
            onClick={toggleTheme}
            aria-pressed={isDark}
            title={
              isDark
                ? t("navigation.theme.switchToLight")
                : t("navigation.theme.switchToDark")
            }
          >
            {isDark ? (
              <Moon
                size={20}
                aria-label={t("navigation.theme.switchToLight")}
              />
            ) : (
              <Sun size={20} aria-label={t("navigation.theme.switchToDark")} />
            )}
          </Button>

          <ComingSoonButton variant="outline" size="icon" className="rounded-full">
            <ShoppingCart size={20} aria-hidden="true" />
            <span className="sr-only">{t("store.header.cart")}</span>
          </ComingSoonButton>

          <ComingSoonButton variant="outline" size="icon" className="rounded-full">
            <UserRound size={20} aria-hidden="true" />
            <span className="sr-only">{t("store.header.account")}</span>
          </ComingSoonButton>
        </div>
      </div>
    </header>
  );
}