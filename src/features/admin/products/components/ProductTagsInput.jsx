import { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProductTagsInput({ tags = [], onChange }) {
  const { t } = useTranslation();
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const tag = tagInput.trim();

    if (!tag || tags.includes(tag)) {
      return;
    }

    onChange([...tags, tag]);
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="tags">{t("products.fields.tags")}</Label>
      <Input
        id="tags"
        type="text"
        value={tagInput}
        onChange={(event) => setTagInput(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("products.tagsPlaceholder")}
      />

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-supporting bg-accent px-3 py-1 text-sm text-foreground"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="cursor-pointer rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                aria-label={t("products.removeTag", { tag })}
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}