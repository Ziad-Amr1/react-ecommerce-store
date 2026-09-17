import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Download,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

const REVENUE_DATA_7D = [
  { day: "Mon", revenue: 4200, orders: 32 },
  { day: "Tue", revenue: 5800, orders: 45 },
  { day: "Wed", revenue: 6100, orders: 50 },
  { day: "Thu", revenue: 7400, orders: 62 },
  { day: "Fri", revenue: 8900, orders: 78 },
  { day: "Sat", revenue: 9600, orders: 85 },
  { day: "Sun", revenue: 8100, orders: 70 },
];

const REVENUE_DATA_30D = [
  { day: "Week 1", revenue: 28400, orders: 240 },
  { day: "Week 2", revenue: 34200, orders: 295 },
  { day: "Week 3", revenue: 38900, orders: 330 },
  { day: "Week 4", revenue: 42100, orders: 360 },
];

const CATEGORY_SALES = [
  { category: "Electronics", sales: 48500 },
  { category: "Fashion", sales: 32400 },
  { category: "Home & Living", sales: 21800 },
  { category: "Beauty", sales: 18600 },
  { category: "Sports", sales: 14200 },
];

const TOP_PRODUCTS = [
  { name: "Wireless Noise-Canceling Headphones", sales: 284, revenue: "$34,080" },
  { name: "Smart Fitness Watch V2", sales: 210, revenue: "$44,100" },
  { name: "Ergonomic Office Chair", sales: 145, revenue: "$26,100" },
  { name: "Organic Skin Serum 30ml", sales: 320, revenue: "$13,440" },
  { name: "Mechanical Gaming Keyboard", sales: 180, revenue: "$17,100" },
];

export default function Reports() {
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState("7d");

  const chartData = timeframe === "7d" ? REVENUE_DATA_7D : REVENUE_DATA_30D;

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Day,Revenue,Orders\n" +
      chartData.map((e) => `${e.day},${e.revenue},${e.orders}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `store_analytics_report_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            {t("navigation.reports", "Reports & Business Analytics")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Analyze sales performance, revenue growth trends, and category distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-36 rounded-xl">
              <Calendar className="size-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleExportCSV} variant="outline" className="gap-2 rounded-xl cursor-pointer">
            <Download className="size-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Revenue</p>
              <p className="text-2xl font-bold font-display text-foreground">$143,600</p>
              <span className="text-[10px] text-emerald-600 font-semibold">+14.2% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <ShoppingBag className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Orders</p>
              <p className="text-2xl font-bold font-display text-foreground">1,225</p>
              <span className="text-[10px] text-emerald-600 font-semibold">+8.5% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <TrendingUp className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Avg Order Value</p>
              <p className="text-2xl font-bold font-display text-foreground">$117.20</p>
              <span className="text-[10px] text-emerald-600 font-semibold">+5.1% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
              <Users className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Conversion Rate</p>
              <p className="text-2xl font-bold font-display text-foreground">3.42%</p>
              <span className="text-[10px] text-emerald-600 font-semibold">+0.8% vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend Area Chart */}
        <Card className="rounded-2xl border p-5">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base font-bold font-display flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              <span>Revenue Growth Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" stroke="var(--color-text-secondary)" fontSize={12} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={12} />
                <RechartsTooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Sales Bar Chart */}
        <Card className="rounded-2xl border p-5">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base font-bold font-display flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <span>Sales by Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_SALES}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="category" stroke="var(--color-text-secondary)" fontSize={11} />
                <YAxis stroke="var(--color-text-secondary)" fontSize={12} />
                <RechartsTooltip />
                <Bar dataKey="sales" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card className="rounded-2xl border overflow-hidden">
        <CardHeader className="p-4 border-b bg-muted/20">
          <CardTitle className="text-base font-bold font-display">
            Top Performing Products
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {TOP_PRODUCTS.map((prod, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-accent/30 border">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-bold text-xs">
                    #{idx + 1}
                  </Badge>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{prod.name}</p>
                    <p className="text-[11px] text-muted-foreground">{prod.sales} units sold</p>
                  </div>
                </div>
                <span className="font-display font-bold text-xs text-primary">{prod.revenue}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
