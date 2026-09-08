import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import OrderCard from "./OrderCard";

const orders = [
  {
    id: "ORD-10234",
    productName: "Wireless Noise Cancelling Headphones",
    date: "March 12, 2026",
    price: "$129.00",
    status: "Delivered",
    image: "https://placehold.co/200x200",
  },
  {
    id: "ORD-10235",
    productName: "Smart Watch Series X",
    date: "March 18, 2026",
    price: "$249.00",
    status: "Processing",
    image: "https://placehold.co/200x200",
  },
  {
    id: "ORD-10236",
    productName: "Premium Leather Backpack",
    date: "March 22, 2026",
    price: "$89.00",
    status: "Cancelled",
    image: "https://placehold.co/200x200",
  },
];

const RecentOrders = () => {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-(--color-foreground)">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-(--color-muted)">
            Track and review your latest purchases.
          </p>
        </div>

        <Button
          variant="outline"
          className="w-fit gap-2 border-(--color-border) bg-transparent text-(--color-foreground)"
        >
          View All Orders
          <ArrowRight size={17} />
        </Button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </section>
  );
};

export default RecentOrders;
