import { cn } from "@/lib/utils"

// Row height per density, applied to both instances of the same attribute for
// header and body rows. Keep these strings fully static so Tailwind can see them.
const DENSITY = {
  compact: "[&_[data-slot=table-head]]:h-10 [&_[data-slot=table-row]]:h-10",
  default: "[&_[data-slot=table-head]]:h-12 [&_[data-slot=table-row]]:h-12",
  comfortable:
    "[&_[data-slot=table-head]]:h-14 [&_[data-slot=table-row]]:h-14",
};

// Opt-in roomier edge spacing: extra inline-start padding on the first column
// and inline-end padding on the last column (2rem / ps-8 / pe-8), applied to BOTH the header and
// every body cell so header and rows stay aligned. Intermediate columns keep
// the default padding. Uses logical (ps/pe) utilities for RTL safety.
const EDGE_PADDING =
  "[&_tr>:first-child]:ps-8 [&_tr>:last-child]:pe-8";

function Table({
  className,
  density = "default",
  edgePadding = false,
  ...props
}) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom text-sm",
          DENSITY[density] ?? DENSITY.default,
          edgePadding && EDGE_PADDING,
          className
        )}
        {...props} />
    </div>
  );
}

function TableHeader({
  className,
  ...props
}) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props} />
  );
}

function TableBody({
  className,
  ...props
}) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props} />
  );
}

function TableFooter({
  className,
  ...props
}) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
      {...props} />
  );
}

function TableRow({
  className,
  ...props
}) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-(--color-border) transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props} />
  );
}

function TableHead({
  className,
  ...props
}) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-start align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props} />
  );
}

function TableCell({
  className,
  ...props
}) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-2 py-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props} />
  );
}

function TableCaption({
  className,
  ...props
}) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props} />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
