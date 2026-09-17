import { Search } from "lucide-react";

export function CartSearchInput({ value, onChange }) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by customer, email, or cart ID"
        className="w-full rounded-lg border bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
