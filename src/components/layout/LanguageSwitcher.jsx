import { useTranslation } from "react-i18next";
import { Check, Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supportedLanguages, setLanguage } from "@/i18n";

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  if (supportedLanguages.length < 2) {
    return null;
  }

  const current = i18n.resolvedLanguage ?? i18n.language;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full cursor-pointer"
          aria-label={t("languages.switcherLabel")}
        >
          <Languages size={20} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedLanguages.map((lng) => (
          <DropdownMenuItem key={lng} onSelect={() => setLanguage(lng)}>
            <span className="flex-1">{t(`languages.${lng}`)}</span>
            {lng === current && <Check className="size-4" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}