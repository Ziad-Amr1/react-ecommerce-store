import { useState } from "react";

import {
  Apple,
  Banknote,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  CreditCard,
  Headphones,
  Heart,
  Inbox,
  Info,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Star,
  StarHalf,
  Tag,
  TriangleAlert,
  Truck,
  Wallet,
  X,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const resolveCssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || `var(${name})`;

const colorTokens = [
  {
    name: "--color-primary",
    role: "Primary",
    description: "Main brand color, primary CTA, main actions",
    text: "#FFFFFF",
  },
  {
    name: "--color-secondary",
    role: "Secondary",
    description: "Secondary actions and secondary UI",
    text: "#FFFFFF",
  },
  {
    name: "--color-accent",
    role: "Accent",
    description: "Highlights, emphasis, subtle selections",
    text: "#253237",
  },
  {
    name: "--color-supporting",
    role: "Supporting",
    description: "Subtle UI, borders and dividers",
    text: "#253237",
  },
  {
    name: "--color-supporting-decorative",
    role: "Decorative",
    description: "Decorative elements and subtle UI",
    text: "#253237",
  },
  {
    name: "--color-background",
    role: "Background",
    description: "Main application background",
    text: "#253237",
  },
  {
    name: "--color-surface",
    role: "Surface",
    description: "Cards, navigation, panels",
    text: "#253237",
  },
  {
    name: "--color-surface-secondary",
    role: "Surface Secondary",
    description: "Subtle neutral surfaces",
    text: "#253237",
  },
  {
    name: "--color-surface-muted",
    role: "Surface Muted",
    description: "Soft branded sections",
    text: "#253237",
  },
  {
    name: "--color-text-primary",
    role: "Text Primary",
    description: "Main readable text",
    text: "#FFFFFF",
  },
  {
    name: "--color-text-secondary",
    role: "Text Secondary",
    description: "Secondary content",
    text: "#FFFFFF",
  },
  {
    name: "--color-link",
    role: "Link",
    description: "Links and informational interactive text",
    text: "#FFFFFF",
  },
  {
    name: "--color-focus-ring",
    role: "Focus Ring",
    description: "Keyboard focus indicator",
    text: "#FFFFFF",
  },
];

const feedbackTokens = [
  {
    name: "Success",
    token: "--color-success",
    on: "#FFFFFF",
    description: "Positive actions and valid states",
  },
  {
    name: "Warning",
    token: "--color-warning",
    on: "#FFFFFF",
    description: "Caution and pending states",
  },
  {
    name: "Error",
    token: "--color-error",
    on: "#FFFFFF",
    description: "Errors and destructive states",
  },
  {
    name: "Info",
    token: "--color-info",
    on: "#FFFFFF",
    description: "Informational states",
  },
];

const spacingTokens = [
  ["--space-1", "4px"],
  ["--space-2", "8px"],
  ["--space-3", "12px"],
  ["--space-4", "16px"],
  ["--space-5", "20px"],
  ["--space-6", "24px"],
  ["--space-8", "32px"],
  ["--space-10", "40px"],
  ["--space-12", "48px"],
  ["--space-14", "56px"],
  ["--space-16", "64px"],
  ["--space-20", "80px"],
];

const radiusTokens = [
  ["--radius-none", "0px"],
  ["--radius-sm", "4px"],
  ["--radius-md", "8px"],
  ["--radius-lg", "12px"],
  ["--radius-xl", "16px"],
  ["--radius-2xl", "24px"],
  ["--radius-full", "9999px"],
];

const shadowTokens = ["--shadow-sm", "--shadow-md", "--shadow-lg", "--shadow-xl"];

const breakpointTokens = [
  ["--breakpoint-sm", "640px"],
  ["--breakpoint-md", "768px"],
  ["--breakpoint-lg", "1024px"],
  ["--breakpoint-xl", "1280px"],
  ["--breakpoint-2xl", "1536px"],
];

const zIndexTokens = [
  ["--z-base", "0"],
  ["--z-toolbar", "5"],
  ["--z-nav", "10"],
  ["--z-dropdown", "50"],
  ["--z-popover", "60"],
  ["--z-modal", "100"],
  ["--z-toast", "200"],
];

function Section({ eyebrow, title, description, children }) {
  return (
    <section className="space-y-6">
      <div className="space-y-1">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
            {eyebrow}
          </p>
        )}

        <h2 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
          {title}
        </h2>

        {description && (
          <p className="max-w-3xl text-sm leading-6 text-[var(--color-text-secondary)]">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

function TokenTable({ tokens }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="grid grid-cols-[1.4fr_100px_1fr] border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
        <span>Token</span>
        <span>Value</span>
        <span>Visual</span>
      </div>

      <div className="divide-y divide-[var(--color-border)]">
        {tokens.map(([name, value]) => (
          <div
            key={name}
            className="grid grid-cols-[1.4fr_100px_1fr] items-center gap-4 px-4 py-4"
          >
            <code className="font-mono text-sm text-[var(--color-text-primary)]">
              {name}
            </code>

            <span className="font-mono text-xs text-[var(--color-text-secondary)]">
              {value}
            </span>

            <div className="flex items-center gap-4">
              <div
                className="h-8 w-24 rounded-md border border-black/10"
                style={{
                  width: name.startsWith("--space")
                    ? `min(${value}, 160px)`
                    : undefined,
                  background: name.startsWith("--space")
                    ? "var(--color-primary)"
                    : undefined,
                  boxShadow: name.startsWith("--shadow")
                    ? value
                    : undefined,
                }}
              >
                {!name.startsWith("--space") && !name.startsWith("--shadow") && (
                  <div
                    className="h-full w-full rounded-md"
                    style={{
                      background:
                        name.startsWith("--radius") && name.includes("full")
                          ? "var(--color-accent)"
                          : undefined,
                    }}
                  />
                )}
              </div>

              {name.startsWith("--radius") && (
                <div
                  className="h-10 w-20 border-2 border-[var(--color-primary)] bg-[var(--color-accent)]"
                  style={{ borderRadius: value }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ColorSwatch({ token }) {
  const resolved = resolveCssVar(token.name);

  return (
    <Card className="overflow-hidden border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
      <div
        className="h-28 border-b border-black/10"
        style={{
          background: `var(${token.name})`,
        }}
      >
        <div className="flex h-full items-end justify-between p-4">
          <span
            className="rounded-md bg-white/70 px-2 py-1 font-mono text-xs backdrop-blur"
            style={{
              color: "var(--color-text-primary)",
            }}
          >
            {resolved}
          </span>

          <span
            className="rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{
              background: token.text === "#FFFFFF" ? "rgba(255,255,255,.15)" : "rgba(255,255,255,.7)",
              color: token.text,
            }}
          >
            {token.role}
          </span>
        </div>
      </div>

      <CardContent className="space-y-2 p-4">
        <div>
          <p className="font-mono text-xs text-[var(--color-text-secondary)]">
            {token.name}
          </p>

          <h3 className="mt-1 font-display text-base font-semibold text-[var(--color-text-primary)]">
            {token.role}
          </h3>
        </div>

        <p className="text-sm leading-5 text-[var(--color-text-secondary)]">
          {token.description}
        </p>
      </CardContent>
    </Card>
  );
}

function FeedbackCard({ token }) {
  const solid = resolveCssVar(token.token);
  const soft = resolveCssVar(`${token.token}-bg`);

  return (
    <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-lg">
          {token.name}
        </CardTitle>

        <p className="font-mono text-xs text-[var(--color-text-secondary)]">
          {token.token}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-lg p-4"
            style={{
              background: solid,
              color: token.on,
            }}
          >
            <p className="text-sm font-semibold">Solid</p>
            <p className="mt-1 font-mono text-xs opacity-90">
              {solid}
            </p>
          </div>

          <div
            className="rounded-lg border border-black/5 p-4"
            style={{
              background: soft,
              color: solid,
            }}
          >
            <p className="text-sm font-semibold">Soft</p>
            <p className="mt-1 font-mono text-xs opacity-90">
              {soft}
            </p>
          </div>
        </div>

        <p className="text-sm text-[var(--color-text-secondary)]">
          {token.description}
        </p>
      </CardContent>
    </Card>
  );
}

function ComponentPlayground() {
  const [selected, setSelected] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Buttons */}
      <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
        <CardHeader>
          <CardTitle className="font-display">
            Buttons
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button className="bg-[var(--color-primary)] text-primary-foreground hover:bg-[var(--color-secondary)]">
              Primary
            </Button>

            <Button
              variant="outline"
              className="border-[var(--color-supporting)] text-[var(--color-primary)] hover:bg-[var(--color-accent)]"
            >
              Secondary
            </Button>

            <Button className="bg-[var(--color-secondary)] text-secondary-foreground hover:bg-[var(--color-primary)]">
              Secondary Filled
            </Button>

            <Button
              variant="ghost"
              className="text-[var(--color-primary)] hover:bg-[var(--color-accent)]"
            >
              Ghost
            </Button>

            <Button disabled>Disabled</Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-xs font-medium text-[var(--color-text-secondary)]">
              Focus
            </p>

            <Button
              className="
                bg-[var(--color-primary)]
                text-primary-foreground
                ring-2
                ring-offset-2
                ring-[var(--color-focus-ring)]
              "
            >
              Focused Button
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
        <CardHeader>
          <CardTitle className="font-display">
            Inputs
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">
              Product search
            </label>

            <Input
              placeholder="Search products..."
              className="
                border-[var(--color-border)]
                bg-[var(--color-surface)]
                text-[var(--color-text-primary)]
                placeholder:text-[var(--color-text-secondary)]
                focus-visible:ring-[var(--color-focus-ring)]
              "
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">
              Disabled
            </label>

            <Input
              disabled
              placeholder="Disabled input"
              className="border-[var(--color-border)]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
        <CardHeader>
          <CardTitle className="font-display">
            E-commerce Badges
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge
              className="border-transparent"
              style={{
                background: "var(--color-success-bg)",
                color: "var(--color-success)",
              }}
            >
              In Stock
            </Badge>

            <Badge
              className="border-transparent"
              style={{
                background: "var(--color-error-bg)",
                color: "var(--color-error)",
              }}
            >
              Low Stock
            </Badge>

            <Badge
              className="border"
              style={{
                background: "var(--color-accent)",
                color: "var(--color-text-primary)",
                borderColor: "var(--color-supporting)",
              }}
            >
              New
            </Badge>

            <Badge
              className="border-transparent"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-accent)",
              }}
            >
              Bestseller
            </Badge>

            <Badge
              className="border"
              style={{
                background: "var(--color-warning-bg)",
                color: "var(--color-warning)",
                borderColor: "var(--color-border)",
              }}
            >
              Limited
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Selection */}
      <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
        <CardHeader>
          <CardTitle className="font-display">
            Selection State
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <button
            type="button"
            onClick={() => setSelected((value) => !value)}
            className={`
              flex w-full items-center justify-between rounded-xl border p-4 text-left
              transition
              ${
                selected
                  ? "border-[var(--color-primary)] bg-[var(--color-accent)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-supporting)]"
              }
            `}
          >
            <div>
              <p className="font-display font-semibold text-[var(--color-text-primary)]">
                Product option
              </p>

              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Click to test selected / default state
              </p>
            </div>

            <div
              className={`
                h-5 w-5 rounded-full border
                ${
                  selected
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                    : "border-[var(--color-border-strong)]"
                }
              `}
            />
          </button>

          <p className="font-mono text-xs text-[var(--color-text-secondary)]">
            State: {selected ? "selected" : "default"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const statusBadges = [
  {
    label: "In Stock",
    token: "--color-success",
    bg: "var(--color-success-bg)",
    note: "success / stock",
    Icon: CircleCheck,
  },
  {
    label: "Low Stock · 3 LEFT",
    token: "--color-warning",
    bg: "var(--color-warning-bg)",
    note: "warning / scarcity",
    Icon: TriangleAlert,
  },
  {
    label: "Sold Out",
    token: "--color-error",
    bg: "var(--color-error-bg)",
    note: "error / unavailable",
    Icon: CircleX,
  },
  {
    label: "Back Soon",
    token: "--color-info",
    bg: "var(--color-info-bg)",
    note: "info / restock",
    Icon: Info,
  },
];

const commerceBadges = [
  {
    label: "SALE −20%",
    note: "solid error · high emphasis",
    className:
      "border-transparent bg-[var(--color-error)] text-[var(--color-on-error)]",
  },
  {
    label: "NEW",
    note: "accent · soft brand tint",
    className:
      "border-[var(--color-supporting)] bg-[var(--color-accent)] text-[var(--color-text-primary)]",
  },
  {
    label: "FEATURED",
    note: "solid primary · brand emphasis",
    className:
      "border-transparent bg-[var(--color-primary)] text-[var(--color-on-primary)]",
  },
  {
    label: "BESTSELLER",
    note: "soft warning · popularity",
    className:
      "border-transparent bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
  },
  {
    label: "LIMITED",
    note: "outline · restrained",
    className:
      "border-[var(--color-border-strong)] bg-transparent text-[var(--color-text-secondary)]",
  },
  {
    label: "FREE SHIPPING",
    note: "soft info · service tone",
    className:
      "border-transparent bg-[var(--color-info-bg)] text-[var(--color-info)]",
  },
];

const alertExamples = [
  {
    key: "success",
    title: "Order placed successfully.",
    description:
      "Order #10293 is confirmed. A receipt is on its way to your inbox.",
    color: "var(--color-success)",
    bg: "var(--color-success-bg)",
    token: "--color-success",
    Icon: CircleCheck,
  },
  {
    key: "warning",
    title: "Only 3 items left.",
    description:
      "This item is selling fast. Add it to your cart before it sells out.",
    color: "var(--color-warning)",
    bg: "var(--color-warning-bg)",
    token: "--color-warning",
    Icon: TriangleAlert,
  },
  {
    key: "error",
    title: "Payment failed.",
    description:
      "We could not process your payment. Check your card details and try again.",
    color: "var(--color-error)",
    bg: "var(--color-error-bg)",
    token: "--color-error",
    Icon: CircleX,
  },
  {
    key: "info",
    title: "Your session is about to expire.",
    description:
      "You will be signed out in 5 minutes. Continue browsing to stay signed in.",
    color: "var(--color-info)",
    bg: "var(--color-info-bg)",
    token: "--color-info",
    Icon: Info,
  },
];

const miniCartItems = [
  { name: "Aurora Wireless Headset", unit: 49, qty: 2, Icon: Headphones },
  { name: "Nord Foldable Desk", unit: 129, qty: 1, Icon: Package },
];

function GroupHeading({ label }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
        {label}
      </h2>
      <Separator className="flex-1" />
    </div>
  );
}

function Stars({ value, label }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={label ?? `Rated ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((position) => {
        const filled = value >= position;
        const half = !filled && value > position - 1;
        const Icon = half && position === Math.ceil(value) ? StarHalf : Star;
        const active = filled || half;

        return (
          <Icon
            key={position}
            aria-hidden="true"
            className={
              active
                ? "size-4 fill-[var(--color-warning)] text-[var(--color-warning)]"
                : "size-4 text-[var(--color-border-strong)]"
            }
          />
        );
      })}
    </div>
  );
}

function StatusBadgesDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statusBadges.map((badge) => (
        <Card
          key={badge.label}
          className="gap-3 border-[var(--color-border)] py-5 shadow-[var(--shadow-sm)]"
        >
          <CardContent className="flex flex-col items-start gap-4 px-5">
            <Badge
              variant="outline"
              className="border-transparent px-2.5 py-1 text-xs font-semibold"
              style={{
                backgroundColor: badge.bg,
                color: `var(${badge.token})`,
              }}
            >
              <badge.Icon aria-hidden="true" />
              {badge.label}
            </Badge>

            <p className="font-mono text-[11px] leading-5 text-[var(--color-text-secondary)]">
              {badge.token}
              <br />
              {`${badge.token}-bg`}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CommerceBadgesDemo() {
  return (
    <Card className="border-[var(--color-border)] py-6">
      <CardContent className="flex flex-wrap items-start gap-x-8 gap-y-6 px-6">
        {commerceBadges.map((badge) => (
          <div key={badge.label} className="flex flex-col items-start gap-2">
            <Badge variant="outline" className={badge.className}>
              {badge.label}
            </Badge>

            <span className="font-mono text-[11px] text-[var(--color-text-secondary)]">
              {badge.note}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AlertsDemo() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {alertExamples.map((example) => (
        <div key={example.key} className="space-y-2">
          <Alert
            className="border bg-[var(--color-surface)]"
            style={{ backgroundColor: example.bg, borderColor: example.color }}
          >
            <example.Icon aria-hidden="true" style={{ color: example.color }} />
            <AlertTitle style={{ color: example.color }}>
              {example.title}
            </AlertTitle>
            <AlertDescription>{example.description}</AlertDescription>
          </Alert>

          <p className="pl-1 font-mono text-[11px] text-[var(--color-text-secondary)]">
            {example.token} · {`${example.token}-bg`}
          </p>
        </div>
      ))}
    </div>
  );
}

function FormControlsDemo() {
  const [quantity, setQuantity] = useState(2);

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <Card className="gap-4 border-[var(--color-border)] py-6">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base">Text &amp; Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 px-6">
          <div className="space-y-2">
            <Label htmlFor="product-search">Search products</Label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--color-text-secondary)]"
                aria-hidden="true"
              />
              <Input
                id="product-search"
                type="search"
                placeholder="Search headphones, desks..."
                className="bg-[var(--color-surface)] pl-9 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full-name">Full name</Label>
            <Input
              id="full-name"
              placeholder="Alex Morgan"
              className="bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="gap-4 border-[var(--color-border)] py-6">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base">Dropdown &amp; Multiline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 px-6">
          <div className="space-y-2">
            <Label htmlFor="category-select">Category</Label>
            <Select defaultValue="headphones">
              <SelectTrigger
                id="category-select"
                className="w-full bg-[var(--color-surface)]"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="headphones">Headphones</SelectItem>
                <SelectItem value="desks">Desks</SelectItem>
                <SelectItem value="lamps">Lamps</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery-notes">Delivery notes</Label>
            <Textarea
              id="delivery-notes"
              rows={3}
              placeholder="Leave at the front door..."
              className="bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="gap-4 border-[var(--color-border)] py-6">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base">Numeric &amp; Date</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 px-6">
          <div className="space-y-2">
            <Label htmlFor="cart-quantity">Quantity (max 5)</Label>
            <Input
              id="cart-quantity"
              type="number"
              inputMode="numeric"
              min={1}
              max={5}
              defaultValue={2}
              className="bg-[var(--color-surface)] text-[var(--color-text-primary)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery-date">Preferred delivery date</Label>
            <Input
              id="delivery-date"
              type="date"
              className="bg-[var(--color-surface)] text-[var(--color-text-primary)]"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="gap-4 border-[var(--color-border)] py-6">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base">Booleans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 px-6">
          <div className="flex items-center gap-3">
            <Checkbox id="terms" defaultChecked />
            <Label htmlFor="terms">I agree to the terms of sale</Label>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="restock-alert">Restock reminder</Label>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Email me when this item is back in stock
              </p>
            </div>
            <Switch id="restock-alert" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="gap-4 border-[var(--color-border)] py-6">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base">Radio &amp; Quantity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 px-6">
          <fieldset className="space-y-2">
            <legend className="text-sm leading-none font-medium text-[var(--color-text-primary)]">
              Shipping speed
            </legend>
            <RadioGroup defaultValue="standard" className="gap-2">
              {[
                { value: "standard", label: "Standard", hint: "3-5 days · $6.00" },
                { value: "express", label: "Express", hint: "1-2 days · $14.00" },
                { value: "priority", label: "Priority", hint: "Next day · $29.00" },
              ].map((option) => (
                <div key={option.value} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] px-3 py-2.5">
                  <label
                    htmlFor={`speed-${option.value}`}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <RadioGroupItem value={option.value} id={`speed-${option.value}`} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </label>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {option.hint}
                  </span>
                </div>
              ))}
            </RadioGroup>
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor="stepper-quantity">Quantity</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                aria-label="Decrease quantity"
              >
                <Minus aria-hidden="true" />
              </Button>
              <Input
                id="stepper-quantity"
                readOnly
                inputMode="numeric"
                aria-live="polite"
                value={quantity}
                className="h-9 w-14 bg-[var(--color-surface)] text-center text-[var(--color-text-primary)]"
              />
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => setQuantity((value) => value + 1)}
                aria-label="Increase quantity"
              >
                <Plus aria-hidden="true" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InputStatesDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div className="space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">Default</p>
          <span className="font-mono text-[10px] text-[var(--color-text-secondary)]">border-input</span>
        </div>
        <Input
          placeholder="Aurora Wireless Headset"
          className="bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
        />
        <p className="text-xs text-[var(--color-text-secondary)]">Standard resting state.</p>
      </div>

      <div className="space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">Hover</p>
          <span className="font-mono text-[10px] text-[var(--color-text-secondary)]">border-supporting</span>
        </div>
        <Input
          placeholder="Aurora Wireless Headset"
          className="border-[var(--color-supporting)] bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
        />
        <p className="text-xs text-[var(--color-text-secondary)]">Hovered border uses --color-supporting.</p>
      </div>

      <div className="space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">Focused</p>
          <span className="font-mono text-[10px] text-[var(--color-text-secondary)]">focus-ring</span>
        </div>
        <Input
          placeholder="Aurora Wireless Headset"
          className="border-ring bg-[var(--color-surface)] text-[var(--color-text-primary)] ring-[3px] ring-ring/50"
        />
        <p className="text-xs text-[var(--color-text-secondary)]">
          Focus ring draws from --color-focus-ring.
        </p>
      </div>

      <div className="space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="input-error-state" className="text-sm font-medium">
            Error
          </Label>
          <span className="font-mono text-[10px] text-[var(--color-text-secondary)]">aria-invalid · destructive</span>
        </div>
        <Input
          id="input-error-state"
          type="email"
          defaultValue="alex@"
          placeholder="you@example.com"
          aria-invalid="true"
          aria-describedby="email-error"
          className="bg-[var(--color-surface)] text-[var(--color-text-primary)]"
        />
        <p
          id="email-error"
          role="alert"
          className="text-xs text-[var(--color-error)]"
        >
          Please enter a valid email address.
        </p>
      </div>

      <div className="space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="input-success-state" className="text-sm font-medium">
            Success
          </Label>
          <span className="font-mono text-[10px] text-[var(--color-text-secondary)]">success border</span>
        </div>
        <Input
          id="input-success-state"
          type="email"
          defaultValue="alex@example.com"
          className="border-[var(--color-success)] bg-[var(--color-surface)] text-[var(--color-text-primary)]"
        />
        <p className="flex items-center gap-1.5 text-xs text-[var(--color-success)]">
          <CircleCheck className="size-3.5" aria-hidden="true" />
          Email verified.
        </p>
      </div>

      <div className="space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex items-center justify-between gap-3">
          <Label
            htmlFor="input-disabled-state"
            className="text-sm font-medium text-[var(--color-text-disabled)]"
          >
            Disabled
          </Label>
          <span className="font-mono text-[10px] text-[var(--color-text-disabled)]">opacity-50</span>
        </div>
        <Input
          id="input-disabled-state"
          disabled
          placeholder="Unavailable"
          className="bg-[var(--color-surface-muted)]"
        />
        <p className="text-xs text-[var(--color-text-disabled)]">
          This option is not selectable.
        </p>
      </div>
    </div>
  );
}

function PaginationDemo() {
  return (
    <Card className="border-[var(--color-border)] py-6">
      <CardContent className="flex flex-col items-start gap-4 px-6">
        <nav aria-label="Pagination">
          <ul className="flex flex-wrap items-center gap-2">
            <li>
              <Button variant="outline" size="sm" disabled aria-label="Previous page">
                <ChevronLeft aria-hidden="true" />
                Previous
              </Button>
            </li>
            <li>
              <Button
                size="sm"
                aria-current="page"
                className="bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-secondary)]"
              >
                1
              </Button>
            </li>
            <li>
              <Button variant="outline" size="sm">2</Button>
            </li>
            <li>
              <Button variant="outline" size="sm">3</Button>
            </li>
            <li>
              <Button variant="outline" size="sm" aria-label="Next page">
                Next
                <ChevronRight aria-hidden="true" />
              </Button>
            </li>
          </ul>
        </nav>

        <p className="font-mono text-[11px] leading-5 text-[var(--color-text-secondary)]">
          Active page: var(--color-primary) with aria-current="page".
          Previous is disabled on the first page.
        </p>
      </CardContent>
    </Card>
  );
}

function BreadcrumbsDemo() {
  const longTrail = ["Home", "Electronics", "Computers & Tablets", "Laptops", "Gaming Laptops"];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="gap-3 border-[var(--color-border)] py-6">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base">Product trail</CardTitle>
          <CardDescription>Home / Electronics / Laptops / Product</CardDescription>
        </CardHeader>
        <CardContent>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm">
              <li>
                <a
                  href="#"
                  className="text-[var(--color-link)] underline-offset-4 hover:text-[var(--color-link-hover)] hover:underline"
                >
                  Home
                </a>
              </li>
              <li aria-hidden="true" className="flex items-center text-[var(--color-text-disabled)]">
                <ChevronRight className="size-4" />
              </li>
              <li>
                <a
                  href="#"
                  className="text-[var(--color-link)] underline-offset-4 hover:text-[var(--color-link-hover)] hover:underline"
                >
                  Electronics
                </a>
              </li>
              <li aria-hidden="true" className="flex items-center text-[var(--color-text-disabled)]">
                <ChevronRight className="size-4" />
              </li>
              <li>
                <a
                  href="#"
                  className="text-[var(--color-link)] underline-offset-4 hover:text-[var(--color-link-hover)] hover:underline"
                >
                  Laptops
                </a>
              </li>
              <li aria-hidden="true" className="flex items-center text-[var(--color-text-disabled)]">
                <ChevronRight className="size-4" />
              </li>
              <li
                aria-current="page"
                className="font-medium text-[var(--color-text-primary)]"
              >
                Aurora Notebook 15
              </li>
            </ol>
          </nav>
        </CardContent>
      </Card>

      <Card className="gap-3 border-[var(--color-border)] py-6">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base">Long trail</CardTitle>
          <CardDescription>Wraps to multiple lines on narrow viewports.</CardDescription>
        </CardHeader>
        <CardContent>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm">
              {longTrail.map((item, index) => (
                <li key={item} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="flex items-center text-[var(--color-text-disabled)]"
                    >
                      <ChevronRight className="size-4" />
                    </span>
                  )}
                  {index === longTrail.length - 1 ? (
                    <span
                      aria-current="page"
                      className="font-medium text-[var(--color-text-primary)]"
                    >
                      {item}
                    </span>
                  ) : (
                    <a
                      href="#"
                      className="text-[var(--color-link)] underline-offset-4 hover:text-[var(--color-link-hover)] hover:underline"
                    >
                      {item}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductTabsDemo() {
  return (
    <Card className="gap-4 border-[var(--color-border)] py-6">
      <CardContent className="space-y-5 px-6">
        <Tabs defaultValue="description" className="w-full">
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews (124)</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6 space-y-3">
            <h3 className="font-display text-lg font-semibold">
              Aurora Notebook 15
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
              A 15-inch productivity laptop with a matte display, all-day battery
              and a full-size keyboard. Built for quiet coworking spaces and long
              coffee-shop sessions.
            </p>
          </TabsContent>

          <TabsContent value="specs" className="mt-6">
            <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              <div className="flex justify-between gap-4 border-b border-[var(--color-border)] py-2">
                <dt className="text-sm text-[var(--color-text-secondary)]">Display</dt>
                <dd className="text-sm font-medium">15.6" FHD</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[var(--color-border)] py-2">
                <dt className="text-sm text-[var(--color-text-secondary)]">Processor</dt>
                <dd className="text-sm font-medium">Octa-core</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[var(--color-border)] py-2">
                <dt className="text-sm text-[var(--color-text-secondary)]">Memory</dt>
                <dd className="text-sm font-medium">16 GB</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[var(--color-border)] py-2">
                <dt className="text-sm text-[var(--color-text-secondary)]">Battery</dt>
                <dd className="text-sm font-medium">Up to 12 h</dd>
              </div>
            </dl>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Stars value={4.8} label="Average customer rating 4.8 out of 5" />
              <p className="text-sm text-[var(--color-text-secondary)]">
                4.8 · 124 reviews
              </p>
            </div>
            <blockquote className="border-l-2 border-[var(--color-supporting)] pl-4 text-sm leading-6 text-[var(--color-text-secondary)]">
              “The keyboard is the best part — quiet, backlit and comfortable for
              full work days.”
            </blockquote>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6 space-y-3">
            <div className="flex items-start gap-3">
              <Truck
                className="mt-0.5 size-5 shrink-0 text-[var(--color-success)]"
                aria-hidden="true"
              />
              <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                Ships in 1-2 business days. Free standard shipping over $75,
                express options available at checkout.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <p className="font-mono text-[11px] leading-5 text-[var(--color-text-secondary)]">
          Tab states: default · hover · active underline · focus-visible ring
          (all handled by the shadcn Tabs primitive).
        </p>
      </CardContent>
    </Card>
  );
}

function ProductCardExample() {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="gap-4 overflow-hidden border-[var(--color-border)] py-0 shadow-[var(--shadow-md)]">
        <div className="relative m-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-[var(--color-surface-secondary)]">
          <Headphones
            className="size-20 text-[var(--color-supporting-decorative)]"
            aria-hidden="true"
          />
          <Badge
            variant="outline"
            className="absolute top-3 left-3 border-transparent bg-[var(--color-error)] px-2.5 text-[var(--color-on-error)]"
          >
            Sale −20%
          </Badge>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Add to wishlist"
            aria-pressed={wishlisted}
            onClick={() => setWishlisted((value) => !value)}
            className="absolute top-3 right-3 bg-[var(--color-surface)]/80 hover:bg-[var(--color-surface)]"
          >
            <Heart
              aria-hidden="true"
              className={
                wishlisted
                  ? "fill-[var(--color-error)] text-[var(--color-error)]"
                  : undefined
              }
            />
          </Button>
        </div>

        <CardContent className="space-y-4 px-5 pb-5">
          <div>
            <p className="font-mono text-[11px] tracking-wide text-[var(--color-text-secondary)] uppercase">
              Electronics · Audio
            </p>
            <h3 className="mt-1 font-display text-lg font-semibold text-[var(--color-text-primary)]">
              Aurora Wireless Headset
            </h3>
            <div className="mt-1.5 flex items-center gap-2">
              <Stars value={4.8} label="4.8 out of 5 stars, 124 reviews" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                4.8 <span className="text-[var(--color-text-disabled)]">(124)</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-baseline gap-2">
            <p className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
              $99.00
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] line-through">
              $129.00
            </p>
            <Badge
              variant="outline"
              className="border-transparent bg-[var(--color-error)] text-[var(--color-on-error)]"
            >
              −23%
            </Badge>
          </div>

          <p className="flex items-center gap-1.5 text-sm text-[var(--color-success)]">
            <CircleCheck className="size-4" aria-hidden="true" />
            In Stock
          </p>

          <div className="flex gap-2 pt-1">
            <Button
              className="flex-1 bg-[var(--color-primary)] text-primary-foreground hover:bg-[var(--color-secondary)]"
            >
              <ShoppingCart aria-hidden="true" />
              Add to Cart
            </Button>
            <Button variant="outline" aria-label="View product details">
              Details
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-4 border-[var(--color-border)] py-0">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base">Loading state</CardTitle>
          <CardDescription>Skeleton placeholder while product data loads.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-9 w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}

const galleryItems = [
  { label: "Front", Icon: Headphones },
  { label: "Side", Icon: Package },
  { label: "Detail", Icon: CircleCheck },
  { label: "Lifestyle", Icon: Heart },
];

function GalleryDemo() {
  const [active, setActive] = useState(0);
  const Item = galleryItems[active].Icon;

  const previous = () =>
    setActive((index) => (index - 1 + galleryItems.length) % galleryItems.length);
  const next = () => setActive((index) => (index + 1) % galleryItems.length);

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
      <div className="relative flex aspect-[4/3] items-center justify-center rounded-xl bg-[var(--color-surface-secondary)]">
        <Item
          className="size-24 text-[var(--color-supporting-decorative)]"
          aria-hidden="true"
        />
        <Badge
          variant="outline"
          className="absolute top-3 left-3 bg-[var(--color-surface)]"
        >
          {active + 1} / {galleryItems.length}
        </Badge>
        <Button
          variant="outline"
          size="icon"
          onClick={previous}
          aria-label="Previous image"
          className="absolute top-1/2 left-3 -translate-y-1/2 bg-[var(--color-surface)]"
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={next}
          aria-label="Next image"
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-[var(--color-surface)]"
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>

      <div className="flex gap-3 md:flex-col">
        {galleryItems.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`View ${item.label} image`}
            aria-pressed={index === active}
            className={`flex aspect-square w-20 items-center justify-center rounded-lg border-2 transition ${
              index === active
                ? "border-[var(--color-primary)] bg-[var(--color-accent)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-supporting)]"
            }`}
          >
            <item.Icon
              className="size-6 text-[var(--color-supporting-decorative)]"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function RatingDemo() {
  const ratings = [
    { value: 5, count: 412, label: "Excellent" },
    { value: 4.2, count: 58, label: "Good" },
    { value: 3, count: 12, label: "Average" },
    { value: 1.5, count: 3, label: "Poor" },
  ];

  return (
    <Card className="border-[var(--color-border)] py-6">
      <CardContent className="space-y-6 px-6">
        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-5">
          <div className="text-center">
            <p className="font-mono text-xs text-[var(--color-text-secondary)]">
              Average rating
            </p>
            <p className="font-display text-4xl font-bold text-[var(--color-text-primary)]">
              4.8
            </p>
            <div className="mt-2">
              <Stars value={4.8} label="Overall rating 4.8 out of 5" />
            </div>
            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
              124 reviews
            </p>
          </div>

          <p className="max-w-56 text-sm leading-6 text-[var(--color-text-secondary)]">
            Partial values render a half-filled star using --color-warning for
            the filled portion and --color-border-strong for empty stars.
          </p>
        </div>

        <ul className="space-y-3">
          {ratings.map((rating) => (
            <li key={rating.label} className="flex items-center gap-3">
              <Stars
                value={rating.value}
                label={`${rating.label}: ${rating.value} out of 5`}
              />
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {rating.value.toFixed(1)}
              </span>
              <span className="text-sm text-[var(--color-text-secondary)]">
                ({rating.count} reviews)
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function PriceDemo() {
  return (
    <Card className="border-[var(--color-border)] py-6">
      <CardContent className="space-y-4 px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-5">
            <p className="font-mono text-xs text-[var(--color-text-secondary)]">Standard</p>
            <p className="mt-2 font-display text-2xl font-bold text-[var(--color-text-primary)]">
              $129.00
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-5">
            <p className="font-mono text-xs text-[var(--color-text-secondary)]">Discounted</p>
            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <p className="font-display text-3xl font-bold text-[var(--color-primary)]">
                $99.00
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] line-through">
                $129.00
              </p>
              <Badge
                variant="outline"
                className="border-transparent bg-[var(--color-error)] text-[var(--color-on-error)]"
              >
                −23%
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="font-mono text-xs text-[var(--color-text-secondary)]">Range</p>
          <p className="mt-2 font-body text-lg font-medium text-[var(--color-text-primary)]">
            $80.00 <span className="text-[var(--color-text-secondary)]">–</span>{" "}
            $120.00
          </p>
        </div>

        <p className="font-mono text-[11px] leading-5 text-[var(--color-text-secondary)]">
          Hierarchy: current price (font-display, largest) · original price
          (muted, line-through) · discount (--color-error).
        </p>
      </CardContent>
    </Card>
  );
}

function CartItemDemo() {
  const [headsetQty, setHeadsetQty] = useState(2);

  return (
    <Card className="border-[var(--color-border)] py-6">
      <CardContent className="space-y-3 px-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <div className="flex size-20 items-center justify-center rounded-lg bg-[var(--color-surface-secondary)]">
            <Headphones
              className="size-8 text-[var(--color-supporting-decorative)]"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 flex-1 basis-40">
            <p className="font-medium leading-tight text-[var(--color-text-primary)]">
              Aurora Wireless Headset
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
              Color: Midnight · Bluetooth 5.3
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              $49.00 / unit
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setHeadsetQty((value) => Math.max(1, value - 1))}
              aria-label="Decrease quantity"
            >
              <Minus aria-hidden="true" />
            </Button>
            <span aria-live="polite" className="w-6 text-center font-mono text-sm">
              {headsetQty}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setHeadsetQty((value) => value + 1)}
              aria-label="Increase quantity"
            >
              <Plus aria-hidden="true" />
            </Button>
          </div>

          <p className="min-w-16 text-right font-display font-semibold text-[var(--color-text-primary)]">
            ${49 * headsetQty}.00
          </p>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Remove Aurora Wireless Headset from cart"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-error)]"
          >
            <X aria-hidden="true" />
          </Button>
        </div>

        <Separator />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <div className="flex size-20 items-center justify-center rounded-lg bg-[var(--color-surface-secondary)]">
            <Package
              className="size-8 text-[var(--color-supporting-decorative)]"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 flex-1 basis-40">
            <p className="font-medium leading-tight text-[var(--color-text-primary)]">
              Nord Foldable Desk
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
              Finish: Natural Oak
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              $129.00 / unit
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon-sm" disabled aria-label="Decrease quantity">
              <Minus aria-hidden="true" />
            </Button>
            <span className="w-6 text-center font-mono text-sm">1</span>
            <Button variant="outline" size="icon-sm" aria-label="Increase quantity">
              <Plus aria-hidden="true" />
            </Button>
          </div>

          <p className="min-w-16 text-right font-display font-semibold text-[var(--color-text-primary)]">
            $129.00
          </p>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Remove Nord Foldable Desk from cart"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-error)]"
          >
            <X aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniCartItems({ items }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.name} className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-[var(--color-surface-secondary)]">
            <item.Icon
              className="size-5 text-[var(--color-supporting-decorative)]"
              aria-hidden="true"
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-[var(--color-text-primary)]">
              {item.name}
            </span>
            <span className="block text-xs text-[var(--color-text-secondary)]">
              Qty {item.qty} · ${item.unit}.00
            </span>
          </span>
          <span className="font-display text-sm font-semibold text-[var(--color-text-primary)]">
            ${item.qty * item.unit}.00
          </span>
        </li>
      ))}
    </ul>
  );
}

function MiniCartDemo() {
  const subtotal = miniCartItems.reduce(
    (sum, item) => sum + item.qty * item.unit,
    0,
  );

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="gap-4 border-[var(--color-border)] py-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-display text-base">Mini Cart</CardTitle>
            <Badge variant="outline">2 items</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-6">
          <MiniCartItems items={miniCartItems} />
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">Subtotal</span>
            <span className="font-display font-semibold text-[var(--color-text-primary)]">
              ${subtotal}.00
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">View Cart</Button>
            <Button>
              <ShoppingCart aria-hidden="true" />
              Checkout
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-4 border-[var(--color-border)] py-6">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base">Cart Drawer</CardTitle>
          <CardDescription>
            The Sheet primitive opens the same summary in a right-side drawer.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full bg-[var(--color-primary)] text-primary-foreground hover:bg-[var(--color-secondary)]">
                <ShoppingCart aria-hidden="true" />
                Open cart drawer
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-4">
              <SheetHeader>
                <SheetTitle>Your Cart (2)</SheetTitle>
              </SheetHeader>
              <MiniCartItems items={miniCartItems} />
              <SheetFooter className="mt-auto gap-2">
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm text-[var(--color-text-secondary)]">Subtotal</span>
                  <span className="font-display font-semibold">${subtotal}.00</span>
                </div>
                <Button variant="outline" className="w-full">View Cart</Button>
                <Button className="w-full">Checkout</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 py-12 text-center lg:col-span-2">
        <Inbox
          className="size-10 text-[var(--color-supporting-decorative)]"
          aria-hidden="true"
        />
        <h3 className="mt-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">
          Your cart is empty
        </h3>
        <p className="mt-1 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
          Empty state: --color-surface with a dashed --color-border-strong
          container and muted supporting icon.
        </p>
        <Button variant="outline" className="mt-5">Start shopping</Button>
      </div>
    </div>
  );
}

function CouponDemo() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle");

  const applyCoupon = () => {
    setStatus(code.trim().toUpperCase() === "SAVE20" ? "applied" : "invalid");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="gap-4 border-[var(--color-border)] py-6">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base">Prompt</CardTitle>
          <CardDescription>Default field, applied and invalid outcomes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6">
          <div className="space-y-2">
            <Label htmlFor="coupon-code">Coupon code</Label>
            <div className="flex gap-2">
              <Input
                id="coupon-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Enter coupon code"
                aria-invalid={status === "invalid"}
                aria-describedby={
                  status === "invalid"
                    ? "coupon-invalid"
                    : status === "applied"
                      ? "coupon-applied"
                      : undefined
                }
                className="bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
              />
              <Button
                onClick={applyCoupon}
                className="shrink-0 bg-[var(--color-primary)] text-primary-foreground hover:bg-[var(--color-secondary)]"
              >
                Apply
              </Button>
            </div>

            {status === "idle" && (
              <p className="text-xs text-[var(--color-text-secondary)]">
                Tip: use code SAVE20.
              </p>
            )}

            {status === "applied" && (
              <div
                id="coupon-applied"
                role="status"
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-success)] bg-[var(--color-success-bg)] px-4 py-3"
              >
                <span className="flex items-center gap-2 text-sm text-[var(--color-success)]">
                  <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
                  <span>
                    <span className="font-mono font-semibold">SAVE20</span> applied
                    · −20%
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setCode("");
                  }}
                  className="text-xs text-[var(--color-text-secondary)] underline-offset-4 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}

            {status === "invalid" && (
              <p
                id="coupon-invalid"
                role="alert"
                className="text-xs text-[var(--color-error)]"
              >
                Invalid coupon code.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="gap-4 border-[var(--color-border)] py-6">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base">Applied example</CardTitle>
          <CardDescription>Static demonstration of the applied state.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 px-6">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-success)] bg-[var(--color-success-bg)] px-4 py-3">
            <span className="flex items-center gap-2 text-sm text-[var(--color-success)]">
              <Tag className="size-4 shrink-0" aria-hidden="true" />
              <span className="font-mono font-semibold">SAVE20</span>
              <span>· −20%</span>
            </span>
            <Badge
              variant="outline"
              className="border-[var(--color-success)] text-[var(--color-success)]"
            >
              Applied
            </Badge>
          </div>

          <p className="font-mono text-[11px] leading-5 text-[var(--color-text-secondary)]">
            Applied: --color-success + --color-success-bg. Invalid uses
            --color-error surfaced through aria-invalid.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentsDemo() {
  const [method, setMethod] = useState("card");

  const methods = [
    {
      value: "card",
      label: "Credit / Debit Card",
      hint: "Visa, Mastercard, Amex",
      Icon: CreditCard,
    },
    {
      value: "paypal",
      label: "PayPal",
      hint: "Link your PayPal balance",
      Icon: Wallet,
    },
    {
      value: "apple",
      label: "Apple Pay",
      hint: "Pay instantly",
      Icon: Apple,
    },
    {
      value: "cod",
      label: "Cash on Delivery",
      hint: "Pay when your order arrives",
      Icon: Banknote,
    },
  ];

  return (
    <Card className="border-[var(--color-border)] py-6">
      <CardContent className="space-y-4 px-6">
        <RadioGroup
          value={method}
          onValueChange={setMethod}
          className="grid gap-3 sm:grid-cols-2"
        >
          {methods.map((option) => (
            <div
              key={option.value}
              onClick={() => setMethod(option.value)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                method === option.value
                  ? "border-[var(--color-primary)] bg-[var(--color-accent)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-supporting)]"
              }`}
            >
              <RadioGroupItem
                value={option.value}
                id={`payment-${option.value}`}
                aria-labelledby={`payment-${option.value}-label`}
              />
              <option.Icon
                className="size-5 shrink-0 text-[var(--color-text-secondary)]"
                aria-hidden="true"
              />
              <span id={`payment-${option.value}-label`}>
                <span className="block text-sm font-medium text-[var(--color-text-primary)]">
                  {option.label}
                </span>
                <span className="block text-xs text-[var(--color-text-secondary)]">
                  {option.hint}
                </span>
              </span>
            </div>
          ))}
        </RadioGroup>

        <p className="font-mono text-[11px] text-[var(--color-text-secondary)]">
          Selected: {method} · radios expose state via role="radio" +
          aria-checked; containers highlight with --color-primary /
          --color-accent.
        </p>
      </CardContent>
    </Card>
  );
}

