import { useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Loader2,
  LogOut,
  Mail,
  Palette,
  Shield,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { getUserIdentity } from "@/features/auth/utils/userIdentity";
import { formatLocaleDate } from "@/utils/formatDate";
import { cn } from "@/lib/utils";

const COVER_PRESETS = {
  primary: "bg-gradient-to-r from-primary via-primary/80 to-accent",

  sunset: "bg-gradient-to-r from-amber-600 via-rose-600 to-purple-900",

  midnight: "bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950",

  warm: "bg-gradient-to-r from-amber-700 via-yellow-700 to-amber-950",
};

function getInitials(identity) {
  const initials = identity
    ?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return initials || "?";
}

export default function ProfileHeader({
  user,
  logout,
  onCustomize,
  coverPreset = "primary",
  coverImageUrl = "",
}) {
  const { t, i18n } = useTranslation();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const identity = getUserIdentity(user);
  const email = user?.email?.trim() || null;

  const memberSince = user?.createdAt
    ? formatLocaleDate(user.createdAt, i18n.language, {
        year: "numeric",
        month: "long",
      })
    : null;

  const coverClass = COVER_PRESETS[coverPreset] ?? COVER_PRESETS.primary;

  const handleSignOut = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
    } catch {
      toast.error(t("auth.errors.logoutFailed"));
      setIsLoggingOut(false);
    }
  };

  return (
    <Card className="py-0 overflow-hidden border-border/80 bg-card shadow-sm">
      {/* =========================================================
          COVER
      ========================================================= */}
      <div className="relative h-32 overflow-hidden sm:h-44">
        {/* Cover image or gradient */}
        {coverImageUrl ? (
          <img src={coverImageUrl} alt="" className="size-full object-cover" />
        ) : (
          <div
            className={cn("size-full transition-all duration-500", coverClass)}
            aria-hidden="true"
          />
        )}

        {/* Decorative overlay */}
        <div
          className="
            pointer-events-none
            absolute inset-0
            bg-gradient-to-b
            from-black/10
            via-transparent
            to-black/20
          "
          aria-hidden="true"
        />

        {/* Decorative circle - end */}
        <div
          className="
            pointer-events-none
            absolute -end-16 -top-20
            size-56 rounded-full
            bg-background/10
            blur-3xl
          "
          aria-hidden="true"
        />

        {/* Decorative circle - start */}
        <div
          className="
            pointer-events-none
            absolute -start-20 -bottom-28
            size-64 rounded-full
            bg-background/10
            blur-3xl
          "
          aria-hidden="true"
        />

        {/* Customize button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCustomize}
          className="
            absolute end-3 top-3
            gap-1.5 rounded-xl
            border border-border
            bg-background text-foreground
            text-xs font-semibold
            shadow-sm
            transition-colors
            hover:bg-accent hover:text-accent-foreground
            sm:end-5 sm:top-5
          "
        >
          <Palette className="size-3.5" aria-hidden="true" />

          <span className="hidden sm:inline">
            {t("profile.header.customize")}
          </span>

          <span className="sm:hidden">
            {t("profile.header.customizeShort")}
          </span>
        </Button>
      </div>

      {/* =========================================================
          PROFILE CONTENT
      ========================================================= */}
      <div className="relative px-4 pt-6 pb-5 sm:px-6 sm:pt-6 sm:pb-6">
        <div
          className="
            flex flex-col gap-4
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          {/* =====================================================
              AVATAR + IDENTITY
          ===================================================== */}
          <div
            className="
              -mt-12
              flex min-w-0
              flex-col items-center
              sm:-mt-14
              sm:flex-row
              sm:items-end
              sm:gap-4
            "
          >
            {/* Avatar */}
            <Avatar
              className="
                size-24 shrink-0
                border-4 border-card
                bg-primary
                text-2xl
                shadow-lg
                ring-1 ring-border/50
                sm:size-28
                sm:text-3xl
              "
            >
              <AvatarImage
                src={user?.avatar}
                alt={identity || t("profile.title")}
              />

              <AvatarFallback
                className="
                  bg-primary
                  font-display
                  font-bold
                  text-primary-foreground
                "
              >
                {getInitials(identity)}
              </AvatarFallback>
            </Avatar>

            {/* Identity information */}
            <div
              className="
                mt-3
                min-w-0
                text-center
                sm:mb-1
                sm:mt-0
                sm:text-start
              "
            >
              {/* Name + badges */}
              <div
                className="
                  flex flex-wrap
                  items-center
                  justify-center
                  gap-2
                  sm:justify-start
                "
              >
                <h2
                  className="
                    max-w-full
                    truncate
                    font-display
                    text-xl
                    font-bold
                    tracking-tight
                    text-foreground
                    sm:text-2xl
                  "
                >
                  {identity ?? "—"}
                </h2>

                {/* Role */}
                {user?.role && (
                  <Badge
                    variant="secondary"
                    className="
                      shrink-0
                      gap-1
                      border-0
                      bg-primary/10
                      text-primary
                    "
                  >
                    <Shield className="size-3" aria-hidden="true" />

                    <span className="capitalize">{user.role}</span>
                  </Badge>
                )}

                {/* Verified */}
                {user?.isVerified && (
                  <Badge variant="secondary" className="shrink-0 gap-1">
                    <BadgeCheck className="size-3.5" aria-hidden="true" />

                    {t("profile.header.verified")}
                  </Badge>
                )}
              </div>

              {/* Email */}
              {email && (
                <p
                  className="
                    mt-1
                    flex min-w-0
                    items-center
                    justify-center
                    gap-1.5
                    text-xs
                    text-muted-foreground
                    sm:justify-start
                    sm:text-sm
                  "
                >
                  <Mail
                    className="size-3.5 shrink-0 sm:size-4"
                    aria-hidden="true"
                  />

                  <span className="max-w-full truncate">{email}</span>
                </p>
              )}

              {/* Member since */}
              {memberSince && (
                <p
                  className="
                    mt-1
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    text-xs
                    text-muted-foreground
                    sm:justify-start
                  "
                >
                  <CalendarDays
                    className="size-3.5 shrink-0"
                    aria-hidden="true"
                  />

                  <span className="truncate">
                    {t("profile.header.memberSince", {
                      date: memberSince,
                    })}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* =====================================================
              ACTIONS
          ===================================================== */}
          <div
            className="
              flex w-full
              flex-wrap
              justify-center
              gap-2
              sm:w-auto
              sm:justify-end
              sm:pb-1
            "
          >
            {/* Sign out */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="gap-1.5 rounded-xl"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />

                  <span>{t("profile.header.signingOut")}</span>
                </>
              ) : (
                <>
                  <LogOut className="size-4" aria-hidden="true" />

                  <span>{t("profile.header.signOut")}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
