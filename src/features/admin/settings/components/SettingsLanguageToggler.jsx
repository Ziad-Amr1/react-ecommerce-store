import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslation } from "react-i18next";
import { setLanguage } from "@/i18n";

export default function SettingsLanguageToggler({ icon, title }) {
  const { t, i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language;
  function changeLanguage(value) {
    if (value == "en") {
      setLanguage("en");
    } else {
      setLanguage("ar");
    }
  }
  return (
    <div className="flex gap-4 items-center w-full py-3 mb-6">
      <div className="size-[38px] flex justify-center items-center rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-secondary)]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-[var(--color-text-primary)] capitalize mb-2">
          {title}
        </h3>
        <ToggleGroup
          variant="outline"
          type="single"
          value={current}
          onValueChange={changeLanguage}
        >
          <ToggleGroupItem
            className="cursor-pointer"
            value="en"
            aria-label="English"
          >
            {t("languages.en")}
          </ToggleGroupItem>
          <ToggleGroupItem
            className="cursor-pointer"
            value="ar"
            aria-label="Arabic"
          >
            {t("languages.ar")}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
