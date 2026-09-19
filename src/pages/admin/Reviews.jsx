import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Star,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    customer: "Omar Hassan",
    email: "omar.hassan@example.com",
    product: "Wireless Noise-Canceling Headphones",
    rating: 5,
    comment: "Excellent sound quality and very comfortable to wear for long listening sessions!",
    status: "approved",
    createdAt: "2026-09-15",
  },
  {
    id: "rev-2",
    customer: "Sarah Ahmed",
    email: "sarah.a@example.com",
    product: "Smart Fitness Watch",
    rating: 4,
    comment: "Great tracking features, battery life could be a little better but overall solid.",
    status: "approved",
    createdAt: "2026-09-14",
  },
  {
    id: "rev-3",
    customer: "Tarek Mansour",
    email: "tarek.m@example.com",
    product: "Ergonomic Office Chair",
    rating: 2,
    comment: "Assembly instructions were unclear and the lumbar support cushion was missing.",
    status: "pending",
    createdAt: "2026-09-16",
  },
  {
    id: "rev-4",
    customer: "Laila Farouk",
    email: "laila.f@example.com",
    product: "Organic Face Serum 30ml",
    rating: 5,
    comment: "Amazing product! My skin feels hydrated and fresh after just a few days of use.",
    status: "approved",
    createdAt: "2026-09-13",
  },
  {
    id: "rev-5",
    customer: "Kareem Zaki",
    email: "kareem.z@example.com",
    product: "Mechanical Gaming Keyboard",
    rating: 1,
    comment: "Received a damaged box and two keycaps were completely broken upon arrival.",
    status: "rejected",
    createdAt: "2026-09-12",
  },
];

export default function Reviews() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesRating =
      ratingFilter === "all" || r.rating === Number(ratingFilter);

    return matchesSearch && matchesStatus && matchesRating;
  });

  const avgRating = (
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;

  const handleUpdateStatus = (id, newStatus) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleDelete = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("common.admin", "Administration")}
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-foreground">
          {t("navigation.reviews", "Manage Reviews & Moderation")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review customer feedback, approve testimonials, and moderate product ratings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
              <Star className="size-6 fill-current" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Average Rating</p>
              <p className="text-2xl font-bold font-display text-foreground">{avgRating} / 5.0</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <MessageSquare className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Reviews</p>
              <p className="text-2xl font-bold font-display text-foreground">{reviews.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <AlertTriangle className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Pending Moderation</p>
              <p className="text-2xl font-bold font-display text-foreground">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Approved Reviews</p>
              <p className="text-2xl font-bold font-display text-foreground">{approvedCount}</p>
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
              placeholder="Search by customer name, product, or comment..."
              className="pl-9 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-36 rounded-xl">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Reviews Table */}
      <Card className="rounded-2xl border overflow-hidden">
        <CardHeader className="p-4 border-b bg-muted/20">
          <CardTitle className="text-base font-bold font-display">
            Customer Feedback ({filtered.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="max-w-md">Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                    No reviews matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {r.customer.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-xs text-foreground">{r.customer}</p>
                          <p className="text-[11px] text-muted-foreground">{r.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs font-medium text-foreground max-w-48 truncate">
                      {r.product}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-3.5 ${
                              i < r.rating ? "fill-current text-amber-500" : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="max-w-md text-xs text-muted-foreground leading-relaxed">
                      "{r.comment}"
                    </TableCell>

                    <TableCell>
                      {r.status === "approved" && (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 text-[10px] font-bold">
                          Approved
                        </Badge>
                      )}
                      {r.status === "pending" && (
                        <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-0 text-[10px] font-bold">
                          Pending
                        </Badge>
                      )}
                      {r.status === "rejected" && (
                        <Badge className="bg-destructive/15 text-destructive border-0 text-[10px] font-bold">
                          Rejected
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {r.status !== "approved" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(r.id, "approved")}
                            className="h-8 px-2 text-xs text-emerald-600 hover:bg-emerald-500/10 cursor-pointer"
                          >
                            <CheckCircle2 className="size-3.5 mr-1" />
                            Approve
                          </Button>
                        )}
                        {r.status !== "rejected" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(r.id, "rejected")}
                            className="h-8 px-2 text-xs text-amber-600 hover:bg-amber-500/10 cursor-pointer"
                          >
                            <XCircle className="size-3.5 mr-1" />
                            Reject
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(r.id)}
                          className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
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
    </div>
  );
}
