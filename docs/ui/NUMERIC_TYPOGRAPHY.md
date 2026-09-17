# Numeric Typography Convention

Single project-wide convention for displaying numbers. No new fonts, no new utilities — use the documented class combos below (all Tailwind utilities already available).

## Rules

| Content | Classes | Notes |
| --- | --- | --- |
| Currency amounts, counts, quantities, percentages | `tabular-nums` | Numbers align in columns and never shift width while updating. |
| Large emphasis numbers (stat-card values, page-level prices) | `font-display tabular-nums` | Only for genuinely large emphasis values (roughly `text-2xl`+). If unsure, use `tabular-nums` alone. |
| Identifier/code strings (order IDs, SKUs, product codes) | `font-mono` | Reserved for codes treated as codes, never for currency/counts/percentages. |
| Everything else numeric | `tabular-nums` | Plain default sans, no font switch. |

## Anti-patterns

- Never `font-mono` a price, count, or percentage.
- Never `font-display` on a small data-table cell (e.g. per-row totals); reserve it for headings and large emphasis values.
- Don't sprinkle `font-display` on dates or other non-numeric metadata.

## Examples (applied as of P3)

- `StatCard` value → `font-display wrap-break-word text-2xl font-bold tabular-nums` (large emphasis + currency/count).
- `RecentOrders` order id (`#abcd12`) → `font-mono`; per-row total → `tabular-nums`; date → default sans.
- `ProductsTable` price cell → `tabular-nums` (text-end); stock cell → `tabular-nums` (text-end).
- `ProductPagination` page indicator (`1 / 5`) → `tabular-nums`.
- `ProductDetailsInfo` page-level price → `font-display ... tabular-nums`; strikethrough price and discount percent badge → `tabular-nums`; SKU → `font-mono`.
- `FeaturedProductCard` price → `font-display ... tabular-nums`; original price and discount badge → `tabular-nums`.

Known remaining touches (pending user WIP, not applied in P3): `OrderStatus.jsx` / `TopProducts.jsx` still use `font-display` on small numeric legend/revenue cells.