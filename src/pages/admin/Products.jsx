import { useTranslation } from "react-i18next";

export default function Products() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 style={{ color: "green" }}>{t("products.title")}</h1>
    </div>
  );
}
