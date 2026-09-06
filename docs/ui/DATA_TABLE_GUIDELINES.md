# Data Table Guidelines

Source of truth for all data tables in this project. Future table work must follow these rules.
Use the existing shadcn/Radix `Table` primitive (`src/components/ui/table.jsx`) and existing semantic
tokens. Do not introduce a table framework or build a generic table abstraction.

`src/pages/DesignSystem.jsx` is out of scope for these guidelines.

## 1. Alignment

- Text values -> `text-start`.
- Currency, prices, counts, quantities, percentages -> `text-end`.
- Headers align with their cells (a numeric column's header uses `text-end` too).
- Use logical utilities only (`text-start` / `text-end`), never `text-left` / `text-right`.
- The primitive defaults cells/heads to `text-start`; add `text-end` only where numeric.

## 2. Density

Row height is intentional, set once per table via the `density` prop on `Table`:

- `compact` = 40px
- `default` = 48px
- `comfortable` = 56px

Choose by table purpose:

- Ops -> `compact`
- Everyday -> `default`
- Review -> `comfortable`

Do not change row height per-cell or arbitrarily. Document the chosen density for each table.

## 3. Sticky

- The table container is `overflow-x-auto`. Do not make every table sticky.
- Add sticky behavior only when a table is wide enough to scroll horizontally or tall enough to
  scroll vertically: keep the header sticky on vertical scroll and identity columns visible on
  horizontal scroll.
- Use `position: sticky` with logical positioning where possible; avoid hardcoding physical
  direction (e.g. prefer a logical approach over a literal `left: 0` when practical).

## 4. Cells

- Missing data renders `—` (em dash). Never leave an unexplained blank.
- Preserve the distinction between missing (`—`), zero (renders the actual `0` value), and
  loading (skeleton / explicit loading state). Do not collapse these into one value.
- Long **text** truncates instead of expanding the table width.
- Truncated text exposes the full value through an accessible Radix `Tooltip` on hover **and**
  focus (focusable trigger).
- Numeric values never truncate: use `whitespace-nowrap tabular-nums`.

## 5. Borders, hover, striping

- Single subtle hairline row separator (`border-b` tinted with the `--color-border` token).
- Row hover is the primary interaction feedback (`hover:bg-muted/50`), subtle in light and dark.
- No zebra striping by default. Only add stripes when rows are exceptionally wide and scanning
  clearly benefits from them.

## 6. Actions

- Do not show an always-visible action icon per row.
- Desktop: reveal row actions on hover/focus. Touch/mobile: provide a kebab/menu affordance.
- Sorting indicator appears only on the currently sorted column.
- Add sorting only when the data source actually supports it. No fake/synthetic sorting.
- Keep action columns visually quiet.

## Current table audit

| Table | Density | Sticky | Zebra | Actions | Sorting |
| --- | --- | --- | --- | --- | --- |
| Dashboard `RecentOrders` | `default` (48px) | no (not warranted) | no | none | none |

`RecentOrders` columns: Order ID (text, start), Customer (text, start, truncates with tooltip),
Total (currency, end), Status (text, start), Date (text, start).