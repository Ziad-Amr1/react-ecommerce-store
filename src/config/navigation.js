import {
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";

export const adminNavigation = [
  { key: "dashboard", labelKey: "navigation.dashboard", path: "/admin", icon: LayoutDashboard },
  { key: "products", labelKey: "navigation.products", path: "/admin/products", icon: Package },
  { key: "orders", labelKey: "navigation.orders", path: "/admin/orders", icon: Receipt },
  { key: "users", labelKey: "navigation.users", path: "/admin/users", icon: Users },
  { key: "carts", labelKey: "navigation.carts", path: "/admin/carts", icon: ShoppingCart },
  { key: "settings", labelKey: "navigation.settings", path: "/admin/settings", icon: Settings },
];
