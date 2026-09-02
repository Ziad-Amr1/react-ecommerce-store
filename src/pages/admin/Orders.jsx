import { useTranslation } from "react-i18next";

export default function Orders() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 style={{ color: "blue" }}>{t("orders.title")}</h1>
    </div>
  );
}
