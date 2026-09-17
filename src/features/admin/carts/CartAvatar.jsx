import { avatarColor, initials } from "@/utils/cart-helpers";

export function CartAvatar({ name }) {
  return (
    <div
      className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(
        name
      )}`}
    >
      {initials(name)}
    </div>
  );
}
