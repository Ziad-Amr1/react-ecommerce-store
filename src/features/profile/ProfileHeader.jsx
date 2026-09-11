import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Loader2, LogOut, Mail } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { getUserIdentity } from "@/features/auth/utils/userIdentity";

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

export default function ProfileHeader() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const identity = getUserIdentity(user);
  const email = user?.email?.trim() || null;

  const handleSignOut = async () => {
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
      <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:text-start text-center">
          <Avatar className="size-20 border-2 border-border text-2xl">
            <AvatarImage src={user?.avatar} alt={identity ?? t("profile.title")} />
            <AvatarFallback className="bg-accent font-display font-semibold text-primary">
              {getInitials(identity)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="truncate font-display text-2xl font-bold text-foreground">
                {identity ?? "—"}
              </h2>
              {identity && <Badge variant="secondary">{t("profile.header.signedIn")}</Badge>}
              {user?.role && (
                <Badge variant="outline">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              )}
            </div>

            {email && (
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{email}</span>
              </p>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="shrink-0"
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