import { NavLink } from "react-router";
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
export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`w-64 bg-primary text-primary-foreground p-5 relative -translate-x-full lg:translate-x-0 fixed z-[var(--z-nav)] duration-300 cursor-pointer ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Start Sidebar Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="uppercase text-[var(--color-supporting)] font-body">
            ecommerce
          </p>
          <h2 className="capitalize text-xl mt-1 font-semibold font-display">
            admin panel
          </h2>
        </div>
        {/* Close button - Mobile */}
        <button type="button" onClick={onClose} className="lg:hidden">
          <X size={20} />
        </button>
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
                className={({ isActive }) =>
                  `flex gap-3 px-4 py-3 font-body rounded-full ${isActive ? "bg-accent text-primary" : ""}`
                }
              >
                {navigationLink.icon}
                {navigationLink.label}
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
            API Connected
          </p>
          <p className="text-xs text-[var(--color-supporting)] font-body">
            E-commerce API
          </p>
        </div>
      </div>
      {/* End Sidebar Footnote */}
    </aside>
  );
}
