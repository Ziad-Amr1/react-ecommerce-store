import { Star, StarHalf } from "lucide-react";

export default function Stars({ value, label }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={label ?? `Rated ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((position) => {
        const filled = value >= position;
        const half = !filled && value > position - 1;
        const Icon = half && position === Math.ceil(value) ? StarHalf : Star;
        const active = filled || half;

        return (
          <Icon
            key={position}
            aria-hidden="true"
            className={
              active
                ? "size-4 fill-[var(--color-warning)] text-[var(--color-warning)]"
                : "size-4 text-[var(--color-border-strong)]"
            }
          />
        );
      })}
    </div>
  );
}