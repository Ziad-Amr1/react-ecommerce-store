import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import HeaderActionButtons from "@/components/ui/HeaderActionButtons";

export default function AdminHeader({ onMenuClick }) {
  return (
    <header className="flex items-center justify-between border-b bg-[var(--color-surface)] px-4 py-4 lg:px-6 sticky top-0 z-[var(--z-nav)]">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full cursor-pointer"
          onClick={onMenuClick}
        >
          <Menu size={20} aria-label="Open navigation menu" />
        </Button>

        <div className="hidden sm:block">
          <h2 className="text-lg font-bold font-[var(--font-display)] text-[var(--color-text-primary)]">
            Oversea Dashboard
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)]">
            E-Commerce Admin Panel
          </p>
        </div>
      </div>

      <HeaderActionButtons />
    </header>
  );
}
