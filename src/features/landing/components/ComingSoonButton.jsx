import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export default function ComingSoonButton({
  variant = "outline",
  size = "default",
  className,
  children,
}) {
  const { t } = useTranslation();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Button
            variant={variant}
            size={size}
            disabled
            className={className}
          >
            {children}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs">{t("landing.comingSoon")}</p>
      </TooltipContent>
    </Tooltip>
  );
}