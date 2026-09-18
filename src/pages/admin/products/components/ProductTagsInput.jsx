import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";

function ProductTagsInput({ tags = [], onChange }) {
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
            <Label htmlFor="tags">Tags</Label>

            <Input id="tags" type="text" value={tagInput} onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleKeyDown} placeholder="Enter a tag and press Enter" />

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                    {tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-supporting bg-accent px-3 py-1 text-sm text-foreground">
                            {tag}

                            <button type="button" onClick={() => removeTag(tag)}
                                className="cursor-pointer rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground" aria-label={`Remove ${tag}`}
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductTagsInput;