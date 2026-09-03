"use client";

import { CreditCardIcon, SettingsIcon, UserIcon, UserStar } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DropdownMenuIcons() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* <Button
          variant="ghost"
          className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none data-[state=open]:ring-0 hover:border-transparent hover:ring-0 hover:bg-transparent"
        >
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--color-link)] text-white text-sm select-none">
            <span className="size-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              A
            </span>
            Admin
          </div>
        </Button> */}

        <Button
          variant="ghost"
          className="bg-[var(--color-error)] text-white px-4 py-2 rounded-md px-4 py-2  text-sm flex items-center gap-2 cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none hover:border-transparent hover:ring-0 hover:bg-[var(--color-focus-ring)] hidden md:flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--color-link)] text-sm select-none"
        >
          <UserStar className="text-white" size={20} aria-label="Logout" />
          <span className="hidden md:inline-flex text-white">Admin</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem>
          <UserIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCardIcon />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon />
          Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
