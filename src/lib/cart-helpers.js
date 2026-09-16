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

// Used to populate the "Filter by status" dropdown.
export const CART_STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  ...Object.entries(CART_STATUSES).map(([value, { label }]) => ({ value, label })),
];

// Used to populate the "Sort by" dropdown. `compare` is a standard
// Array.prototype.sort comparator.
export const CART_SORT_OPTIONS = [
  {
    value: "updated_desc",
    label: "Last updated (newest)",
    compare: (a, b) => b.updatedAtTimestamp - a.updatedAtTimestamp,
  },
  {
    value: "updated_asc",
    label: "Last updated (oldest)",
    compare: (a, b) => a.updatedAtTimestamp - b.updatedAtTimestamp,
  },
  {
    value: "total_desc",
    label: "Total (high to low)",
    compare: (a, b) => cartTotal(b.items) - cartTotal(a.items),
  },
  {
    value: "total_asc",
    label: "Total (low to high)",
    compare: (a, b) => cartTotal(a.items) - cartTotal(b.items),
  },
  {
    value: "customer_asc",
    label: "Customer (A–Z)",
    compare: (a, b) => a.customer.localeCompare(b.customer),
  },
];

export const sortCarts = (carts, sortValue) => {
  const option = CART_SORT_OPTIONS.find((opt) => opt.value === sortValue);
  if (!option) return carts;
  return [...carts].sort(option.compare);
};

export const filterCartsByStatus = (carts, status) => {
  if (!status || status === "all") return carts;
  return carts.filter((cart) => cart.status === status);
};

// --- Pagination -----------------------------------------------------------

export const DOTS = "...";

const range = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

/**
 * Returns a compact list of page numbers to render, e.g. [1, '...', 4, 5, 6, '...', 42]
 * instead of 1..1000 buttons. Scales fine whether there are 3 pages or 1000.
 */
export function getPaginationRange(currentPage, totalPages, siblingCount = 1) {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPageNumbers >= totalPages) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    return [...range(1, leftItemCount), DOTS, totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    return [1, DOTS, ...range(totalPages - rightItemCount + 1, totalPages)];
  }

  return [1, DOTS, ...range(leftSiblingIndex, rightSiblingIndex), DOTS, totalPages];
}

export const filterCartsByQuery = (carts, query) => {
  const q = query.trim().toLowerCase();
  if (!q) return carts;
  return carts.filter(
    (cart) =>
      cart.customer.toLowerCase().includes(q) ||
      cart.email.toLowerCase().includes(q) ||
      cart.id.toLowerCase().includes(q)
  );
};
