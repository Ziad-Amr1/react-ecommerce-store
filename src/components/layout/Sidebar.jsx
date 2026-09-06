import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Radio,
  X,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";
import { adminNavigation } from "@/config/navigation";

export default function Sidebar({ id, isOpen, isCollapsed, onClose, onToggleCollapse }) {
  const { t } = useTranslation();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-(--z-modal) bg-(--color-overlay) backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id={id}
        className={`fixed left-0 top-0 z-(--z-modal) flex h-screen flex-col border-r border-(--color-border) bg-(--color-surface) text-(--color-text-primary) transition-all duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "w-20" : "w-72"}`}
      >
        <TooltipProvider delayDuration={0}>
          {/* Header */}
          {isCollapsed ? (
            <div className="flex h-[72px] shrink-0 items-center justify-center border-b border-(--color-border)">
              <img
                src="/favicon.ico"
                alt={t("brand.logoAlt")}
                className="size-9 object-contain"
              />
            </div>
          ) : (
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-(--color-border) px-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-text-secondary)">
                  {t("brand.name")}
                </p>
                <h2 className="mt-0.5 font-display text-xl font-bold text-(--color-text-primary)">
                  {t("navigation.adminPanel")}
                </h2>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full lg:hidden hover:bg-(--color-surface-secondary)"
                onClick={onClose}
              >
                <X size={20} aria-label={t("navigation.menu.close")} />
              </Button>
            </div>
          )}

          {/* Navigation */}
          <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {adminNavigation.map((link) => {
                const Icon = link.icon;
                const label = t(link.labelKey);

                const linkElement = (
                  <NavLink
                    to={link.path}
                    end={link.path === "/admin"}
                    onClick={onClose}
                    aria-label={isCollapsed ? label : undefined}
                    className={({ isActive }) =>
                      `group relative flex h-11 items-center rounded-xl transition-all duration-200 ${
                        isCollapsed ? "justify-center" : "gap-3 px-4"
                      } ${
                        isActive
                          ? "bg-(--color-primary) text-(--color-on-primary) shadow-(--shadow-sm)"
                          : "text-(--color-text-secondary) hover:bg-(--color-surface-secondary) hover:text-(--color-text-primary)"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-(--color-on-primary) transition-opacity duration-200 ${
                            isActive ? "opacity-100" : "opacity-0"
                          } ${isCollapsed ? "hidden" : "block"}`}
                        />
                        <Icon size={20} className="shrink-0" />
                        <span
                          className={`whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ${
                            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                          }`}
                        >
                          {label}
                        </span>
                      </>
                    )}
                  </NavLink>
                );

                return (
                  <li key={link.path}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                          {label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      linkElement
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div
            className={`shrink-0 border-t border-(--color-border) bg-(--color-surface) p-3 ${
              isCollapsed ? "flex justify-center" : "flex items-center justify-between gap-3"
            }`}
          >
            <div
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                isCollapsed ? "w-0 opacity-0" : "flex w-auto items-center gap-3 opacity-100"
              }`}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-(--color-success-bg)">
                <Radio className="size-4 text-(--color-success)" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-(--color-text-primary)">
                  {t("navigation.apiConnected")}
                </p>
                <p className="truncate text-xs text-(--color-text-secondary)">
                  {t("navigation.apiLabel")}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 rounded-full hover:bg-(--color-surface-secondary)"
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
        </TooltipProvider>
      </aside>
    </>
  );
}
