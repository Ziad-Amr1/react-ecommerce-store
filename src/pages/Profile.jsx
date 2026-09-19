import { useTranslation } from "react-i18next";
import useAuth from "@/hooks/useAuth";
import useProfile from "@/features/profile/hooks/useProfile";
import ProfileHeader from "@/features/profile/ProfileHeader";
import PersonalInformation from "@/features/profile/PersonalInformation";
import AccountActivity from "@/features/profile/AccountActivity";
import AnonymousPrompt from "@/features/profile/AnonymousPrompt";
import ProfileSkeleton from "@/features/profile/ProfileSkeleton";
import ErrorState from "@/features/profile/ErrorState";

export default function Profile() {
  const { t } = useTranslation();

  const {
    user,
    isLoading,
    restoreError,
    logout,
    refresh,
  } = useAuth();

  const { updateUser } = useProfile();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-4 sm:mb-6">
        <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">
          {t("profile.title")}
        </h1>

        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          {t("profile.description")}
        </p>
      </div>

      {isLoading ? (
        <ProfileSkeleton />
      ) : user ? (
        <div className="space-y-4 sm:space-y-6">
          <ProfileHeader user={user} logout={logout} />

          <PersonalInformation
            user={user}
            updateUser={updateUser}
          />

          <AccountActivity />
        </div>
      ) : restoreError ? (
        <ErrorState onRetry={refresh} />
      ) : (
        <AnonymousPrompt />
      )}
    </main>
  );
}