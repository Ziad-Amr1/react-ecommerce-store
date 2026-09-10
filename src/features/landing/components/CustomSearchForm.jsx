import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function CustomSearchForm() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div
      className={`relative items-center ${
        isSearchOpen ? "w-full max-w-md" : "w-fit ml-auto"
      }`}
    >
      {!isSearchOpen && (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full cursor-pointer"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search size={20} />
        </Button>
      )}

      {isSearchOpen && (
        <>
          <Input
            type="search"
            placeholder={t("navigation.search")}
            className="w-full pe-8"
            autoFocus
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full cursor-pointer"
            onClick={() => setIsSearchOpen(false)}
          >
            <X size={18} />
          </Button>
        </>
      )}
    </div>
  );
}
