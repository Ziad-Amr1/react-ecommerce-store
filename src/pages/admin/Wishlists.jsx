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

  const stockLabel = (value) => {
    switch (value) {
      case "In Stock":
        return t("admin.wishlists.stock.inStock", "In Stock");
      case "Low Stock":
        return t("admin.wishlists.stock.lowStock", "Low Stock");
      case "Out of Stock":
        return t("admin.wishlists.stock.outOfStock", "Out of Stock");
      default:
        return value;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("common.admin", "Administration")}
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
          {t("navigation.wishlists", "Manage Customer Wishlists")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("admin.wishlists.description", "Track high-demand saved products and analyze customer interest trends.")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-rose-500/15 text-rose-500">
              <Heart className="size-6 fill-current" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{t("admin.wishlists.activeWishlists", "Active Wishlists")}</p>
              <p className="text-2xl font-bold font-display text-foreground">{wishlists.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Package className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{t("admin.wishlists.totalSavedItems", "Total Saved Items")}</p>
              <p className="text-2xl font-bold font-display text-foreground">{totalSavedItems}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <Users className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{t("admin.wishlists.avgItems", "Avg Items / Wishlist")}</p>
              <p className="text-2xl font-bold font-display text-foreground">{avgItems}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
              <Sparkles className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{t("admin.wishlists.topSavedCategory", "Top Saved Category")}</p>
              <p className="text-base font-bold font-display text-foreground truncate max-w-[130px]">
                {t("admin.wishlists.topSavedCategoryValue", "Electronics")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="rounded-2xl border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("admin.wishlists.searchPlaceholder", "Search by customer name, email, or saved product...")}
            className="pl-9 rounded-xl"
          />
        </div>
      </Card>

      {/* Wishlists Table */}
      <Card className="rounded-2xl border overflow-hidden">
        <CardHeader className="p-4 border-b bg-muted/20">
          <CardTitle className="text-base font-bold font-display">
            {t("admin.wishlists.customerWishlists", { count: filtered.length })}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>{t("admin.wishlists.customer", "Customer")}</TableHead>
                <TableHead>{t("admin.wishlists.totalSavedItems", "Total Saved Items")}</TableHead>
                <TableHead>{t("admin.wishlists.sampleSavedProducts", "Sample Saved Products")}</TableHead>
                <TableHead>{t("admin.wishlists.lastUpdated", "Last Updated")}</TableHead>
                <TableHead className="text-right">{t("admin.wishlists.actions", "Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground text-sm">
                    {t("admin.wishlists.noMatch", "No wishlists match your search.")}
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
                        {t("admin.wishlists.items", { count: w.itemCount })}
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
                        <span>{t("admin.wishlists.viewItems", "View Items")}</span>
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
                  <span>{t("admin.wishlists.wishlist", { customer: selectedWishlist.customer })}</span>
                </SheetTitle>
              </SheetHeader>

              <div className="p-4 border-b bg-muted/20">
                <p className="text-xs text-muted-foreground">{selectedWishlist.email}</p>
                <p className="text-xs font-medium text-foreground mt-1">
                  {t("admin.wishlists.totalSaved", { count: selectedWishlist.itemCount })}
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
                      className={`text-[10px] font-bold ${item.stock === "In Stock"
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
