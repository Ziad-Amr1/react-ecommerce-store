import { useTranslation } from "react-i18next";
import useAuth from "@/hooks/useAuth";
import ProfileHeader from "@/features/profile/ProfileHeader";
import PersonalInformation from "@/features/profile/PersonalInformation";
import AccountActivity from "@/features/profile/AccountActivity";
import AnonymousPrompt from "@/features/profile/AnonymousPrompt";
import ProfileSkeleton from "@/features/profile/ProfileSkeleton";
import ErrorState from "@/features/profile/ErrorState";
import useProfile from "@/features/profile/hooks/useProfile";

export default function Profile() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { user, status, refetch } = useProfile();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          {t("profile.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("profile.description")}
        </p>
      </div>

      {status === "loading" ? (
        <ProfileSkeleton />
      ) : status === "error" ? (
        <ErrorState onRetry={refetch} />
      ) : status === "unauthorized" ? (
        <AnonymousPrompt />
      ) : (
        <div className="space-y-6">
          <ProfileHeader user={user} logout={logout} />
          <PersonalInformation user={user} />
          <AccountActivity />
        </div>
      )}
    </main>
  );
}
