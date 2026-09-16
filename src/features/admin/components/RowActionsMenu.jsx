import { Fragment } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RowActionsMenu({
  disabled,
  ariaLabel,
  items,
  onTriggerClick,
  onCloseAutoFocus,
}) {
  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100 [@media(pointer:coarse)]:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              disabled={disabled}
              aria-label={ariaLabel}
              onClick={onTriggerClick}
            >
              <MoreHorizontal className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onCloseAutoFocus={onCloseAutoFocus}>
            {items.map((item) => (
              <Fragment key={item.label}>
                {item.separator && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  variant={item.variant}
                  onClick={(event) => {
                    event.stopPropagation();
                    item.onClick();
                  }}
                >
                  {item.icon}
                  {item.label}
                </DropdownMenuItem>
              </Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}