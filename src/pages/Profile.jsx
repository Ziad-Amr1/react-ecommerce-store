import { useState } from "react";
import { useTranslation } from "react-i18next";

import useAuth from "@/hooks/useAuth";

import ProfileHeader from "@/features/profile/ProfileHeader";
import ProfileAppearanceDialog from "@/features/profile/ProfileAppearanceDialog";
import PersonalInformation from "@/features/profile/PersonalInformation";
import AccountActivity from "@/features/profile/AccountActivity";
import AnonymousPrompt from "@/features/profile/AnonymousPrompt";
import ProfileSkeleton from "@/features/profile/ProfileSkeleton";
import DeleteAccountDialog from "@/features/profile/DeleteAccountDialog";
import SEO from "@/components/SEO/SEO";

const APPEARANCE_STORAGE_KEY = "profileAppearanceCover";

function readStoredCover() {
  try {
    const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        coverPreset:
          typeof parsed.coverPreset === "string"
            ? parsed.coverPreset
            : "primary",
        coverImageUrl:
          typeof parsed.coverImageUrl === "string"
            ? parsed.coverImageUrl
            : "",
      };
    }
  } catch {
    // ignore storage errors and fall back to defaults
  }

  return null;
}

export default function Profile() {
  const { t } = useTranslation();

  const { user, isLoading, logout, updateUser, deleteAccount } = useAuth();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);

  const storedCover = readStoredCover();

  const [appearance, setAppearance] = useState({
    avatarUrl: user?.avatar ?? "",
    coverPreset: storedCover?.coverPreset ?? "primary",
    coverImageUrl: storedCover?.coverImageUrl ?? "",
  });

  /*
   * Sync the avatar from the authenticated user.
   *
   * This is important because the user may not exist during
   * the first render while authentication is loading.
   */
  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    if (user) {
      setAppearance((current) => ({
        ...current,
        avatarUrl: user.avatar ?? current.avatarUrl ?? "",
      }));
    }
  }

  /*
   * Save profile appearance.
   *
   * Avatar is already part of the current user model, so we
   * persist that through updateUser().
   *
   * Cover settings are stored per device in localStorage so the
   * profile background survives page reloads.
   */
  const handleAppearanceSave = async ({
    avatarUrl,
    coverPreset,
    coverImageUrl,
  }) => {
    const previousAvatar = user?.avatar ?? "";

    setAppearance({
      avatarUrl,
      coverPreset,
      coverImageUrl,
    });

    try {
      window.localStorage.setItem(
        APPEARANCE_STORAGE_KEY,
        JSON.stringify({ coverPreset, coverImageUrl }),
      );
    } catch {
      // ignore storage errors
    }

    if (updateUser && avatarUrl !== previousAvatar) {
      try {
        await updateUser({
          avatar: avatarUrl,
        });
      } catch {
        /*
         * If updating the avatar fails, restore the previous
         * avatar in the local UI.
         */
        setAppearance((current) => ({
          ...current,
          avatarUrl: previousAvatar,
        }));
      }
    }
  };

  return (
    <div className="pt-2 pb-6 sm:pb-10">
      <SEO
        title={t("profile.title")}
        description={t("profile.description")}
        url="/profile"
        noindex
      />
      {/* =======================================================
          PAGE INTRO
      ======================================================= */}
      <div className="mb-4 sm:mb-6">
        <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">
          {t("profile.title")}
        </h1>

        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          {t("profile.description")}
        </p>
      </div>

      {/* =======================================================
          LOADING
      ======================================================= */}
      {isLoading ? (
        <ProfileSkeleton />
      ) : user ? (
        <div className="space-y-4 sm:space-y-6">
          {/* =====================================================
              PROFILE HEADER
          ===================================================== */}
          <ProfileHeader
            user={{
              ...user,
              avatar: appearance.avatarUrl || user?.avatar,
            }}
            logout={logout}
            onCustomize={() => setIsAppearanceOpen(true)}
            coverPreset={appearance.coverPreset}
            coverImageUrl={appearance.coverImageUrl}
          />

          {/* =====================================================
              PERSONAL INFORMATION
          ===================================================== */}
          <PersonalInformation
            user={user}
            updateUser={updateUser}
            isEditing={isEditingProfile}
            onEditingChange={setIsEditingProfile}
          />

          {/* =====================================================
              ACCOUNT ACTIVITY
          ===================================================== */}
          <AccountActivity />

          {/* =====================================================
              DELETE ACCOUNT
          ===================================================== */}
          <div className="flex justify-end border-t border-border pt-4">
            <DeleteAccountDialog deleteAccount={deleteAccount} />
          </div>

          {/* =====================================================
              APPEARANCE DIALOG
          ===================================================== */}
          <ProfileAppearanceDialog
            open={isAppearanceOpen}
            onOpenChange={setIsAppearanceOpen}
            user={user}
            avatarUrl={appearance.avatarUrl}
            coverPreset={appearance.coverPreset}
            coverImageUrl={appearance.coverImageUrl}
            onSave={handleAppearanceSave}
          />
        </div>
      ) : (
        <AnonymousPrompt />
      )}
    </div>
  );
}
