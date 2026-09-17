import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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

const INITIAL_CATEGORIES = [
  {
    id: "cat-1",
    name: "Electronics",
    slug: "electronics",
    subcategories: ["Smartphones", "Laptops", "Audio", "Wearables"],
    productCount: 142,
    status: "active",
  },
  {
    id: "cat-2",
    name: "Fashion & Apparel",
    slug: "fashion",
    subcategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories"],
    productCount: 215,
    status: "active",
  },
  {
    id: "cat-3",
    name: "Home & Living",
    slug: "home-living",
    subcategories: ["Furniture", "Decor", "Kitchenware", "Lighting"],
    productCount: 98,
    status: "active",
  },
  {
    id: "cat-4",
    name: "Beauty & Personal Care",
    slug: "beauty",
    subcategories: ["Skincare", "Haircare", "Fragrance", "Makeup"],
    productCount: 84,
    status: "active",
  },
  {
    id: "cat-5",
    name: "Sports & Fitness",
    slug: "sports",
    subcategories: ["Gym Equipment", "Outdoor Gear", "Sportswear"],
    productCount: 65,
    status: "active",
  },
];

export default function Categories() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    subcategories: "",
  });

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const totalSubcategories = categories.reduce(
    (acc, curr) => acc + curr.subcategories.length,
    0
  );
  const totalProducts = categories.reduce(
    (acc, curr) => acc + curr.productCount,
    0
  );

  const handleOpenAdd = () => {
    setFormData({ name: "", slug: "", subcategories: "" });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      subcategories: category.subcategories.join(", "),
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const subs = formData.subcategories
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: formData.name,
                slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
                subcategories: subs,
              }
            : c
        )
      );
      setEditingCategory(null);
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
        subcategories: subs,
        productCount: 0,
        status: "active",
      };
      setCategories((prev) => [newCat, ...prev]);
      setIsAddOpen(false);
    }
  };

  const handleDelete = () => {
    if (deletingId) {
      setCategories((prev) => prev.filter((c) => c.id !== deletingId));
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("common.admin", "Administration")}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
            {t("navigation.categories", "Manage Categories")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize product categories and subcategories across your store catalog.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 rounded-xl cursor-pointer">
          <Plus className="size-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <FolderTree className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Categories</p>
              <p className="text-2xl font-bold font-display text-foreground">{categories.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <Layers className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Subcategories</p>
              <p className="text-2xl font-bold font-display text-foreground">{totalSubcategories}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Package className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Categorized Products</p>
              <p className="text-2xl font-bold font-display text-foreground">{totalProducts}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <Card className="rounded-2xl border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories or subcategories..."
            className="pl-9 rounded-xl"
          />
        </div>
      </Card>

      {/* Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((cat) => (
          <Card key={cat.id} className="rounded-2xl border overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="p-4 border-b bg-muted/20 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-bold font-display flex items-center gap-2">
                <FolderTree className="size-4 text-primary" />
                <span>{cat.name}</span>
              </CardTitle>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                {cat.productCount} products
              </Badge>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Subcategories ({cat.subcategories.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub, idx) => (
                    <Badge key={idx} variant="secondary" className="rounded-lg text-xs font-normal">
                      {sub}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="size-3.5" />
                  <span>Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(cat)}
                    className="h-8 px-2 text-xs rounded-lg cursor-pointer"
                  >
                    <Edit2 className="size-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingId(cat.id)}
                    className="h-8 px-2 text-xs text-destructive hover:text-destructive rounded-lg cursor-pointer"
                  >
                    <Trash2 className="size-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isAddOpen || Boolean(editingCategory)} onOpenChange={(open) => {
        if (!open) {
          setIsAddOpen(false);
          setEditingCategory(null);
        }
      }}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Category Name</Label>
              <Input
                id="cat-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Electronics"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat-slug">URL Slug</Label>
              <Input
                id="cat-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. electronics"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat-subs">Subcategories (comma separated)</Label>
              <Input
                id="cat-subs"
                value={formData.subcategories}
                onChange={(e) => setFormData({ ...formData, subcategories: e.target.value })}
                placeholder="Smartphones, Laptops, Audio"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => { setIsAddOpen(false); setEditingCategory(null); }}>
                Cancel
              </Button>
              <Button type="submit">Save Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={Boolean(deletingId)} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? Products assigned to this category will become uncategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
