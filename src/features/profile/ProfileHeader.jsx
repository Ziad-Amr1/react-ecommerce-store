import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { BadgeCheck, CalendarDays, Loader2, LogOut, Mail } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUserIdentity } from "@/features/auth/utils/userIdentity";
import { formatLocaleDate } from "@/utils/formatDate";

function getInitials(identity) {
  const words = identity
    ?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return words || "?";
}

export default function ProfileHeader({ user, logout }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const identity = getUserIdentity(user);
  const email = user?.email?.trim() || null;

  const memberSince = user?.createdAt
    ? formatLocaleDate(user.createdAt, i18n.language, {
        year: "numeric",
        month: "long",
      })
    : null;

  const handleSignOut = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
      navigate("/");
    } catch {
      toast.error(t("auth.errors.logoutFailed"));
      setIsLoggingOut(false);
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-5 p-4 sm:p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-start min-w-0 max-w-full">
          <Avatar className="size-16 sm:size-20 border-2 border-border text-xl sm:text-2xl shrink-0">
            <AvatarImage
              src={user?.avatar}
              alt={identity ?? t("profile.title")}
            />

            <AvatarFallback className="bg-accent font-display font-semibold text-primary">
              {getInitials(identity)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 max-w-full flex-1">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="truncate max-w-full font-display text-xl sm:text-2xl font-bold text-foreground">
                {identity ?? "—"}
              </h2>

              {identity && (
                <Badge className="border-transparent bg-(--color-success-bg) text-(--color-success) shrink-0">
                  {t("profile.header.signedIn")}
                </Badge>
              )}

              {user?.role && (
                <Badge variant="outline" className="shrink-0">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              )}

              {user?.isVerified && (
                <Badge variant="secondary" className="gap-1 shrink-0">
                  <BadgeCheck className="size-3.5" aria-hidden="true" />
                  {t("profile.header.verified")}
                </Badge>
              )}
            </div>

            {email && (
              <p className="mt-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm text-muted-foreground sm:justify-start min-w-0 max-w-full">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate max-w-full">{email}</span>
              </p>
            )}

            {memberSince && (
              <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground sm:justify-start min-w-0 max-w-full">
                <CalendarDays
                  className="size-3.5 shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate max-w-full">
                  {t("profile.header.memberSince", {
                    date: memberSince,
                  })}
                </span>
              </p>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="w-full sm:w-auto shrink-0 justify-center mt-2 sm:mt-0"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {t("profile.header.signingOut")}
            </>
          ) : (
            <>
              <LogOut className="size-4" aria-hidden="true" />
              {t("profile.header.signOut")}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
