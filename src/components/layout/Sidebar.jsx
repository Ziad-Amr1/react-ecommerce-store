import { forwardRef, useEffect } from "react";
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
  PanelLeftOpen,
} from "lucide-react";
import { adminNavigation } from "@/config/navigation";

// NavLink with a functional className is incompatible with Radix Slot / asChild:
// Slot's mergeProps stringifies function-valued className props onto the child
// element, turning the callback into a literal class string. This wrapper never
// forwards that merged className (spreading it first, then always overriding it
// with a real function) so NavLink computes the state-dependent classes itself.
const NavItem = forwardRef(function NavItem(
  {
    to,
    end,
    onClick,
    label,
    icon: Icon,
    collapsed,
    "aria-label": ariaLabel,
    ...rest
  },
  ref
) {
  return (
    <NavLink
      {...rest}
      ref={ref}
      to={to}
      end={end}
      onClick={onClick}
      aria-label={ariaLabel}
      className={({ isActive }) =>
        `group relative flex h-11 items-center rounded-xl transition-all duration-200 ${
          collapsed ? "justify-center" : "gap-3 px-4"
        } ${
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-(--color-text-secondary) hover:bg-(--color-surface-secondary) hover:text-(--color-text-primary)"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-foreground transition-opacity duration-200 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          />
          <Icon
            aria-hidden="true"
            className={`shrink-0 transition-colors duration-200 ${
              isActive
                ? "text-primary-foreground"
                : "text-(--color-text-secondary) group-hover:text-(--color-text-primary)"
            }`}
          />
          <span
            className={`overflow-hidden text-sm whitespace-nowrap transition-all duration-300 ${
              collapsed ? "invisible w-0 opacity-0" : "visible w-auto opacity-100"
            }`}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
});
NavItem.displayName = "NavItem";

export default function Sidebar({ id, isOpen, isCollapsed, onClose, onToggleCollapse }) {
  const { t } = useTranslation();

  // Escape dismisses the mobile drawer, matching the overlay's click-to-close.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
        aria-label={t("navigation.adminPanel")}
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
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-(--color-border) px-7">
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
                aria-label={t("navigation.menu.close")}
              >
                <X className="size-5" aria-hidden="true" />
              </Button>
            </div>
          )}

          {/* Navigation */}
          <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {adminNavigation.map((link) => {
                const label = t(link.labelKey);

                const item = (
                  <NavItem
                    to={link.path}
                    end={link.path === "/admin"}
                    onClick={onClose}
                    label={label}
                    icon={link.icon}
                    collapsed={isCollapsed}
                    aria-label={isCollapsed ? label : undefined}
                  />
                );

                return (
                  <li key={link.path}>
                    {isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{item}</TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                          {label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      item
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div
            className={`shrink-0 border-t border-(--color-border) bg-(--color-surface) p-3 ${
              isCollapsed
                ? "flex justify-center"
                : "flex items-center justify-between gap-3"
            }`}
          >
            <div
              className={`flex items-center gap-3 overflow-hidden whitespace-nowrap transition-all duration-300 ${
                isCollapsed
                  ? "invisible w-0 opacity-0"
                  : "visible w-auto opacity-100"
              }`}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--color-success-bg)">
                <Radio
                  className="size-5 text-(--color-success)"
                  aria-hidden="true"
                />
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
                <PanelLeftOpen className="size-5" aria-hidden="true" />
              ) : (
                <PanelLeftClose className="size-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </TooltipProvider>
      </aside>
    </>
  );
}
