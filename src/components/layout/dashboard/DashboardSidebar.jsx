import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
    label: "Dashboard",
    path: "/admin",
    icon: <LayoutDashboard size={20} />,
  },
  {
    id: 1,
    label: "Products",
    path: "/admin/products",
    icon: <Package size={20} />,
  },
  {
    id: 2,
    label: "Orders",
    path: "/admin/orders",
    icon: <FileText size={20} />,
  },
  {
    id: 3,
    label: "Users",
    path: "/admin/users",
    icon: <Users size={20} />,
  },
  {
    id: 4,
    label: "Carts",
    path: "/admin/carts",
    icon: <ShoppingCart size={20} />,
  },
];

export default function DashboardSidebar({
  isOpen,
  isCollapsed,
  setIsSidebarCollapsed,
  onClose,
}) {
  return (
    <aside
      className={`min-h-screen border-r py-5 bg-[var(--color-surface)] text-primary-foreground fixed z-[var(--z-popover)] transition-all duration-300 ease-in-out -translate-x-full overflow-hidden lg:translate-x-0 lg:static
${isOpen ? "translate-x-0" : "-translate-x-full"}
${isCollapsed ? "w-20 px-3" : "w-64 px-5"}`}
    >
      {/* Header */}
      <div className="mb-6 h-[60px] flex items-start justify-between">
        <div
          className={`overflow-hidden transition-all duration-300
        ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
        >
          <p className="uppercase text-[var(--color-text-primary)] text-base font-body">
            ecommerce
          </p>
          <h2 className="capitalize text-[var(--color-text-secondary)] text-lg mt-1 font-semibold font-display">
            admin panel
          </h2>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full cursor-pointer lg:hidden"
          onClick={onClose}
        >
          <X
            size={20}
            className="text-[var(--color-text-primary)]"
            aria-label="Close navigation menu"
          />
        </Button>
      </div>

      <div className="h-px mb-3">
        <Separator className={isCollapsed ? "opacity-0" : "opacity-100"} />
      </div>

      {/* Navigation */}
      <nav>
        <ul className="space-y-1">
          {navigationLinks.map((navigationLink) => (
            <li key={navigationLink.id}>
              <NavLink
                to={navigationLink.path}
                end={navigationLink.path === "/admin"}
                onClick={onClose}
                title={navigationLink.label}
                className={({ isActive }) =>
                  `flex items-center rounded-md duration-300 text-[var(--color-link)] h-11
              ${isActive ? "bg-[var(--color-focus-ring)] text-white" : ""}
              ${
                isCollapsed
                  ? "justify-center mx-auto p-0"
                  : "gap-3 px-4 py-3 w-full"
              }`
                }
              >
                {navigationLink.icon}

                <span
                  className={`
                whitespace-nowrap overflow-hidden transition-all duration-300
                ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
              `}
                >
                  {navigationLink.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t absolute bottom-5 left-0 right-0 flex items-center justify-center gap-3 p-3 text-[var(--color-text-secondary)]">
        <div
          className={`
        overflow-hidden transition-all duration-300 flex items-center gap-3
        ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
      `}
        >
          <Radio className="w-5 h-5 shrink-0" />

          <div>
            <p className="text-sm font-medium font-body mb-1">API Connected</p>
            <p className="text-xs font-body">E-commerce API</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          title="Collapse menu"
          className="rounded-full cursor-pointer shrink-0"
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
        >
          {isCollapsed ? (
            <PanelRightClose size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </Button>
      </div>
    </aside>
  );
}
