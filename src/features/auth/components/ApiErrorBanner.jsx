import { CircleX } from "lucide-react";

const variantClasses = {
  default: "flex items-start gap-3 rounded-lg border border-(--color-error) bg-(--color-error-bg) p-4",
  plain: "rounded-lg border border-(--color-error)/25 bg-(--color-error-bg) p-3 text-center text-sm font-medium text-(--color-error)",
};

export default function ApiErrorBanner({ message, variant = "default", icon }) {
  if (!message) {
    return null;
  }

  const classes = variantClasses[variant] ?? variantClasses.default;

  return (
    <div role="alert" className={classes}>
      {variant === "default" && icon && (
        <CircleX
          className="mt-0.5 size-5 shrink-0 text-(--color-error)"
          aria-hidden="true"
        />
      )}

      <p
        className={
          variant === "default"
            ? "text-sm leading-5 font-medium text-(--color-error)"
            : ""
        }
      >
        {message}
      </p>
    </div>
  );
}