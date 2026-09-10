import { useState } from "react";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  House,
  Package,
  Blocks,
  MapPin,
  BadgePercent,
  X,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";

const drawerLinks = [
  {
    id: 0,
    labelKey: "navigation.home",
    path: "/",
    icon: House,
  },
  {
    id: 1,
    labelKey: "navigation.products",
    path: "/products",
    icon: Package,
  },
  {
    id: 2,
    labelKey: "navigation.categories",
    path: "/categories",
    icon: Blocks,
  },
  {
    id: 3,
    labelKey: "navigation.locations",
    path: "/locations",
    icon: MapPin,
  },
];

export default function MyDrawer({
  id,
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}) {
  const { t } = useTranslation();
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[var(--z-modal)] bg-[var(--color-overlay)] backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id={id}
        className={`md:hidden fixed left-0 top-0 z-[var(--z-modal)] h-screen border-r border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] transition-all duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "w-20" : "w-72"}`}
      >
        {/* Header */}
        <div className="relative border">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-[var(--color-surface-secondary)] cursor-pointer absolute right-[5px] top-[5px]"
            onClick={onClose}
          >
            <X size={20} aria-label={t("navigation.menu.close")} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 mt-15">
          <ul className="space-y-1">
            {drawerLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.id} className="mb-2">
                  <NavLink
                    to={link.path}
                    end={link.path === "/admin"}
                    onClick={onClose}
                    onMouseEnter={() => setHoveredItem(link.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={({ isActive }) =>
                      `group relative flex h-11 items-center rounded-xl transition-all duration-200 ${
                        isCollapsed ? "justify-center" : "gap-3 px-4"
                      } ${
                        isActive
                          ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-[var(--shadow-sm)]"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[var(--color-on-primary)] transition-opacity duration-200 ${
                            isActive ? "opacity-100" : "opacity-0"
                          } ${isCollapsed ? "hidden" : "block"}`}
                        />
                        <Icon size={20} className="shrink-0" />
                        <span
                          className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                          }`}
                        >
                          {t(link.labelKey)}
                        </span>
                        {isCollapsed && hoveredItem === link.id && (
                          <div className="absolute left-full ml-3 rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-[var(--color-on-primary)] shadow-[var(--shadow-lg)] whitespace-nowrap z-50">
                            {t(link.labelKey)}
                            <span className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-[var(--color-primary)]" />
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div
          className={`absolute bottom-0 left-0 right-0 border-t border-[var(--color-border)] bg-[var(--color-surface)] p-3 ${
            isCollapsed
              ? "flex justify-center"
              : "flex items-center justify-between gap-3"
          }`}
        >
          <div
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
              isCollapsed
                ? "w-0 opacity-0"
                : "flex w-auto items-center gap-3 opacity-100"
            }`}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-success-bg)]">
              <BadgePercent
                className="size-6 text-[var(--color-info)]"
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                {t("drawer.saleTitle")}
              </p>
              <p className="truncate text-xs text-[var(--color-text-secondary)]">
                {t("drawer.saleDetails")}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full hover:bg-[var(--color-surface-secondary)]"
            onClick={onToggleCollapse}
            aria-label={
              isCollapsed
                ? t("navigation.expandSidebar")
                : t("navigation.collapseSidebar")
            }
            title={
              isCollapsed
                ? t("navigation.expandSidebar")
                : t("navigation.collapseSidebar")
            }
          >
            {isCollapsed ? (
              <PanelRightClose size={18} aria-hidden="true" />
            ) : (
              <PanelLeftClose size={18} aria-hidden="true" />
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
