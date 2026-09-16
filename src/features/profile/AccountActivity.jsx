import {
  CreditCard,
  Heart,
  MapPin,
  Package,
  ChevronLeft,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";

const sections = [
  {
    key: "orders",
    labelKey: "profile.activity.orders",
    icon: Package,
    to: null,
  },
  {
    key: "wishlist",
    labelKey: "profile.activity.wishlist",
    icon: Heart,
    to: null,
  },
  {
    key: "addresses",
    labelKey: "profile.activity.addresses",
    icon: MapPin,
    to: null,
  },
  {
    key: "payments",
    labelKey: "profile.activity.payments",
    icon: CreditCard,
    to: null,
  },
];