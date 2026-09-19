import SettingsPanelWithInputField from "@/features/admin/settings/components/SettingsPanelWithInputField";
import SettingsPanelWithToggle from "@/features/admin/settings/components/SettingsPanelWithToggle";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Settings2,
  Store,
  Bell,
  Truck,
  MessageSquare,
  Megaphone,
  Languages,
  Construction,
  Palette,
  MessageSquareMore,
} from "lucide-react";
import SettingsLanguageToggler from "@/features/admin/settings/components/SettingsLanguageToggler";
import SettingsThemeCard from "@/features/admin/settings/components/SettingsThemeCard";

export default function Settings() {
  const { t } = useTranslation();
  const [selectedThemeColorName, setSelectedThemeColorName] = useState(
    localStorage.getItem("selectedThemeColorName") || "emerald",
  );

  const notificationsItems = [
    {
      title: t("settings.orderTracking"),
      desc: t("settings.notifiedOrderTracking"),
      icon: <Truck size={20} className="rtl:-scale-x-100" />,
      isLastItem: false,
    },
    {
      title: t("settings.comments"),
      desc: t("settings.notifiedComments"),
      icon: <MessageSquare size={20} className="rtl:-scale-x-100" />,
      isLastItem: false,
    },
    {
      title: t("settings.ads"),
      desc: t("settings.notifiedAds"),
      icon: <Megaphone size={20} className="rtl:-scale-x-100" />,
      isLastItem: true,
    },
  ];

  const themeCards = [
    { color: "#57CC99", key: "emerald", name: t("settings.colors.emerald") },
    { color: "#C33149", key: "cherry", name: t("settings.colors.cherry") },
    { color: "#F78E69", key: "coral", name: t("settings.colors.coral") },
    { color: "#A8763E", key: "copper", name: t("settings.colors.copper") },
    { color: "#AA7DCE", key: "lavender", name: t("settings.colors.lavender") },
    { color: "#3B429F", key: "twilight", name: t("settings.colors.twilight") },
    { color: "#FFFD82", key: "canary", name: t("settings.colors.canary") },
  ];

  return (
    <div className="py-2 px-8">
      <div className="flex items-center gap-2 font-bold text-lg mt-3 mb-6">
        <Settings2 size={30} />
        <h2 className="capitalize">{t("settings.general")}</h2>
      </div>
      <div className="bg-[var(--color-surface)] p-4 rounded-lg">
        <SettingsPanelWithInputField
          icon={<Store size={20} />}
          title={t("settings.storeName")}
          placeholder={t("settings.storeNamePlaceholder")}
        />

        <SettingsLanguageToggler
          icon={<Languages size={20} />}
          title={t("settings.siteLanguage")}
        />
        <SettingsPanelWithToggle
          title={t("settings.maintenanceMode")}
          desc={t("settings.maintenanceModeDesc")}
          icon={<Construction size={20} />}
          isLastItem={true}
        />
        <SettingsPanelWithToggle
          title={t("settings.productComments")}
          desc={t("settings.productCommentsDesc")}
          icon={<MessageSquareMore size={20} className="rtl:-scale-x-100" />}
          isLastItem={true}
        />
      </div>

      <div className="flex items-center gap-2 font-bold text-lg mt-10 mb-6">
        <Bell size={30} />
        <h2 className="capitalize">{t("settings.notifications")}</h2>
      </div>
      <div className="bg-[var(--color-surface)] px-4 py-2 rounded-lg">
        {notificationsItems.map((notificationItem) => (
          <SettingsPanelWithToggle
            key={notificationItem.title}
            title={notificationItem.title}
            desc={notificationItem.desc}
            icon={notificationItem.icon}
            isLastItem={notificationItem.isLastItem}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-10 mb-6">
        <div className="flex gap-2 items-center font-bold text-lg">
          <Palette size={30} />
          <h2 className="capitalize">{t("settings.theme")}</h2>
        </div>
        <p className="text-[var(--color-text-secondary)]">
          {t(`settings.colors.${selectedThemeColorName}`)}
        </p>
      </div>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 bg-[var(--color-surface)] p-6 rounded-lg">
        {themeCards.map((themeCard) => (
          <SettingsThemeCard
            key={themeCard.name}
            color={themeCard.color}
            name={themeCard.name}
            colorKey={themeCard.key}
            selectedThemeColorName={selectedThemeColorName}
            setSelectedThemeColorName={setSelectedThemeColorName}
          />
        ))}
      </div>
    </div>
  );
}
