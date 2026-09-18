import { useTranslation } from "react-i18next";
import { Check, Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full cursor-pointer"
              aria-label={t("languages.switcherLabel", "Languages")}
            >
              <Languages size={20} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {t("languages.switcherLabel", "Languages")}
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("languages.switcherLabel", "Languages")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {supportedLanguages.map((lng) => (
          <DropdownMenuItem
            key={lng}
            onSelect={() => setLanguage(lng)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex-1 font-medium">{t(`languages.${lng}`, lng.toUpperCase())}</span>
            {lng === current && <Check className="size-4 text-(--color-primary)" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}