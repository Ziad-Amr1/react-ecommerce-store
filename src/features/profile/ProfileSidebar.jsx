import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navigationItems = [
  {
    label: "Profile Overview",
    icon: User,
    active: true,
  },
  {
    label: "My Orders",
    icon: Package,
  },
  {
    label: "Wishlist",
    icon: Heart,
  },
  {
    label: "Addresses",
    icon: MapPin,
  },
  {
    label: "Payment Methods",
    icon: CreditCard,
  },
  {
    label: "Notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    icon: Settings,
  },
];

const ProfileSidebar = () => {
  return (
    <aside className="h-fit rounded-xl border border-(--color-border) bg-(--color-surface) p-3 shadow-sm">
      <nav className="flex gap-2 overflow-x-auto lg:flex-col">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <Button
              key={item.label}
              variant="ghost"
              className={`shrink-0 justify-start gap-3 ${
                item.active
                  ? "bg-(--color-primary) text-(--color-background) hover:bg-(--color-primary) hover:text-(--color-background)"
                  : "text-(--color-muted) hover:bg-(--color-secondary) hover:text-(--color-foreground)"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="hidden lg:block">
        <Separator className="my-3 bg-(--color-border)" />

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-(--color-destructive) hover:bg-(--color-secondary) hover:text-(--color-destructive)"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
