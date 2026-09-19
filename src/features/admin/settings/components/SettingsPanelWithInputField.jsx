import { Input } from "@/components/ui/input";
export default function SettingsPanelWithInputField({
  icon,
  title,
  placeholder,
}) {
  return (
    <div className="flex gap-4 items-center w-full mb-6">
      <div className="size-[38px] flex justify-center items-center rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] border border-[var(--color-secondary)]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-[var(--color-text-primary)] capitalize mb-2">
          {title}
        </h3>
        <Input
          className="w-full sm:w-1/2"
          placeholder={placeholder}
          name="storeName"
        />
      </div>
    </div>
  );
}
