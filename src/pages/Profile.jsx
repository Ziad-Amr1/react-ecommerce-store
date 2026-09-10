import { useTranslation } from "react-i18next";
import useAuth from "@/hooks/useAuth";
import ProfileHeader from "@/features/profile/ProfileHeader";
import PersonalInformation from "@/features/profile/PersonalInformation";
import AccountActivity from "@/features/profile/AccountActivity";
import AnonymousPrompt from "@/features/profile/AnonymousPrompt";
import ProfileSkeleton from "@/features/profile/ProfileSkeleton";

export default function Profile() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();

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

      {isLoading ? (
        <ProfileSkeleton />
      ) : isAuthenticated ? (
        <div className="space-y-6">
          <ProfileHeader />
          <PersonalInformation />
          <AccountActivity />
        </div>
      ) : (
        <AnonymousPrompt />
      )}
    </main>
  );
}