import { Check } from "lucide-react";

export default function SettingsThemeCard({
  color,
  name,
  colorKey,
  selectedThemeColorName,
  setSelectedThemeColorName,
}) {
  return (
    <button
      className="flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all duration-200
                active:scale-95 border border-[var(--color-secondary)] cursor-pointer"
      title={name}
      onClick={() => {
        setSelectedThemeColorName(colorKey);
        localStorage.setItem("selectedThemeColorName", colorKey);
      }}
    >
      <div
        className="size-7 rounded-full flex justify-center items-center"
        style={{ backgroundColor: color }}
      >
        <Check
          className={`font-extrabold text-[var(--color-text-primary)] ${selectedThemeColorName !== colorKey ? "hidden" : "block"}`}
          size={18}
        />
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] capitalize">
        {name}
      </p>
    </button>
  );
}
