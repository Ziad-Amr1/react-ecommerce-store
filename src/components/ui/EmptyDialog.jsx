import { PackageOpen, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";

export default function EmptyDialog() {
  return (
    <Empty className="h-full bg-white select-none">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpen className="size-10" />
        </EmptyMedia>
        <h2 className="text-[var(--color-info)] font-extrabold font-[var(--font-display)] text-lg">
          Uhh! No featured products here
        </h2>
        <p className="text-[var(--color-text-secondary)] mt-3 mb-5 leading-6">
          Featured products will appear here once added.
        </p>
      </EmptyHeader>
      <EmptyContent>
        <Button className="cursor-pointer">
          <RefreshCcwIcon data-icon="inline-start" />
          Refresh
        </Button>
      </EmptyContent>
    </Empty>
  );
}
