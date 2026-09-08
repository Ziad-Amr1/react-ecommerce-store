import {
  Package,
  Heart,
  MapPin,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const statistics = [
  {
    label: "Total Orders",
    value: "24",
    icon: Package,
  },
  {
    label: "Wishlist Items",
    value: "18",
    icon: Heart,
  },
  {
    label: "Saved Addresses",
    value: "3",
    icon: MapPin,
  },
];

const AccountStatistics = () => {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-(--color-foreground)">
          Account Statistics
        </h2>

        <p className="mt-1 text-sm text-(--color-muted)">
          A quick overview of your account activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.label}
              className="border-(--color-border) bg-(--color-surface) shadow-sm transition-transform duration-200 hover:-translate-y-1"
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--color-secondary) text-(--color-primary)">
                  <Icon size={22} />
                </div>

                <div>
                  <p className="text-2xl font-bold text-(--color-foreground)">
                    {item.value}
                  </p>

                  <p className="text-sm text-(--color-muted)">
                    {item.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default AccountStatistics;
