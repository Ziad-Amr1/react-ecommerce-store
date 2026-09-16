export const AVATAR_COLORS = [
  "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
];

export const avatarColor = (name) => {
  const idx = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
};

export const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const formatCurrency = (value) =>
  value.toLocaleString("en-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const cartTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const cartItemCount = (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0);

// Central place to describe each order status: label + badge styling.
// Adding a new status only means adding one entry here.
export const CART_STATUSES = {
  active: { label: "Active", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  payment_pending: {
    label: "Payment Pending",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  abandoned: {
    label: "Abandoned",
    className: "bg-muted text-muted-foreground",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
};
