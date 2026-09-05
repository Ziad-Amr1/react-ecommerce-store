import {
  FileText,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";

export const featureStatus = {
  planned: "planned",
  inProgress: "inProgress",
  polishing: "polishing",
  doneWaitingPR: "doneWaitingPR",
  done: "done",
};

export const adminFeatures = [
  {
    key: "products",
    labelKey: "navigation.products",
    icon: Package,
    status: featureStatus.planned,
  },
  {
    key: "orders",
    labelKey: "navigation.orders",
    icon: FileText,
    status: featureStatus.planned,
  },
  {
    key: "users",
    labelKey: "navigation.users",
    icon: Users,
    status: featureStatus.planned,
  },
  {
    key: "carts",
    labelKey: "navigation.carts",
    icon: ShoppingCart,
    status: featureStatus.planned,
  },
  {
    key: "settings",
    labelKey: "navigation.settings",
    icon: Settings,
    status: featureStatus.planned,
  },
];