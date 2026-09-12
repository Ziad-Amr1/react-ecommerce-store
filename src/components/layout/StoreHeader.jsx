import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { Moon, Sun, ShoppingCart, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import ComingSoonButton from "@/features/landing/components/ComingSoonButton";
import LanguageSwitcher from "./LanguageSwitcher";

export default function StoreHeader() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isDark = theme === "dark";
  const isAdmin = user?.role === "admin";
  const isHomeActive = pathname === "/";
  const isProductsActive = pathname.startsWith("/products");
  const isCartActive = pathname.startsWith("/cart");

  return (
    <header className="sticky top-0 z-(--z-nav) border-b bg-(--color-surface)">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img
            src="/favicon.ico"
            alt={t("brand.logoAlt")}
            className="size-8 shrink-0 object-contain"
          />
          <span className="font-(--font-display) text-lg font-bold text-(--color-text-primary)">
            {t("brand.name")}
          </span>
        </Link>

        <nav
          aria-label={t("store.header.navLabel")}
          className="hidden items-center gap-1 md:flex"
        >
          <Button
            asChild
            variant="ghost"
            className="rounded-full cursor-pointer"
            aria-current={isHomeActive ? "page" : undefined}
          >
            <Link
              to="/"
              className={isHomeActive ? "font-semibold text-(--color-primary)" : ""}
            >
              {t("store.header.nav.home")}
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="rounded-full cursor-pointer"
            aria-current={isProductsActive ? "page" : undefined}
          >
            <Link
              to="/products"
              className={
                isProductsActive ? "font-semibold text-(--color-primary)" : ""
              }
            >
              {t("store.header.nav.shop")}
            </Link>
          </Button>
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

          <LanguageSwitcher />

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

          <Button
            asChild
            variant="outline"
            size="icon"
            className="rounded-full cursor-pointer"
            aria-current={isCartActive ? "page" : undefined}
          >
            <Link
              to="/cart"
              aria-label={t("store.header.cart")}
              title={t("store.header.cart")}
              className={isCartActive ? "text-(--color-primary)" : ""}
            >
              <ShoppingCart size={20} aria-hidden="true" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="icon" className="rounded-full cursor-pointer">
            <Link to="/profile" aria-label={t("store.header.account")} title={t("store.header.account")}>
              <UserRound size={20} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}