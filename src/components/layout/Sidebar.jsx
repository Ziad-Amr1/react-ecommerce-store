import { useState } from "react";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  X,
  PanelLeftClose,
  PanelRightClose,
  CircleCheck,
  CircleX,
  LoaderCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { adminNavigation } from "@/config/navigation";
import useApiAvailability from "@/hooks/useApiAvailability";

export default function Sidebar({ id, isOpen, isCollapsed, onClose, onToggleCollapse }) {
  const { t } = useTranslation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const { status, check } = useApiAvailability();

  const apiStatusConfig = {
    checking: {
      labelKey: "navigation.apiChecking",
      icon: LoaderCircle,
      tileClass: "bg-(--color-surface-secondary)",
      iconClass: "text-(--color-text-secondary)",
      spin: true,
    },
    online: {
      labelKey: "navigation.apiOnline",
      icon: CircleCheck,
      tileClass: "bg-(--color-success-bg)",
      iconClass: "text-(--color-success)",
      spin: false,
    },
    unavailable: {
      labelKey: "navigation.apiUnavailable",
      icon: CircleX,
      tileClass: "bg-(--color-error-bg)",
      iconClass: "text-(--color-error)",
      spin: false,
    },
  };

  const apiStatus = apiStatusConfig[status];
  const ApiStatusIcon = apiStatus.icon;
  const apiStatusLabel = t(apiStatus.labelKey);

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
        className={`fixed left-0 top-0 z-(--z-modal) h-screen border-r border-(--color-border) bg-(--color-surface) text-(--color-text-primary) transition-all duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "w-20" : "w-72"}`}
      >
        {/* Header */}
        <div className="flex h-[72px] items-center justify-between border-b border-(--color-border) px-5">
          <div
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--color-text-secondary)">
              {t("navigation.brandEyebrow")}
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
                          className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                          }`}
                        >
                          {t(link.labelKey)}
                        </span>
                        {isCollapsed && hoveredItem === link.path && (
                          <div className="absolute left-full ml-3 rounded-lg bg-(--color-primary) px-3 py-1.5 text-sm font-medium text-(--color-on-primary) shadow-(--shadow-lg) whitespace-nowrap z-50">
                            {t(link.labelKey)}
                            <span className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-(--color-primary)" />
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
        <TooltipProvider delayDuration={0}>
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 border-t border-(--color-border) bg-(--color-surface) p-3">
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 rounded-full hover:bg-(--color-surface-secondary)"
                    onClick={check}
                    aria-label={apiStatusLabel}
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full ${apiStatus.tileClass}`}
                    >
                      <ApiStatusIcon
                        className={`size-4 ${apiStatus.iconClass} ${
                          apiStatus.spin ? "animate-spin" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </Button>
                </TooltipTrigger>

                <TooltipContent side="right" sideOffset={8}>
                  {apiStatusLabel}
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full ${apiStatus.tileClass}`}
                >
                  <ApiStatusIcon
                    className={`size-4 ${apiStatus.iconClass} ${
                      apiStatus.spin ? "animate-spin" : ""
                    }`}
                    aria-hidden="true"
                  />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-(--color-text-primary)">
                    {apiStatusLabel}
                  </p>
                  <p className="truncate text-xs text-(--color-text-secondary)">
                    {t("navigation.apiLabel")}
                  </p>
                </div>
              </div>
            )}

            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 rounded-full hover:bg-(--color-surface-secondary)"
                    onClick={onToggleCollapse}
                    aria-label={t("navigation.expandSidebar")}
                  >
                    <PanelRightClose
                      size={18}
                      className="rtl:rotate-180"
                      aria-hidden="true"
                    />
                  </Button>
                </TooltipTrigger>

                <TooltipContent side="right" sideOffset={8}>
                  {t("navigation.expandSidebar")}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 rounded-full hover:bg-(--color-surface-secondary)"
                onClick={onToggleCollapse}
                aria-label={t("navigation.collapseSidebar")}
              >
                <PanelLeftClose
                  size={18}
                  className="rtl:rotate-180"
                  aria-hidden="true"
                />
              </Button>
            )}
          </div>
        </TooltipProvider>
      </aside>
    </>
  );
}
