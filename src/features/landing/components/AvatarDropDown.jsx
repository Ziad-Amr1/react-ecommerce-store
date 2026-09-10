import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import UserAvatar from "./UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AvatarDropDown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent hover:bg-transparent cursor-pointer outline-none justify-end">
          <UserAvatar user={user} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Hi, {user.username}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>{t("navigation.profile")}</DropdownMenuItem>

        <DropdownMenuItem>{t("navigation.settings")}</DropdownMenuItem>

        <DropdownMenuItem>{t("navigation.orders")}</DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-[var(--color-error)] cursor-pointer"
          onClick={async () => {
            logout();

            setTimeout(() => {
              navigate("/login");
            }, 1000);
          }}
        >
          {t("navigation.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
