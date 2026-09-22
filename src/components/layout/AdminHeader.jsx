import { Button } from "@/components/ui/button";
import { Menu, House } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { assetUrl } from "@/utils/assetUrl";
import HeaderActionButtons from "./HeaderActionButtons";

function AdminHeader({ onMenuClick, sidebarOpen, sidebarId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-(--z-nav) flex items-center justify-between gap-2 border-b bg-(--color-surface) px-3 py-2 sm:px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full cursor-pointer lg:hidden"
          onClick={onMenuClick}
          aria-expanded={sidebarOpen}
          aria-controls={sidebarId}
        >
          <Menu size={20} aria-label={t("navigation.menu.open")} />
        </Button>

        <img
          src={assetUrl("logo.webp")}
          alt={t("brand.logoAlt")}
          className="h-9 shrink-0 object-contain sm:h-11"
        />
        <div className="hidden min-w-0 sm:block">
          <h2 className="truncate text-lg font-bold font-(--font-display) text-(--color-text-primary)">
            {t("navigation.dashboardTitle")}
          </h2>
          <p className="truncate text-xs text-(--color-text-secondary)">
            {t("navigation.dashboardSubtitle")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile-only Home button: returns to the storefront */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/")}
          aria-label={t("navigation.home", "Home")}
          title={t("navigation.home", "Home")}
          className="shrink-0 cursor-pointer rounded-full md:hidden"
        >
          <House size={20} aria-hidden="true" />
        </Button>

        <HeaderActionButtons />
      </div>
    </header>
  );
}

export default AdminHeader;
