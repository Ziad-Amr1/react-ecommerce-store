import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  ShoppingCart,
  Radio,
  X,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";

const navigationLinks = [
  {
    id: 0,
    labelKey: "navigation.dashboard",
    path: "/admin",
    icon: <LayoutDashboard size={20} />,
  },
  {
    id: 1,
    labelKey: "navigation.products",
    path: "/admin/products",
    icon: <Package size={20} />,
  },
  {
    id: 2,
    labelKey: "navigation.orders",
    path: "/admin/orders",
    icon: <FileText size={20} />,
  },
  {
    id: 3,
    labelKey: "navigation.users",
    path: "/admin/users",
    icon: <Users size={20} />,
  },
  {
    id: 4,
    labelKey: "navigation.carts",
    path: "/admin/carts",
    icon: <ShoppingCart size={20} />,
  },
];

export default function Sidebar({ id, isOpen, isCollapsed, onClose, onToggleCollapse }) {
  const { t } = useTranslation();

  return (
    <aside
      id={id}
      className={`min-h-screen border-r bg-[var(--color-surface)] text-[var(--color-text-primary)] fixed z-[var(--z-popover)] duration-300 overflow-hidden -translate-x-full lg:translate-x-0 lg:static ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ${isCollapsed ? "w-20" : "w-64"}`}
    >
      {/* Start Sidebar Header */}
      <div
        className={`mb-6 h-[60px] flex items-start justify-between ${
          isCollapsed ? "px-2" : "p-5"
        }`}
      >
        <div
          className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}
        >
          <p className="uppercase text-[var(--color-text-primary)] font-body">
            {t("navigation.brandEyebrow")}
          </p>
          <h2 className="capitalize text-xl mt-1 font-semibold font-display">
            {t("navigation.adminPanel")}
          </h2>
        </div>

        {/* Close button - Mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full cursor-pointer lg:hidden"
          onClick={onClose}
        >
          <X size={20} aria-label={t("navigation.menu.close")} />
        </Button>
      </div>
      {/* End Sidebar Header */}

      {/* Start Navigation Links */}
      <nav>
        <ul className="space-y-1">
          {navigationLinks.map((navigationLink) => (
            <li key={navigationLink.id}>
              <NavLink
                to={navigationLink.path}
                end={navigationLink.path === "/admin"}
                onClick={onClose}
                title={t(navigationLink.labelKey)}
                className={({ isActive }) =>
                  `flex items-center h-11 rounded-full text-[var(--color-link)] duration-300 ${
                    isCollapsed ? "justify-center mx-auto p-0" : "gap-3 px-4 py-3 mx-3"
                  } ${
                    isActive
                      ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                      : "hover:bg-[var(--color-surface-secondary)]"
                  }`
                }
              >
                {navigationLink.icon}

                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  }`}
                >
                  {t(navigationLink.labelKey)}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {/* End Navigation Links */}

      {/* Start Sidebar Footnote */}
      <div
        className={`absolute bottom-5 left-0 right-0 flex items-center border-t p-3 text-[var(--color-text-secondary)] ${
          isCollapsed ? "justify-center gap-0" : "gap-3"
        }`}
      >
        <div
          className={`overflow-hidden whitespace-nowrap transition-all duration-300 flex items-center gap-3 ${
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}
        >
          <Radio className="w-5 h-5 shrink-0 text-[var(--color-supporting-decorative)]" />
          <div>
            <p className="text-sm font-medium font-body">
              {t("navigation.apiConnected")}
            </p>
            <p className="text-xs font-body">{t("navigation.apiLabel")}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full cursor-pointer shrink-0"
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
      {/* End Sidebar Footnote */}
    </aside>
  );
}