export default function DesignSystem() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      {/* Hero */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className="border"
                style={{
                  background: "var(--color-accent)",
                  color: "var(--color-primary)",
                  borderColor: "var(--color-supporting)",
                }}
              >
                Light Theme
              </Badge>

              <Badge
                variant="outline"
                className="border-[var(--color-border)] text-[var(--color-text-secondary)]"
              >
                Design System v1
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
                E-commerce Design System
              </h1>

              <p className="text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg">
                Visual playground for colors, typography, spacing, radius,
                shadows, states and shadcn/ui components.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="bg-[var(--color-primary)] text-primary-foreground hover:bg-[var(--color-secondary)]">
                Shop Now
              </Button>

              <Button
                variant="outline"
                className="border-[var(--color-supporting)] hover:bg-[var(--color-accent)]"
              >
                Explore Tokens
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-20 px-6 py-16 lg:px-8">
        {/* Brand */}
        <Section
          eyebrow="01 / Colors"
          title="Brand & Core Colors"
          description="The core palette defines the visual identity of the store. Primary and secondary colors carry the brand, while accent and supporting colors provide hierarchy and subtle emphasis."
        >
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {colorTokens.map((token) => (
              <ColorSwatch key={token.name} token={token} />
            ))}
          </div>
        </Section>

        {/* Feedback */}
        <Section
          eyebrow="02 / Feedback"
          title="Feedback & Status"
          description="Semantic feedback colors are separated from the brand palette so components can communicate meaning consistently."
        >
          <div className="grid gap-5 md:grid-cols-2">
            {feedbackTokens.map((token) => (
              <FeedbackCard key={token.name} token={token} />
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section
          eyebrow="03 / Typography"
          title="Typography"
          description="Three font families are used according to hierarchy and content type."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
              <CardContent className="space-y-4 p-6">
                <p className="font-mono text-xs text-[var(--color-text-secondary)]">
                  --font-display
                </p>

                <h3 className="font-display text-3xl font-bold">
                  Space Grotesk
                </h3>

                <p className="font-display text-sm text-[var(--color-text-secondary)]">
                  Headings, display text, strong visual hierarchy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
              <CardContent className="space-y-4 p-6">
                <p className="font-mono text-xs text-[var(--color-text-secondary)]">
                  --font-body
                </p>

                <h3 className="font-body text-3xl font-semibold">
                  Inter
                </h3>

                <p className="font-body text-sm text-[var(--color-text-secondary)]">
                  Body copy, controls, forms and general UI.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[var(--color-border)] bg-[var(--color-surface)]">
              <CardContent className="space-y-4 p-6">
                <p className="font-mono text-xs text-[var(--color-text-secondary)]">
                  --font-mono
                </p>

                <h3 className="font-mono text-2xl font-medium">
                  IBM Plex Mono
                </h3>

                <p className="font-body text-sm text-[var(--color-text-secondary)]">
                  SKU, order IDs, coupon codes and technical metadata.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-5 border-[var(--color-border)] bg-[var(--color-surface)]">
            <CardContent className="space-y-5 p-6">
              <p className="font-mono text-xs text-[var(--color-text-secondary)]">
                Type Scale Preview
              </p>

              <h1 className="font-display text-5xl font-bold">
                Display Heading
              </h1>

              <h2 className="font-display text-3xl font-bold">
                Heading 2
              </h2>

              <h3 className="font-display text-xl font-semibold">
                Heading 3
              </h3>

              <p className="max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
                This is body text using Inter. It demonstrates the relationship
                between the primary and secondary text colors and the page
                background.
              </p>

              <p className="font-mono text-sm">
                SKU-48291 · ORDER-10294 · SAVE20
              </p>
            </CardContent>
          </Card>
        </Section>

        {/* UI */}
        <Section
          eyebrow="04 / Components"
          title="Component Playground"
          description="Test the tokens against real interface elements instead of looking at the colors in isolation."
        >
          <ComponentPlayground />
        </Section>

        {/* Alerts */}
        <Section
          eyebrow="05 / Alerts"
          title="Alerts"
          description="Status messages that make sense in a store context, using the feedback colors and their soft backgrounds."
        >
          <AlertsDemo />
        </Section>

        {/* Status */}
        <Section
          eyebrow="06 / Status"
          title="Status Badges"
          description="Stock and availability states mapped to the semantic feedback tokens."
        >
          <StatusBadgesDemo />
        </Section>

        {/* Commerce */}
        <Section
          eyebrow="07 / Commerce"
          title="Commerce Badges"
          description="Promotional badges with distinct visual hierarchy levels built entirely from the existing token set."
        >
          <CommerceBadgesDemo />
        </Section>

        <GroupHeading label="Commerce Patterns" />

        {/* Product Card */}
        <Section
          eyebrow="08 / Product Card"
          title="Product Card"
          description="A realistic product card with badge, rating, price hierarchy, stock status and actions, plus a skeleton loading state."
        >
          <ProductCardExample />
        </Section>

        {/* Gallery */}
        <Section
          eyebrow="09 / Gallery"
          title="Product Gallery"
          description="Main image with prev/next controls and selectable thumbnails using neutral token-based placeholders."
        >
          <GalleryDemo />
        </Section>

        {/* Rating */}
        <Section
          eyebrow="10 / Rating"
          title="Rating Scale"
          description="Full and partial stars with review counts, rendered with --color-warning for the active portion."
        >
          <RatingDemo />
        </Section>

        {/* Price */}
        <Section
          eyebrow="11 / Price"
          title="Price Display"
          description="Normal, discounted and range prices demonstrating intentional typographic hierarchy."
        >
          <PriceDemo />
        </Section>

        {/* Forms */}
        <Section
          eyebrow="12 / Forms"
          title="Form Controls"
          description="Every control a checkout or account form needs, built from the installed shadcn components."
        >
          <FormControlsDemo />
        </Section>

        {/* Input States */}
        <Section
          eyebrow="13 / Input States"
          title="Input States"
          description="The same input in each meaningful state: default, hover, focused, error, success and disabled."
        >
          <InputStatesDemo />
        </Section>

        {/* Cart Item */}
        <Section
          eyebrow="14 / Cart"
          title="Cart Item"
          description="A compact cart row with thumbnail, variant details, quantity stepper, item total and remove action."
        >
          <CartItemDemo />
        </Section>

        {/* Mini Cart */}
        <Section
          eyebrow="15 / Mini Cart"
          title="Mini Cart"
          description="An inline mini cart, the same summary inside a Sheet drawer, and an empty state."
        >
          <MiniCartDemo />
        </Section>

        {/* Coupon */}
        <Section
          eyebrow="16 / Coupon"
          title="Coupon"
          description="Coupon prompt with default, applied and invalid states wired to the feedback colors."
        >
          <CouponDemo />
        </Section>

        {/* Payments */}
        <Section
          eyebrow="17 / Payments"
          title="Payment Methods"
          description="Selectable payment surfaces with clear selected / unselected states and accessible radio semantics."
        >
          <PaymentsDemo />
        </Section>

        <GroupHeading label="Navigation" />

        {/* Pagination */}
        <Section
          eyebrow="18 / Pagination"
          title="Pagination"
          description="Page controls with a highlighted active page and a disabled previous control."
        >
          <PaginationDemo />
        </Section>

        {/* Breadcrumbs */}
        <Section
          eyebrow="19 / Breadcrumbs"
          title="Breadcrumbs"
          description="Semantic trails using --color-link for links, a muted separator and aria-current on the current page."
        >
          <BreadcrumbsDemo />
        </Section>

        {/* Tabs */}
        <Section
          eyebrow="20 / Tabs"
          title="Product Tabs"
          description="A product page pattern using the shadcn Tabs primitive for content switching."
        >
          <ProductTabsDemo />
        </Section>

        {/* Spacing */}
        <Section
          eyebrow="21 / Spacing"
          title="Spacing"
          description="A consistent 4px-based spacing scale keeps layout rhythm predictable."
        >
          <TokenTable tokens={spacingTokens} />
        </Section>

        {/* Radius */}
        <Section
          eyebrow="22 / Radius"
          title="Radius"
          description="Radius tokens control the softness of interactive and container surfaces."
        >
          <TokenTable tokens={radiusTokens} />
        </Section>

        {/* Shadows */}
        <Section
          eyebrow="23 / Shadows"
          title="Shadows"
          description="Subtle elevation is used to separate surfaces without making the interface visually heavy."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {shadowTokens.map((name) => (
              <div
                key={name}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
                style={{
                  boxShadow: `var(${name})`,
                }}
              >
                <p className="font-mono text-xs text-[var(--color-text-secondary)]">
                  {name}
                </p>

                <p className="mt-3 font-display font-semibold">
                  Elevation
                </p>

                <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                  {`var(${name})`}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Breakpoints */}
        <Section
          eyebrow="24 / Breakpoints"
          title="Breakpoints"
          description="Responsive thresholds used by the application layout."
        >
          <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            {breakpointTokens.map(([name, value]) => (
              <div
                key={name}
                className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4 last:border-b-0"
              >
                <code className="font-mono text-sm">{name}</code>

                <span className="rounded-full bg-[var(--color-surface-secondary)] px-3 py-1 font-mono text-xs text-[var(--color-text-secondary)]">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Z index */}
        <Section
          eyebrow="25 / Z-Index"
          title="Z-Index"
          description="A small layering scale prevents arbitrary z-index values from spreading across components."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {zIndexTokens.map(([name, value]) => (
              <Card
                key={name}
                className="border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                <CardContent className="space-y-2 p-5">
                  <code className="font-mono text-xs text-[var(--color-text-secondary)]">
                    {name}
                  </code>

                  <p className="font-display text-2xl font-bold">
                    {value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* Token summary */}
        <section className="rounded-2xl border border-[var(--color-supporting)] bg-[var(--color-accent)] p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-secondary)]">
                Token Architecture
              </p>

              <h2 className="font-display text-2xl font-bold text-[var(--color-primary)]">
                Primitive → Semantic → Components
              </h2>

              <p className="max-w-2xl text-sm leading-6 text-[var(--color-secondary)]">
                Components consume semantic tokens rather than hard-coded
                colors. This keeps the UI consistent and makes the future dark
                theme much easier to introduce.
              </p>
            </div>

            {/* border-[var(--color-supporting)] or border-(--color-supporting) */}
            <div className="rounded-xl border border-(--color-supporting) bg-[var(--color-surface)] p-5 font-mono text-xs leading-6 text-(--color-primary)">
              <div>--palette-jet-black</div>
              <div className="pl-4">↓</div>
              <div className="pl-4">--color-primary</div>
              <div className="pl-8">↓</div>
              <div className="pl-8">Button / Card / Nav</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}