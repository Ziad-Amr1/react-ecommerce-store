import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import PersonalInformation from "../components/profile/PersonalInformation";
import AccountStatistics from "../components/profile/AccountStatistics";
import RecentOrders from "../components/profile/RecentOrders";

const Profile = () => {
  return (
    <div className="min-h-screen bg-(--color-background) text-(--color-foreground)">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* Profile Header */}
        <ProfileHeader />

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <ProfileSidebar />

          {/* Main Content */}
          <main className="min-w-0 space-y-6">
            <PersonalInformation />
            <AccountStatistics />
            <RecentOrders />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
