"use client";

import { Button } from "@/components/ui/button";
import { BellDot, Ghost } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NotificationsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <BellDot size={20} aria-label="Notifications" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-fit px-4">
        <DropdownMenuGroup>
          <DropdownMenuLabel className=" flex gap-2 text-[var(--color-info)] select-none">
            <Ghost size={20} />
            <span> No recent notifications</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
