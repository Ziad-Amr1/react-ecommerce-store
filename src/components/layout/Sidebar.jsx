import { useState } from "react";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Radio,
  X,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";
import { adminNavigation } from "@/config/navigation";

export default function Sidebar({ id, isOpen, isCollapsed, onClose, onToggleCollapse }) {
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
        className={`fixed left-0 top-0 z-[var(--z-modal)] h-screen border-r border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] transition-all duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "w-20" : "w-72"}`}
      >
        {/* Header */}
        <div className="flex h-[72px] items-center justify-between border-b border-[var(--color-border)] px-5">
          <div
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
              {t("navigation.brandEyebrow")}
            </p>
            <h2 className="mt-0.5 font-display text-xl font-bold text-[var(--color-text-primary)]">
              {t("navigation.adminPanel")}
            </h2>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden hover:bg-[var(--color-surface-secondary)]"
            onClick={onClose}
          >
            <X size={20} aria-label={t("navigation.menu.close")} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4">
          <ul className="space-y-1">
            {adminNavigation.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    end={link.path === "/admin"}
                    onClick={onClose}
                    onMouseEnter={() => setHoveredItem(link.path)}
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
                        {isCollapsed && hoveredItem === link.path && (
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
            isCollapsed ? "flex justify-center" : "flex items-center justify-between gap-3"
          }`}
        >
          <div
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "flex w-auto items-center gap-3 opacity-100"
            }`}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-success-bg)]">
              <Radio className="size-4 text-[var(--color-success)]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                {t("navigation.apiConnected")}
              </p>
              <p className="truncate text-xs text-[var(--color-text-secondary)]">
                {t("navigation.apiLabel")}
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
