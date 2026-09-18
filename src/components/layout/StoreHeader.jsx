import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import {
  Moon,
  Sun,
  ShoppingCart,
  UserRound,
  Menu,
  House,
  ShoppingBag,
  Info,
  Package,
  Heart,
  ShieldCheck,
  Languages,
  ChevronRight,
  Bell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import useTheme from "@/hooks/useTheme";

import { useWishlist } from "@/contexts/WishlistContext";
import ComingSoonButton from "@/features/landing/components/ComingSoonButton";

import useNotifications from "@/hooks/useNotifications"
import { formatItemCount } from "@/features/cart/cartUtils";
import { supportedLanguages, setLanguage } from "@/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationDropdown from "./NotificationDropdown";

export default function StoreHeader() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { cart } = useCart();

  const { wishlistItems } = useWishlist();

  const { unreadCount } = useNotifications();

  const { pathname } = useLocation();
  const isDark = theme === "dark";
  const isAdmin = user?.role === "admin";
  const isHomeActive = pathname === "/";
  const isProductsActive = pathname.startsWith("/products");
  const isAboutActive = pathname.startsWith("/about");
  const isMyOrdersActive = pathname.startsWith("/my-orders");
  const isWishlistActive = pathname.startsWith("/wishlist");
  const isNotificationsActive = pathname.startsWith("/notifications");
  const isCartActive = pathname.startsWith("/cart");

  const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;

  const userImage = user?.avatar || user?.image || user?.profileImage || user?.photoUrl;
  const userInitials = (user?.username || user?.name || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-(--z-nav) border-b bg-(--color-surface)">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8 py-3">
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
          <Button
            asChild
            variant="ghost"
            className="rounded-full cursor-pointer"
            aria-current={isAboutActive ? "page" : undefined}
          >
            <Link
              to="/about"
              className={isAboutActive ? "font-semibold text-(--color-primary)" : ""}
            >
              {t("store.header.nav.about")}
            </Link>
          </Button>

          {user && (
            <>
              <Button
                asChild
                variant="ghost"
                className="rounded-full cursor-pointer"
                aria-current={isMyOrdersActive ? "page" : undefined}
              >
                <Link
                  to="/my-orders"
                  className={isMyOrdersActive ? "font-semibold text-(--color-primary)" : ""}
                >
                  {t("store.header.nav.myOrders", "My Orders")}
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="rounded-full cursor-pointer"
                aria-current={isWishlistActive ? "page" : undefined}
              >
                <Link
                  to="/wishlist"
                  className={isWishlistActive ? "font-semibold text-(--color-primary)" : ""}
                >
                  {t("store.header.nav.wishlist", "Wishlist")}
                </Link>
              </Button>
            </>
          )}
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

          {/* Desktop-only Language Switcher */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* Desktop-only Theme Switcher */}
          <div className="hidden md:block">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full cursor-pointer"
                  onClick={toggleTheme}
                  aria-pressed={isDark}
                  aria-label={
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
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {isDark
                  ? t("navigation.theme.switchToLight")
                  : t("navigation.theme.switchToDark")}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Desktop-only Notifications Switcher Dropdown */}
          <div className="hidden md:block">
            <NotificationDropdown />
          </div>

          {/* Cart Icon Button (Visible on both desktop & mobile header) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="outline"
                size="icon"
                className="rounded-full cursor-pointer"
                aria-current={isCartActive ? "page" : undefined}
              >
                <Link
                  to="/cart"
                  aria-label={
                    cart.itemCount > 0
                      ? t("store.header.cartWithCount", { count: cart.itemCount })
                      : t("store.header.cart")
                  }
                  className={`relative ${isCartActive ? "text-(--color-primary)" : ""}`}
                >
                  <ShoppingCart size={20} aria-hidden="true" />
                  {cart.itemCount > 0 && (
                    <span className="pointer-events-none absolute -top-2 -end-2 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-(--color-error) px-1 text-[10px] font-bold leading-none tabular-nums text-(--color-surface) ring-2 ring-(--color-surface)">
                      {formatItemCount(cart.itemCount)}
                    </span>
                  )}
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {t("store.header.cart")}
            </TooltipContent>
          </Tooltip>

          {/* Desktop-only Profile Avatar */}
          <div className="hidden md:block">
            {user ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="rounded-full cursor-pointer p-0 overflow-hidden size-9"
                  >
                    <Link
                      to="/profile"
                      aria-label={t("store.header.account")}
                    >
                      <Avatar className="size-9">
                        {userImage && (
                          <AvatarImage
                            src={userImage}
                            alt={user?.username || user?.name || t("store.header.account")}
                            className="object-cover"
                          />
                        )}
                        <AvatarFallback className="text-xs font-semibold bg-(--color-surface-secondary) text-(--color-primary)">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {user?.username || user?.name || user?.email || t("store.header.account")}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="rounded-full cursor-pointer"
                  >
                    <Link
                      to="/profile"
                      aria-label={t("store.header.account")}
                    >
                      <UserRound size={20} aria-hidden="true" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {t("store.header.account")}
                </TooltipContent>
              </Tooltip>
            )}
          </div>


          {/* Wishlist Icon Button */}
          <Button
            asChild
            variant="outline"
            size="icon"
            className="rounded-full cursor-pointer"
            aria-current={isWishlistActive ? "page" : undefined}
          >
            <Link
              to="/wishlist"
              aria-label={
                wishlistCount > 0
                  ? t("store.header.wishlistWithCount", { count: wishlistCount, defaultValue: `Wishlist, ${wishlistCount} items` })
                  : t("store.header.wishlist", { defaultValue: "Wishlist" })
              }
              title={t("store.header.wishlist", { defaultValue: "Wishlist" })}
              className={`relative cursor-pointer ${isWishlistActive ? "text-(--color-primary)" : ""}`}
            >
              <Heart size={20} aria-hidden="true" />
              {wishlistCount > 0 && (
                <span className="pointer-events-none absolute -top-2 -end-2 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-(--color-primary) px-1 text-[10px] font-bold leading-none tabular-nums text-white ring-2 ring-(--color-surface)">
                  {formatItemCount(wishlistCount)}
                </span>
              )}
            </Link>
          </Button>

          {/* Cart Icon Button */}
          <Button
            asChild
            variant="outline"
            size="icon"
            className="rounded-full cursor-pointer"
            aria-current={isCartActive ? "page" : undefined}
          >
            <Link
              to="/cart"
              aria-label={
                cart.itemCount > 0
                  ? t("store.header.cartWithCount", { count: cart.itemCount })
                  : t("store.header.cart")
              }
              title={t("store.header.cart")}
              className={`relative ${isCartActive ? "text-(--color-primary)" : ""}`}
            >
              <ShoppingCart size={20} aria-hidden="true" />
              {cart.itemCount > 0 && (
                <span className="pointer-events-none absolute -top-2 -end-2 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-(--color-error) px-1 text-[10px] font-bold leading-none tabular-nums text-(--color-surface) ring-2 ring-(--color-surface)">
                  {formatItemCount(cart.itemCount)}
                </span>
              )}
            </Link>
          </Button>

          {/* Mobile navigation sidebar trigger on the right */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full cursor-pointer md:hidden shrink-0"
                aria-label={t("common.menu", "Menu")}
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96 flex flex-col p-0 gap-0 border-l">
              <SheetHeader className="p-4 border-b flex flex-row items-center justify-between text-start">
                <SheetTitle className="flex items-center gap-2.5 font-display text-lg font-bold">
                  <img src="/favicon.ico" alt="" className="size-7 object-contain" />
                  <span>{t("brand.name")}</span>
                </SheetTitle>
              </SheetHeader>


              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {/* 1. User Header / Profile Banner */}
                {user ? (
                  <SheetClose asChild>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 p-3 rounded-2xl bg-accent/40 hover:bg-accent/70 border transition-all cursor-pointer group"
                    >
                      <Avatar className="size-11 border-2 border-background shadow-xs shrink-0">
                        {userImage && <AvatarImage src={userImage} className="object-cover" />}
                        <AvatarFallback className="text-sm font-bold bg-primary text-primary-foreground">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {user?.username || user?.name || user?.email}
                          </p>
                          {isAdmin && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary shrink-0">
                              {t("navigation.roleAdmin")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform rtl:rotate-180" />
                    </Link>
                  </SheetClose>
                ) : (
                  <div className="p-4 rounded-2xl bg-accent/30 border space-y-2">
                    <p className="text-xs text-muted-foreground">{t("profile.anonymous.description", "Sign in to access your profile, orders, and wishlist.")}</p>
                    <SheetClose asChild>
                      <Button asChild size="sm" className="w-full rounded-xl cursor-pointer">
                        <Link to="/login">{t("profile.anonymous.signIn", "Sign In")}</Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}

                <Separator />

                {/* 2. Store Navigation Section */}
                <div className="space-y-1.5">
                  <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    {t("store.header.navLabel", "Navigation")}
                  </p>
                  <div className="flex flex-col gap-1">
                    <SheetClose asChild>
                      <Button
                        asChild
                        variant={isHomeActive ? "secondary" : "ghost"}
                        className={`justify-start gap-3 rounded-xl h-10 px-3 cursor-pointer ${isHomeActive ? "font-semibold text-primary bg-primary/10" : "text-foreground"}`}
                      >
                        <Link to="/">
                          <House className={`size-4 shrink-0 ${isHomeActive ? "text-primary" : "text-muted-foreground"}`} />
                          <span>{t("store.header.nav.home")}</span>
                        </Link>
                      </Button>
                    </SheetClose>

                    <SheetClose asChild>
                      <Button
                        asChild
                        variant={isProductsActive ? "secondary" : "ghost"}
                        className={`justify-start gap-3 rounded-xl h-10 px-3 cursor-pointer ${isProductsActive ? "font-semibold text-primary bg-primary/10" : "text-foreground"}`}
                      >
                        <Link to="/products">
                          <ShoppingBag className={`size-4 shrink-0 ${isProductsActive ? "text-primary" : "text-muted-foreground"}`} />
                          <span>{t("store.header.nav.shop")}</span>
                        </Link>
                      </Button>
                    </SheetClose>

                    <SheetClose asChild>
                      <Button
                        asChild
                        variant={isAboutActive ? "secondary" : "ghost"}
                        className={`justify-start gap-3 rounded-xl h-10 px-3 cursor-pointer ${isAboutActive ? "font-semibold text-primary bg-primary/10" : "text-foreground"}`}
                      >
                        <Link to="/about">
                          <Info className={`size-4 shrink-0 ${isAboutActive ? "text-primary" : "text-muted-foreground"}`} />
                          <span>{t("store.header.nav.about")}</span>
                        </Link>
                      </Button>
                    </SheetClose>

                    <SheetClose asChild>
                      <Button
                        asChild
                        variant={isNotificationsActive ? "secondary" : "ghost"}
                        className={`justify-start gap-3 rounded-xl h-10 px-3 cursor-pointer ${isNotificationsActive ? "font-semibold text-primary bg-primary/10" : "text-foreground"}`}
                      >
                        <Link to="/notifications" className="w-full flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Bell className={`size-4 shrink-0 ${isNotificationsActive ? "text-primary" : "text-muted-foreground"}`} />
                            <span>{t("notifications.title", "Notifications")}</span>
                          </div>
                          {unreadCount > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                              {formatItemCount(unreadCount)}
                            </span>
                          )}
                        </Link>
                      </Button>
                    </SheetClose>
                  </div>
                </div>

                {/* 3. Account Section */}
                {user && (
                  <>
                    <Separator />
                    <div className="space-y-1.5">
                      <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                        {t("store.header.account", "Account")}
                      </p>
                      <div className="flex flex-col gap-1">
                        <SheetClose asChild>
                          <Button
                            asChild
                            variant={isMyOrdersActive ? "secondary" : "ghost"}
                            className={`justify-start gap-3 rounded-xl h-10 px-3 cursor-pointer ${isMyOrdersActive ? "font-semibold text-primary bg-primary/10" : "text-foreground"}`}
                          >
                            <Link to="/my-orders">
                              <Package className={`size-4 shrink-0 ${isMyOrdersActive ? "text-primary" : "text-muted-foreground"}`} />
                              <span>{t("store.header.nav.myOrders", "My Orders")}</span>
                            </Link>
                          </Button>
                        </SheetClose>

                        <SheetClose asChild>
                          <Button
                            asChild
                            variant={isWishlistActive ? "secondary" : "ghost"}
                            className={`justify-start gap-3 rounded-xl h-10 px-3 cursor-pointer ${isWishlistActive ? "font-semibold text-primary bg-primary/10" : "text-foreground"}`}
                          >
                            <Link to="/wishlist">
                              <Heart className={`size-4 shrink-0 ${isWishlistActive ? "text-primary" : "text-muted-foreground"}`} />
                              <span>{t("store.header.nav.wishlist", "Wishlist")}</span>
                            </Link>
                          </Button>
                        </SheetClose>

                        <SheetClose asChild>
                          <Button
                            asChild
                            variant={pathname === "/profile" ? "secondary" : "ghost"}
                            className={`justify-start gap-3 rounded-xl h-10 px-3 cursor-pointer ${pathname === "/profile" ? "font-semibold text-primary bg-primary/10" : "text-foreground"}`}
                          >
                            <Link to="/profile">
                              <UserRound className={`size-4 shrink-0 ${pathname === "/profile" ? "text-primary" : "text-muted-foreground"}`} />
                              <span>{t("profile.title", "Profile Settings")}</span>
                            </Link>
                          </Button>
                        </SheetClose>
                      </div>
                    </div>
                  </>
                )}

                {/* 4. Admin Section */}
                {isAdmin && (
                  <>
                    <Separator />
                    <div className="space-y-1.5">
                      <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                        {t("common.admin", "Administration")}
                      </p>
                      <SheetClose asChild>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full justify-start gap-3 rounded-xl h-10 px-3 cursor-pointer border-primary/30 text-primary hover:bg-primary/10"
                        >
                          <Link to="/admin">
                            <ShieldCheck className="size-4 shrink-0 text-primary" />
                            <span>{t("store.header.adminLink")}</span>
                          </Link>
                        </Button>
                      </SheetClose>
                    </div>
                  </>
                )}

                <Separator />

                {/* 5. Preferences Section: Theme & Language */}
                <div className="space-y-3">
                  <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    {t("languages.switcherLabel", "Languages")} & {t("navigation.theme.title", "Theme")}
                  </p>

                  {/* Theme Switcher Segment */}
                  <div className="p-1 rounded-xl bg-accent/40 border flex items-center gap-1">
                    <Button
                      variant={!isDark ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => isDark && toggleTheme()}
                      className="flex-1 rounded-lg text-xs gap-2 cursor-pointer"
                    >
                      <Sun className="size-3.5" />
                      <span>{t("navigation.theme.light", "Light")}</span>
                    </Button>
                    <Button
                      variant={isDark ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => !isDark && toggleTheme()}
                      className="flex-1 rounded-lg text-xs gap-2 cursor-pointer"
                    >
                      <Moon className="size-3.5" />
                      <span>{t("navigation.theme.dark", "Dark")}</span>
                    </Button>
                  </div>

                  {/* Languages Grid */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-muted-foreground">
                      <Languages className="size-3.5" />
                      <span>{t("languages.switcherLabel", "Select Language")}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {supportedLanguages.map((lng) => {
                        const current = i18n.resolvedLanguage ?? i18n.language;
                        const isCurrent = lng === current;
                        return (
                          <Button
                            key={lng}
                            variant={isCurrent ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => setLanguage(lng)}
                            className={`rounded-xl cursor-pointer text-xs justify-start h-9 ${isCurrent ? "font-semibold text-primary border-primary bg-primary/10" : ""}`}
                          >
                            {t(`languages.${lng}`, lng.toUpperCase())}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}