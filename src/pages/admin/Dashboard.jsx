import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 style={{ color: "red" }}>{t("dashboard.title")}</h1>
    </div>
  );
}
