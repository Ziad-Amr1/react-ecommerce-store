import { useTranslation } from "react-i18next";

export default function Carts() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 style={{ color: "magenta" }}>{t("carts.title")}</h1>
    </div>
  );
}
