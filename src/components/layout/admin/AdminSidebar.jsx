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

export default function AdminSidebar({
  isOpen,
  isCollapsed,
  setIsSidebarCollapsed,
  onClose,
}) {
  return (
    <aside
      className={`
        h-screen
        border-l
        py-5
        bg-[var(--color-surface)]
        text-primary-foreground
        fixed
        top-0
        right-0
        z-[var(--z-popover)]
        overflow-hidden
        transition-transform
        duration-300
        ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        ${isCollapsed ? "w-20 px-3" : "w-64 px-5"}
      `}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full cursor-pointer border fixed right-[20px]"
        onClick={onClose}
      >
        <X
          size={20}
          className="text-[var(--color-text-primary)]"
          aria-label="Close navigation menu"
        />
      </Button>

      {/* Header */}
      <div className="mt-12 mb-6 h-[60px]">
        <div
          className={`transition-all duration-300 ${
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}
        >
          <p className="uppercase text-[var(--color-text-primary)] text-base font-body">
            ecommerce
          </p>

          <h2 className="capitalize text-[var(--color-text-secondary)] text-lg mt-1 font-semibold font-display">
            admin panel
          </h2>
        </div>
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
                  `flex items-center rounded-md duration-300 text-[var(--color-link)]
    ${isActive ? "bg-[var(--color-focus-ring)] text-white" : ""}
    ${
      isCollapsed
        ? "size-11 mx-auto p-0 justify-center"
        : "w-full h-11 gap-3 px-4"
    }`
                }
              >
                {navigationLink.icon}

                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300
    ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
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
        <Button
          variant="ghost"
          size="icon"
          title="Collapse menu"
          className="rounded-full cursor-pointer shrink-0"
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
        >
          {isCollapsed ? (
            <PanelLeftClose size={18} />
          ) : (
            <PanelRightClose size={18} />
          )}
        </Button>
        <div
          className={`overflow-hidden transition-all duration-300 flex items-center gap-3 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
        >
          <Radio className="w-5 h-5 shrink-0" />

          <div>
            <p className="text-sm font-medium font-body mb-1">API Connected</p>

            <p className="text-xs font-body">E-commerce API</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
