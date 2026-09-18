// import { useTranslation } from "react-i18next";

// import CartItem from "@/features/cart/components/Cartitem";
// import { pluralize } from "@/features/cart/cartUtils";

// export default function CartItemsList({
//   itemsWithStock,
//   itemCount,
//   isUpdating,
//   money,
//   onQuantityChange,
//   onSaveForLater,
//   onRemove,
// }) {
//   const { t } = useTranslation();

//   return (
//     <>
//       <div className="flex items-center justify-between gap-4 border-b border-(--color-border) px-4 py-3 sm:px-5">
//         <span className="text-sm font-medium text-(--color-text-primary)">
//           {t("cart.itemsCount", {
//             count: itemCount,
//             defaultValue: pluralize(itemCount, "item"),
//           })}
//         </span>

//         <div className="hidden items-center gap-10 text-xs font-medium text-(--color-text-muted) sm:flex">
//           <span className="w-20 text-center">{t("cart.price", "Price")}</span>

//           <span className="w-28 text-center">
//             {t("cart.quantity", "Quantity")}
//           </span>

//           <span className="w-20 text-center">
//             {t("cart.itemTotal", "Total")}
//           </span>
//         </div>
//       </div>

//       <ul className="divide-y divide-(--color-border)">
//         {itemsWithStock.map((item) => (
//           <CartItem
//             key={item.id}
//             item={item}
//             isUpdating={isUpdating}
//             money={money}
//             onQuantityChange={onQuantityChange}
//             onSaveForLater={onSaveForLater}
//             onRemove={onRemove}
//           />
//         ))}
//       </ul>
//     </>
//   );
// }

import { useTranslation } from "react-i18next";

import CartItem from "@/features/cart/components/Cartitem";

export default function CartItemsList({
  itemsWithStock,
  
  isUpdating,
  money,
  onQuantityChange,
  onSaveForLater,
  onRemove,
}) {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-(--color-border) px-4 py-3 sm:px-5">
        <span className="text-sm font-medium text-(--color-text-primary)">
          {t("cart.name", "Name")}
        </span>

        <div className="hidden items-center gap-10 text-xs font-medium text-(--color-text-muted) sm:flex">
          <span className="w-20 text-center">{t("cart.price", "Price")}</span>

          <span className="w-28 text-center">
            {t("cart.quantity", "Quantity")}
          </span>

          <span className="w-20 text-center">
            {t("cart.itemTotal", "Total")}
          </span>
        </div>
      </div>

      <ul className="divide-y divide-(--color-border)">
        {itemsWithStock.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            isUpdating={isUpdating}
            money={money}
            onQuantityChange={onQuantityChange}
            onSaveForLater={onSaveForLater}
            onRemove={onRemove}
          />
        ))}
      </ul>
    </>
  );
}