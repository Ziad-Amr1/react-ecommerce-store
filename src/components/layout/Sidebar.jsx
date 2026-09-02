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

export default function Sidebar({ id, isOpen, onClose }) {
  const { t } = useTranslation();

  return (
    <aside
      id={id}
      className={`min-h-screen w-64 bg-primary text-primary-foreground p-5 fixed z-[var(--z-popover)] duration-300 -translate-x-full lg:translate-x-0 lg:static ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Start Sidebar Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="uppercase text-[var(--color-supporting)] font-body">
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
        <ul>
          {navigationLinks.map((navigationLink) => (
            <li key={navigationLink.id}>
              <NavLink
                to={navigationLink.path}
                end={navigationLink.path === "/admin"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex gap-3 px-4 py-3 font-body rounded-full ${
                    isActive ? "bg-accent text-primary" : ""
                  }`
                }
              >
                {navigationLink.icon}
                {t(navigationLink.labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {/* End Navigation Links */}

      {/* Start Sidebar Footnote */}
      <div className="absolute bottom-[20px] flex items-center gap-3 p-3">
        <Radio className="w-5 h-5 text-[var(--color-surface-muted)]" />
        <div>
          <p className="text-sm font-medium text-[var(--color-accent)] font-body">
            {t("navigation.apiConnected")}
          </p>
          <p className="text-xs text-[var(--color-supporting)] font-body">
            {t("navigation.apiLabel")}
          </p>
        </div>
      </div>
      {/* End Sidebar Footnote */}
    </aside>
  );
}
