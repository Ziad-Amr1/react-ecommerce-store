import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Ticket,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Percent,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const INITIAL_COUPONS = [
  {
    id: "coup-1",
    code: "WELCOME20",
    discountType: "percentage",
    discountValue: 20,
    minOrder: 50,
    usageLimit: 500,
    usedCount: 142,
    expiresAt: "2026-12-31",
    status: "active",
  },
  {
    id: "coup-2",
    code: "SPRING30",
    discountType: "percentage",
    discountValue: 30,
    minOrder: 100,
    usageLimit: 200,
    usedCount: 89,
    expiresAt: "2026-10-15",
    status: "active",
  },
  {
    id: "coup-3",
    code: "FREESHIP",
    discountType: "fixed",
    discountValue: 15,
    minOrder: 30,
    usageLimit: 1000,
    usedCount: 420,
    expiresAt: "2026-11-30",
    status: "active",
  },
  {
    id: "coup-4",
    code: "FLASH50",
    discountType: "percentage",
    discountValue: 50,
    minOrder: 150,
    usageLimit: 50,
    usedCount: 50,
    expiresAt: "2026-08-31",
    status: "expired",
  },
];

export default function Coupons() {
  const { t } = useTranslation();
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrder: "",
    usageLimit: "",
    expiresAt: "",
  });

  const filtered = coupons.filter((c) => {
    const matchesSearch = c.code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = coupons.filter((c) => c.status === "active").length;
  const totalRedemptions = coupons.reduce((acc, c) => acc + c.usedCount, 0);

  const handleOpenAdd = () => {
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrder: "0",
      usageLimit: "100",
      expiresAt: "",
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrder: String(coupon.minOrder),
      usageLimit: String(coupon.usageLimit),
      expiresAt: coupon.expiresAt,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...c,
                code: formData.code.toUpperCase(),
                discountType: formData.discountType,
                discountValue: Number(formData.discountValue),
                minOrder: Number(formData.minOrder),
                usageLimit: Number(formData.usageLimit),
                expiresAt: formData.expiresAt || c.expiresAt,
              }
            : c
        )
      );
      setEditingCoupon(null);
    } else {
      const newCoupon = {
        id: `coup-${Date.now()}`,
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrder: Number(formData.minOrder),
        usageLimit: Number(formData.usageLimit) || 100,
        usedCount: 0,
        expiresAt: formData.expiresAt || "2026-12-31",
        status: "active",
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      setIsAddOpen(false);
    }
  };

  const handleToggleStatus = (id) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c
      )
    );
  };

  const handleDelete = () => {
    if (deletingId) {
      setCoupons((prev) => prev.filter((c) => c.id !== deletingId));
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("common.admin", "Administration")}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
            {t("navigation.coupons", "Manage Discount Coupons")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create promotional codes, manage usage limits, and track redemption metrics.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 rounded-xl cursor-pointer">
          <Plus className="size-4" />
          <span>Create Coupon</span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Ticket className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Active Coupons</p>
              <p className="text-2xl font-bold font-display text-foreground">{activeCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Percent className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Redemptions</p>
              <p className="text-2xl font-bold font-display text-foreground">{totalRedemptions}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Coupons</p>
              <p className="text-2xl font-bold font-display text-foreground">{coupons.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card className="rounded-2xl border p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by promo code..."
              className="pl-9 rounded-xl"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Coupons Table */}
      <Card className="rounded-2xl border overflow-hidden">
        <CardHeader className="p-4 border-b bg-muted/20">
          <CardTitle className="text-base font-bold font-display">
            Promo Codes & Discounts ({filtered.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min. Order</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-sm">
                    No coupons found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-sm font-bold text-primary">
                      {c.code}
                    </TableCell>

                    <TableCell className="text-xs font-semibold text-foreground">
                      {c.discountType === "percentage"
                        ? `${c.discountValue}% OFF`
                        : `$${c.discountValue} OFF`}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      ${c.minOrder}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {c.usedCount} / {c.usageLimit}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {c.expiresAt}
                    </TableCell>

                    <TableCell>
                      {c.status === "active" && (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 text-[10px] font-bold">
                          Active
                        </Badge>
                      )}
                      {c.status === "inactive" && (
                        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-0 text-[10px] font-bold">
                          Inactive
                        </Badge>
                      )}
                      {c.status === "expired" && (
                        <Badge className="bg-destructive/15 text-destructive border-0 text-[10px] font-bold">
                          Expired
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(c.id)}
                          className="h-8 text-xs rounded-lg cursor-pointer"
                        >
                          {c.status === "active" ? (
                            <XCircle className="size-3.5 mr-1 text-amber-500" />
                          ) : (
                            <CheckCircle2 className="size-3.5 mr-1 text-emerald-500" />
                          )}
                          {c.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(c)}
                          className="h-8 text-xs rounded-lg cursor-pointer"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingId(c.id)}
                          className="h-8 text-xs text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog
        open={isAddOpen || Boolean(editingCoupon)}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOpen(false);
            setEditingCoupon(null);
          }
        }}
      >
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? "Edit Coupon" : "Create New Promo Coupon"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="coupon-code">Promo Code</Label>
              <Input
                id="coupon-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. SUMMER25"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(val) => setFormData({ ...formData, discountType: val })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon-val">Value</Label>
                <Input
                  id="coupon-val"
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  placeholder="20"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="coupon-min">Min Order ($)</Label>
                <Input
                  id="coupon-min"
                  type="number"
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                  placeholder="50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon-limit">Usage Limit</Label>
                <Input
                  id="coupon-limit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  placeholder="200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coupon-exp">Expiration Date</Label>
              <Input
                id="coupon-exp"
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingCoupon(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save Coupon</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this promo code? Customers will no longer be able to redeem it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
