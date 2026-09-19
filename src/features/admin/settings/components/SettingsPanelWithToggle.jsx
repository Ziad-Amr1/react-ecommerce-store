import { Switch } from "@/components/ui/switch";
export default function SettingsPanelWithToggle({
  title,
  desc,
  icon,
  isLastItem,
}) {
  return (
    <div className="py-2 my-2">
      <div
        className={`flex items-center justify-between pb-2  ${!isLastItem ? "border-b" : ""}`}
      >
        <div className="flex gap-3 sm:gap-4 items-center min-w-0">
          <div className="size-8 shrink-0 rounded-lg sm:size-[38px] flex justify-center items-center bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-secondary)]">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-[var(--color-text-primary)] capitalize mb-1">
              {title}
            </h3>
            <h4 className="text-sm sm:text-base font-normal text-[var(--color-text-secondary)] sm:tracking-wide">
              {desc}
            </h4>
          </div>
        </div>
        <div className="ms-1">
          <Switch id={title} />
        </div>
      </div>
    </div>
  );
}
