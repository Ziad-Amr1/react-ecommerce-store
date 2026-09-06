import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import HeaderActionButtons from "./HeaderActionButtons";

function AdminHeader({ onMenuClick, sidebarOpen, sidebarId }) {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between border-b bg-(--color-surface) px-4 py-2 lg:px-6 sticky top-0 z-(--z-nav)">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full cursor-pointer lg:hidden"
          onClick={onMenuClick}
          aria-expanded={sidebarOpen}
          aria-controls={sidebarId}
        >
          <Menu size={20} aria-label={t("navigation.menu.open")} />
        </Button>

        <img
          src="/favicon.ico"
          alt={t("brand.logoAlt")}
          className="h-18 object-contain"
        />
        <div className="hidden sm:block">
          <h2 className="text-lg font-bold font-(--font-display) text-(--color-text-primary)">
            {t("navigation.dashboardTitle")}
          </h2>
          <p className="text-xs text-(--color-text-secondary)">
            {t("navigation.dashboardSubtitle")}
          </p>
        </div>
      </div>

      <HeaderActionButtons />
    </header>
  );
}

export default AdminHeader;
