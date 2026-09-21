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
import AdminPageHeader from "@/features/admin/components/AdminPageHeader";
import StatCard from "@/features/admin/dashboard/components/StatCard";

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

  const kpis = [
    {
      id: "active",
      title: t("admin.coupons.kpiActiveTitle"),
      description: t("admin.coupons.kpiActiveDescription"),
      value: activeCount,
      icon: Ticket,
    },
    {
      id: "redemptions",
      title: t("admin.coupons.kpiRedemptionsTitle"),
      description: t("admin.coupons.kpiRedemptionsDescription"),
      value: totalRedemptions,
      icon: Percent,
    },
    {
      id: "total",
      title: t("admin.coupons.kpiTotalTitle"),
      description: t("admin.coupons.kpiTotalDescription"),
      value: coupons.length,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        kicker={t("common.admin", "Administration")}
        title={t("navigation.coupons", "Manage Discount Coupons")}
        description={t("admin.coupons.description")}
        action={
          <Button onClick={handleOpenAdd} className="gap-2 rounded-xl cursor-pointer">
            <Plus className="size-4" />
            <span>{t("admin.coupons.create")}</span>
          </Button>
        }
      />

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
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

      {/* Filters Bar */}
      <Card className="rounded-2xl border p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("admin.coupons.searchPlaceholder")}
              className="pl-9 rounded-xl"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 rounded-xl">
              <SelectValue placeholder={t("admin.coupons.statusPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("admin.coupons.allStatus")}</SelectItem>
              <SelectItem value="active">{t("admin.statusLabel.active")}</SelectItem>
              <SelectItem value="inactive">{t("admin.statusLabel.inactive")}</SelectItem>
              <SelectItem value="expired">{t("admin.statusLabel.expired")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Coupons Table */}
      <Card className="rounded-2xl border overflow-hidden">
        <CardHeader className="p-4 border-b bg-muted/20">
          <CardTitle className="text-base font-bold font-display">
            {t("admin.coupons.tableTitle")} ({filtered.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>{t("admin.coupons.colCode")}</TableHead>
                <TableHead>{t("admin.coupons.colDiscount")}</TableHead>
                <TableHead>{t("admin.coupons.colMinOrder")}</TableHead>
                <TableHead>{t("admin.coupons.colUsage")}</TableHead>
                <TableHead>{t("admin.coupons.colExpiration")}</TableHead>
                <TableHead>{t("admin.coupons.colStatus")}</TableHead>
                <TableHead className="text-right">{t("admin.coupons.colActions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-sm">
                    {t("admin.coupons.emptyState")}
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
                        ? t("admin.coupons.percentOff", { value: c.discountValue })
                        : t("admin.coupons.amountOff", { value: c.discountValue })}
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
                          {t("admin.statusLabel.active")}
                        </Badge>
                      )}
                      {c.status === "inactive" && (
                        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-0 text-[10px] font-bold">
                          {t("admin.statusLabel.inactive")}
                        </Badge>
                      )}
                      {c.status === "expired" && (
                        <Badge className="bg-destructive/15 text-destructive border-0 text-[10px] font-bold">
                          {t("admin.statusLabel.expired")}
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
                          {c.status === "active" ? t("admin.coupons.deactivate") : t("admin.coupons.activate")}
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
              {editingCoupon ? t("admin.coupons.editTitle") : t("admin.coupons.addNewTitle")}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="coupon-code">{t("admin.coupons.codeLabel")}</Label>
              <Input
                id="coupon-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder={t("admin.coupons.codePlaceholder")}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t("admin.coupons.discountTypeLabel")}</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(val) => setFormData({ ...formData, discountType: val })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">{t("admin.coupons.typePercentage")}</SelectItem>
                    <SelectItem value="fixed">{t("admin.coupons.typeFixed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon-val">{t("admin.coupons.valueLabel")}</Label>
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
                <Label htmlFor="coupon-min">{t("admin.coupons.minOrderLabel")}</Label>
                <Input
                  id="coupon-min"
                  type="number"
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                  placeholder="50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon-limit">{t("admin.coupons.usageLimitLabel")}</Label>
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
              <Label htmlFor="coupon-exp">{t("admin.coupons.expirationLabel")}</Label>
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
                {t("common.cancel")}
              </Button>
              <Button type="submit">{t("admin.coupons.save")}</Button>
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
            <AlertDialogTitle>{t("admin.coupons.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.coupons.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
