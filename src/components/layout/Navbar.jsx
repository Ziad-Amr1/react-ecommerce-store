import brandLogo from "/brand-logo.webp";
import {
  LogIn,
  UserRoundPlus,
  Heart,
  ShoppingCart,
  Moon,
  Sun,
  Search,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomSearchForm from "@/features/landing/components/CustomSearchForm";
import { Skeleton } from "@/components/ui/skeleton";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { NavLink } from "react-router";
import AvatarDropDown from "@/features/landing/components/AvatarDropDown";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import MyDrawer from "@/features/landing/components/MyDrawer";
import { useTranslation } from "react-i18next";

const navLinks = [
  { labelKey: "navigation.home", path: "/" },
  { labelKey: "navigation.products", path: "/products" },
  { labelKey: "navigation.categories", path: "/categories" },
  { labelKey: "navigation.locations", path: "/locations" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();
  const isDark = theme === "dark";
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);

  function toggleMobileDrawer() {
    setIsDrawerCollapsed((prev) => !prev);
  }

  return (
    <div className="w-full sm:w-[90%] mx-auto bg-[var(--color-background)]">
      <header className="flex items-center gap-2 sm:gap-3 md:gap-5 px-3 sm:px-5 py-3">
        {/* Drawer for Mobile device (i.e. up to sm Screens) */}
        <Button
          size="icon"
          variant="ghost"
          className="md:hidden"
          onClick={() => setIsDrawerOpen(true)}
        >
          <Menu size={18} />
        </Button>

        <MyDrawer
          isOpen={isDrawerOpen}
          isCollapsed={isDrawerCollapsed}
          onClose={() => setIsDrawerOpen(false)}
          onToggleCollapse={toggleMobileDrawer}
        />

        {/* Brand Logo */}
        <div className="min-w-0 flex-1">
          <img
            className="w-28 sm:w-32 max-w-full h-auto object-contain"
            src={brandLogo}
            alt="Oversea store logo"
          />
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 font-body">
          {navLinks.map((navLink) => (
            <NavLink
              key={navLink.path}
              to={navLink.path}
              className={({ isActive }) =>
                `font-medium ${isActive ? "text-[var(--color-focus-ring)]" : "text-[var(--color-link)]"}`
              }
            >
              {t(navLink.labelKey)}
            </NavLink>
          ))}
        </nav>

        {/* Custom Search for [lg + xl + 2xl] Screens  */}
        <div className="hidden lg:flex flex-1 justify-end">
          <CustomSearchForm />
        </div>

        {/* Login / Avatar + Action Icons */}
        <div className="user-avatar flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0 ml-auto">
          {/* Login / Avatar */}
          {isLoading ? (
            <Skeleton className="size-8 rounded-full" />
          ) : isAuthenticated ? (
            <AvatarDropDown />
          ) : (
            <>
              <NavLink
                to="/login"
                className="flex items-center gap-1 text-[var(--color-link)] p-1.5"
                title="Login"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline text-sm font-medium">
                  {t("navigation.login")}
                </span>
              </NavLink>
              <NavLink
                to="/register"
                className="flex items-center gap-1 text-[var(--color-link)] p-1.5"
                title="Register"
              >
                <UserRoundPlus size={18} />
                <span className="hidden sm:inline text-sm font-medium">
                  {t("navigation.register")}
                </span>
              </NavLink>
            </>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full size-8 sm:size-9 cursor-pointer"
            onClick={toggleTheme}
            title="Light / Dark"
          >
            {isDark ? <Moon size={17} /> : <Sun size={17} />}
          </Button>

          {isAuthenticated && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full size-8 sm:size-9"
              >
                <Heart size={17} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full size-8 sm:size-9 relative"
              >
                <ShoppingCart size={17} />
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center text-[10px] size-4 rounded-full bg-[var(--color-secondary)] text-white">
                  1
                </span>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Search for [sm + md] Screens  */}
      <div className="w-[90%] sm:w-[80%] mx-auto py-3 lg:hidden">
        <div className="flex items-center gap-1">
          <Input id="input-button-group" placeholder={t("navigation.search")} />
          <Button size="icon" variant="ghost" className="cursor-pointer">
            <Search size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
