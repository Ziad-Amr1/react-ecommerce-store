import { useMemo, useState } from "react";
import {
  Camera,
  Check,
  Image as ImageIcon,
  Palette,
  RotateCcw,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

const AVATAR_PRESETS = [
  {
    id: "default",
    label: "Default",
    url: "",
  },
  {
    id: "chef",
    label: "Chef",
    url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "gourmet",
    label: "Gourmet",
    url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "barista",
    label: "Barista",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "foodie",
    label: "Foodie",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
];

const COVER_PRESETS = [
  {
    id: "primary",
    label: "Primary",
    className: "bg-gradient-to-r from-primary via-primary/80 to-accent",
  },
  {
    id: "sunset",
    label: "Sunset",
    className: "bg-gradient-to-r from-amber-600 via-rose-600 to-purple-900",
  },
  {
    id: "midnight",
    label: "Midnight",
    className: "bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950",
  },
  {
    id: "warm",
    label: "Warm",
    className: "bg-gradient-to-r from-amber-700 via-yellow-700 to-amber-950",
  },
];

function getInitials(name) {
  const initials = name
    ?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return initials || "?";
}

export default function ProfileAppearanceDialog({
  open,
  onOpenChange,
  user,
  avatarUrl = "",
  coverPreset = "primary",
  coverImageUrl = "",
  onSave,
}) {
  const { t } = useTranslation();

  const initialAvatar = avatarUrl || user?.avatar || "";
  const [draftAvatarUrl, setDraftAvatarUrl] = useState(initialAvatar);

  const [draftCoverPreset, setDraftCoverPreset] = useState(coverPreset);

  const [draftCoverImageUrl, setDraftCoverImageUrl] = useState(coverImageUrl);

  /*
   * Reset the draft values whenever the dialog opens.
   */
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setDraftAvatarUrl(avatarUrl || user?.avatar || "");
      setDraftCoverPreset(coverPreset);
      setDraftCoverImageUrl(coverImageUrl);
    }
  }

  const selectedCover = useMemo(() => {
    return (
      COVER_PRESETS.find((preset) => preset.id === draftCoverPreset) ??
      COVER_PRESETS[0]
    );
  }, [draftCoverPreset]);

  const handleCoverPresetChange = (presetId) => {
    setDraftCoverPreset(presetId);

    /*
     * Selecting a gradient removes the custom cover image.
     */
    setDraftCoverImageUrl("");
  };

  const handleReset = () => {
    setDraftAvatarUrl("");
    setDraftCoverPreset("primary");
    setDraftCoverImageUrl("");
  };

  const handleSave = () => {
    onSave?.({
      avatarUrl: draftAvatarUrl.trim(),
      coverPreset: draftCoverPreset,
      coverImageUrl: draftCoverImageUrl.trim(),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          flex
          max-h-[90vh]
          flex-col
          overflow-hidden
          rounded-2xl
          p-0
          sm:max-w-lg
        "
      >
        {/* =====================================================
            HEADER
        ===================================================== */}
        <DialogHeader
          className="
            shrink-0
            border-b
            border-border
            px-5
            py-4
            sm:px-6
          "
        >
          <DialogTitle className="flex items-center gap-2">
            <Palette className="size-5 text-primary" aria-hidden="true" />

            {t("profile.appearance.title")}
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm">
            {t("profile.appearance.description")}
          </DialogDescription>
        </DialogHeader>

        {/* =====================================================
            SCROLLABLE CONTENT
        ===================================================== */}
        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-5
            py-5
            sm:px-6
          "
        >
          <div className="space-y-6">
            {/* =================================================
                LIVE PREVIEW
            ================================================= */}
            <section className="space-y-2">
              <Label
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-muted-foreground
                "
              >
                {t("profile.appearance.preview")}
              </Label>

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  shadow-sm
                "
              >
                {/* Cover */}
                <div className="relative h-28 overflow-hidden sm:h-32">
                  {draftCoverImageUrl ? (
                    <img
                      src={draftCoverImageUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className={cn("size-full", selectedCover.className)} />
                  )}
                </div>

                {/* Identity */}
                <div
                  className="
                    relative
                    flex
                    items-end
                    gap-3
                    px-4
                    pb-4
                  "
                >
                  <Avatar
                    className="
                      -mt-9
                      size-16
                      shrink-0
                      border-4
                      border-card
                      shadow-md
                    "
                  >
                    <AvatarImage
                      src={draftAvatarUrl}
                      alt={user?.name || t("profile.title")}
                    />

                    <AvatarFallback
                      className="
                        bg-primary
                        font-bold
                        text-primary-foreground
                      "
                    >
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 pb-1">
                    <p className="truncate text-sm font-bold text-foreground">
                      {user?.name || "—"}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                AVATAR PRESETS
            ================================================= */}
            <section className="space-y-3">
              <Label
                className="
                  flex
                  items-center
                  gap-1.5
                  text-sm
                  font-semibold
                "
              >
                <Camera className="size-4 text-primary" aria-hidden="true" />

                {t("profile.appearance.avatar")}
              </Label>

              <div
                className="
                  flex
                  gap-2.5
                  overflow-x-auto
                  pb-1
                "
              >
                {AVATAR_PRESETS.map((preset) => {
                  const isSelected = draftAvatarUrl === preset.url;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setDraftAvatarUrl(preset.url)}
                      className={cn(
                        `
                          relative
                          size-14
                          shrink-0
                          overflow-hidden
                          rounded-xl
                          border-2
                          transition-all
                          hover:scale-105
                        `,
                        isSelected
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-muted-foreground",
                      )}
                      aria-label={preset.label}
                      aria-pressed={isSelected}
                    >
                      {preset.url ? (
                        <img
                          src={preset.url}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <span
                          className="
                            flex
                            size-full
                            items-center
                            justify-center
                            bg-primary
                            text-sm
                            font-bold
                            text-primary-foreground
                          "
                        >
                          {getInitials(user?.name)}
                        </span>
                      )}

                      {isSelected && (
                        <span
                          className="
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                            bg-primary/30
                          "
                        >
                          <span
                            className="
                              flex
                              size-5
                              items-center
                              justify-center
                              rounded-full
                              bg-primary
                              text-primary-foreground
                            "
                          >
                            <Check className="size-3" aria-hidden="true" />
                          </span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* =================================================
                CUSTOM AVATAR
            ================================================= */}
            <section className="space-y-2">
              <Label
                htmlFor="profile-avatar-url"
                className="
                  flex
                  items-center
                  gap-1.5
                  text-sm
                  font-semibold
                "
              >
                <Camera
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />

                {t("profile.appearance.customAvatar")}
              </Label>

              <Input
                id="profile-avatar-url"
                type="url"
                value={draftAvatarUrl}
                onChange={(event) => setDraftAvatarUrl(event.target.value)}
                placeholder="https://..."
              />
            </section>

            {/* =================================================
                COVER PRESETS
            ================================================= */}
            <section className="space-y-3">
              <Label
                className="
                  flex
                  items-center
                  gap-1.5
                  text-sm
                  font-semibold
                "
              >
                <Palette className="size-4 text-primary" aria-hidden="true" />

                {t("profile.appearance.cover")}
              </Label>

              <div className="grid grid-cols-2 gap-2">
                {COVER_PRESETS.map((preset) => {
                  const isSelected =
                    draftCoverPreset === preset.id && !draftCoverImageUrl;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleCoverPresetChange(preset.id)}
                      className={cn(
                        `
                          relative
                          h-14
                          overflow-hidden
                          rounded-xl
                          p-3
                          text-start
                          text-xs
                          font-bold
                          text-white
                          transition-all
                          hover:opacity-90
                        `,
                        preset.className,
                        isSelected &&
                          "ring-2 ring-primary ring-offset-2 ring-offset-card",
                      )}
                      aria-label={preset.label}
                      aria-pressed={isSelected}
                    >
                      <span>{preset.label}</span>

                      {isSelected && (
                        <Check
                          className="
                            absolute
                            end-2
                            top-2
                            size-4
                          "
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* =================================================
                CUSTOM COVER
            ================================================= */}
            <section className="space-y-2">
              <Label
                htmlFor="profile-cover-url"
                className="
                  flex
                  items-center
                  gap-1.5
                  text-sm
                  font-semibold
                "
              >
                <ImageIcon
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />

                {t("profile.appearance.customCover")}
              </Label>

              <Input
                id="profile-cover-url"
                type="url"
                value={draftCoverImageUrl}
                onChange={(event) => setDraftCoverImageUrl(event.target.value)}
                placeholder="https://..."
              />
            </section>
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}
        <DialogFooter
          className="
            shrink-0
            border-t
            border-border
            px-5
            py-3
            sm:px-6
          "
        >
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            className="me-auto gap-1.5"
          >
            <RotateCcw className="size-4" aria-hidden="true" />

            {t("profile.appearance.reset")}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("profile.edit.cancel")}
          </Button>

          <Button type="button" onClick={handleSave}>
            {t("profile.appearance.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
