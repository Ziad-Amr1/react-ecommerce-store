import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Heart,
  Package,
  Search,
  Users,
  Eye,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import StatCard from "@/features/admin/dashboard/components/StatCard";

const INITIAL_WISHLISTS = [
  {
    id: "wish-1",
    customer: "Nour El-Din",
    email: "nour.eldin@example.com",
    itemCount: 6,
    lastUpdated: "2026-09-16",
    items: [
      { name: "Wireless Headphones", price: 120, stock: "In Stock" },
      { name: "Smart Watch V2", price: 210, stock: "In Stock" },
      { name: "Leather Laptop Sleeve", price: 45, stock: "Low Stock" },
      { name: "USB-C Hub Multiport", price: 35, stock: "In Stock" },
      { name: "Ergonomic Mouse", price: 60, stock: "In Stock" },
      { name: "Mechanical Keyboard", price: 95, stock: "In Stock" },
    ],
  },
  {
    id: "wish-2",
    customer: "Mona El-Sayed",
    email: "mona.sayed@example.com",
    itemCount: 4,
    lastUpdated: "2026-09-15",
    items: [
      { name: "Organic Skincare Serum", price: 42, stock: "In Stock" },
      { name: "Hydrating Facial Cream", price: 38, stock: "In Stock" },
      { name: "Scented Candle Set", price: 28, stock: "In Stock" },
      { name: "Silk Pillowcase Pair", price: 50, stock: "Out of Stock" },
    ],
  },
  {
    id: "wish-3",
    customer: "Youssef Ibrahim",
    email: "youssef.i@example.com",
    itemCount: 3,
    lastUpdated: "2026-09-14",
    items: [
      { name: "4K Monitor 27-inch", price: 340, stock: "In Stock" },
      { name: "Standing Desk Mat", price: 55, stock: "In Stock" },
      { name: "Cable Management Box", price: 22, stock: "In Stock" },
    ],
  },
  {
    id: "wish-4",
    customer: "Dina Mahmoud",
    email: "dina.m@example.com",
    itemCount: 5,
    lastUpdated: "2026-09-12",
    items: [
      { name: "Running Shoes Pro", price: 110, stock: "In Stock" },
      { name: "Yoga Mat Non-Slip", price: 30, stock: "In Stock" },
      { name: "Insulated Water Bottle", price: 25, stock: "In Stock" },
      { name: "Dumbbell Set 10kg", price: 85, stock: "Low Stock" },
      { name: "Fitness Tracker Band", price: 45, stock: "In Stock" },
    ],
  },
];

export default function Wishlists() {
  const { t } = useTranslation();
  const [wishlists] = useState(INITIAL_WISHLISTS);
  const [search, setSearch] = useState("");
  const [selectedWishlist, setSelectedWishlist] = useState(null);

  const filtered = wishlists.filter(
    (w) =>
      w.customer.toLowerCase().includes(search.toLowerCase()) ||
      w.email.toLowerCase().includes(search.toLowerCase()) ||
      w.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()))
  );

  const totalSavedItems = wishlists.reduce((acc, w) => acc + w.itemCount, 0);
  const avgItems = (totalSavedItems / (wishlists.length || 1)).toFixed(1);

  const kpis = [
    {
      id: "active",
      title: "Active Wishlists",
      description: "Customer saved lists",
      value: wishlists.length,
      icon: Heart,
    },
    {
      id: "total",
      title: "Total Saved Items",
      description: "Items in wishlists",
      value: totalSavedItems,
      icon: Package,
    },
    {
      id: "avg",
      title: "Avg Items / Wishlist",
      description: "Average per customer",
      value: avgItems,
      icon: Users,
    },
    {
      id: "top",
      title: "Top Saved Category",
      description: "Most popular category",
      value: "Electronics",
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        kicker={t("common.admin", "Administration")}
        title={t("navigation.wishlists", "Manage Customer Wishlists")}
        description="Track high-demand saved products and analyze customer interest trends."
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.id}
            title={kpi.title}
            description={kpi.description}
            value={kpi.value}
            icon={kpi.icon}
            className="gap-0 py-4"
          />
        ))}
      </div>

      {/* Search Bar */}
      <Card className="rounded-2xl border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or saved product..."
            className="pl-9 rounded-xl"
          />
        </div>
      </Card>

      {/* Wishlists Table */}
      <Card className="rounded-2xl border overflow-hidden">
        <CardHeader className="p-4 border-b bg-muted/20">
          <CardTitle className="text-base font-bold font-display">
            Customer Wishlists ({filtered.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Customer</TableHead>
                <TableHead>Total Saved Items</TableHead>
                <TableHead>Sample Saved Products</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground text-sm">
                    No wishlists match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold">
                            {w.customer.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-xs text-foreground">{w.customer}</p>
                          <p className="text-[11px] text-muted-foreground">{w.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-xs font-bold">
                        {w.itemCount} items
                      </Badge>
                    </TableCell>

                    <TableCell className="max-w-64 text-xs text-muted-foreground truncate">
                      {w.items.map((i) => i.name).join(", ")}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {w.lastUpdated}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedWishlist(w)}
                        className="h-8 text-xs rounded-lg cursor-pointer gap-1"
                      >
                        <Eye className="size-3.5" />
                        <span>View Items</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Wishlist Items Drawer */}
      <Sheet open={Boolean(selectedWishlist)} onOpenChange={(open) => !open && setSelectedWishlist(null)}>
        <SheetContent side="right" className="w-80 sm:w-96 p-0 flex flex-col border-l">
          {selectedWishlist && (
            <>
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center gap-2 font-display text-base font-bold">
                  <Heart className="size-5 text-rose-500 fill-current" />
                  <span>{selectedWishlist.customer}'s Wishlist</span>
                </SheetTitle>
              </SheetHeader>

              <div className="p-4 border-b bg-muted/20">
                <p className="text-xs text-muted-foreground">{selectedWishlist.email}</p>
                <p className="text-xs font-medium text-foreground mt-1">
                  Total Saved: {selectedWishlist.itemCount} items
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 divide-y">
                {selectedWishlist.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">${item.price}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-bold ${
                        item.stock === "In Stock"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : item.stock === "Low Stock"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {item.stock}
                    </Badge>
                  </div>
                ))}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
