import {
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";

export const adminNavigation = [
  { labelKey: "navigation.dashboard", path: "/admin", icon: LayoutDashboard },
  { labelKey: "navigation.products", path: "/admin/products", icon: Package },
  { labelKey: "navigation.orders", path: "/admin/orders", icon: FileText },
  { labelKey: "navigation.users", path: "/admin/users", icon: Users },
  { labelKey: "navigation.carts", path: "/admin/carts", icon: ShoppingCart },
  { labelKey: "navigation.settings", path: "/admin/settings", icon: Settings },
];