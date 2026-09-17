import { ShoppingCart, CreditCard, TrendingUp, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cartTotal, formatCurrency } from "@/utils/cart-helpers";

export function CartStatsGrid({ carts }) {
  const totalCarts = carts.length;
  const totalValue = carts.reduce((sum, cart) => sum + cartTotal(cart.items), 0);
  const avgCartValue = totalCarts ? totalValue / totalCarts : 0;
  const cartsWithCoupon = carts.filter((cart) => cart.coupon).length;

  const stats = [
    {
      label: "Total Carts",
      value: totalCarts,
      icon: ShoppingCart,
      accent: "from-primary/15 to-primary/5 text-primary",
    },
    {
      label: "Total Cart Value",
      value: `${formatCurrency(totalValue)} EGP`,
      icon: CreditCard,
      accent: "from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Average Cart Value",
      value: `${formatCurrency(avgCartValue)} EGP`,
      icon: TrendingUp,
      accent: "from-blue-500/15 to-blue-500/5 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Carts with Coupon",
      value: `${cartsWithCoupon} / ${totalCarts}`,
      icon: Tag,
      accent: "from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-3 px-4 py-3.5">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.accent}`}
            >
              <stat.icon className="size-5" aria-hidden="true" />
            </div>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate font-display text-lg font-bold tabular-nums">
                {stat.value}
              </span>
              <span className="truncate text-xs text-muted-foreground">{stat.label}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
