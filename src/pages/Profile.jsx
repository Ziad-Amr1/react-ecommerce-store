import { useTranslation } from "react-i18next";
import useAuth from "@/hooks/useAuth";
import ProfileHeader from "@/features/profile/ProfileHeader";
import PersonalInformation from "@/features/profile/PersonalInformation";
import AccountActivity from "@/features/profile/AccountActivity";
import AnonymousPrompt from "@/features/profile/AnonymousPrompt";
import ProfileSkeleton from "@/features/profile/ProfileSkeleton";
import DeleteAccountDialog from "@/features/profile/DeleteAccountDialog";

export default function Profile() {
  const { t } = useTranslation();
  const { user, isLoading, logout, updateUser, deleteAccount } = useAuth();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-4 sm:mb-6">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">
          {t("profile.title")}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          {t("profile.description")}
        </p>
      </div>

      {isLoading ? (
        <ProfileSkeleton />
      ) : user ? (
        <div className="space-y-4 sm:space-y-6">
          <ProfileHeader user={user} logout={logout} />
          <PersonalInformation user={user} updateUser={updateUser} />
          <AccountActivity />
          <div className="flex justify-end pt-4 border-t border-border">
            <DeleteAccountDialog deleteAccount={deleteAccount} />
          </div>
        </div>
      ) : (
        <AnonymousPrompt />
      )}
    </main>
  );
}
