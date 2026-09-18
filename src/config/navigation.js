import {
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Users,
  FolderTree,
  Star,
  Heart,
  Ticket,
  BarChart3,
} from "lucide-react";

export const adminNavigation = [
  { key: "dashboard", labelKey: "navigation.dashboard", path: "/admin", icon: LayoutDashboard },
  { key: "products", labelKey: "navigation.products", path: "/admin/products", icon: Package },
  { key: "categories", labelKey: "navigation.categories", path: "/admin/categories", icon: FolderTree },
  { key: "orders", labelKey: "navigation.orders", path: "/admin/orders", icon: Receipt },
  { key: "users", labelKey: "navigation.users", path: "/admin/users", icon: Users },
  { key: "carts", labelKey: "navigation.carts", path: "/admin/carts", icon: ShoppingCart },
  { key: "reviews", labelKey: "navigation.reviews", path: "/admin/reviews", icon: Star },
  { key: "wishlists", labelKey: "navigation.wishlists", path: "/admin/wishlists", icon: Heart },
  { key: "coupons", labelKey: "navigation.coupons", path: "/admin/coupons", icon: Ticket },
  { key: "reports", labelKey: "navigation.reports", path: "/admin/reports", icon: BarChart3 },
  { key: "settings", labelKey: "navigation.settings", path: "/admin/settings", icon: Settings },
];
