// import { useTranslation } from "react-i18next";

// import { Card } from "@/components/ui/card";

// import useCart from "@/hooks/useCart";
// import useCartPage from "@/features/cart/useCartPage";
// import { formatCurrency, ORDER_CURRENCY } from "@/utils/formatCurrency";
// import { CartLineSkeleton } from "@/features/cart/components/CartLineSkeleton";
// import CartHeader from "@/features/cart/components/Cartheader";
// import CartLoadError from "@/features/cart/components/Cartloaderror";
// import CartEmpty from "@/features/cart/components/Cartempty";
// import CartItemsList from "@/features/cart/components/Cartitemslist";

// import SavedForLater from "@/features/cart/components/Savedforlater";
// import ContinueShoppingLink from "@/features/cart/components/Continueshoppinglink";
// import PromoCodeCard from "@/features/cart/components/Promocodecard";
// import OrderSummaryCard from "@/features/cart/components/Ordersummarycard";
// import PromoCodeCardSkeleton from "@/features/cart/components/Promoskeleton";
// import OrderSummaryCardSkeleton from "@/features/cart/components/Summaryskeleton";
// import ClearCartDialog from "@/features/cart/components/Clearcartdialog";

// export default function Cart() {
//   const { i18n, t } = useTranslation();

//   const {
//     cart,
//     isLoading,
//     isUpdating,
//     loadError,
//     removeItem,
//     updateQuantity,
//     clear,
//     applyCoupon,
//     removeCoupon,
//     addItem,
//   } = useCart();

//   const items = cart?.items || [];
//   const itemIdsKey = items.map((item) => item.id).join(",");

//   const {
//     isClearOpen,
//     setIsClearOpen,
//     isClearing,

//     promoCode,
//     setPromoCode,
//     isApplyingPromo,
//     isRemovingCoupon,

//     savedItems,
//     isSavedOpen,
//     setIsSavedOpen,

//     itemsWithStock,
//     hasBlockingStockIssue,

//     handleRemove,
//     handleQuantityChange,
//     handleClear,
//     handleApplyPromo,
//     handleRemoveCoupon,
//     handleSaveForLater,
//     handleMoveToCart,
//   } = useCartPage({
//     items,
//     itemIdsKey,
//     isUpdating,
//     removeItem,
//     updateQuantity,
//     clear,
//     applyCoupon,
//     removeCoupon,
//     addItem,
//     t,
//   });

//   const locale = i18n.language || "en-US";

//   const money = (value) => formatCurrency(value, ORDER_CURRENCY, locale);

//   const discount = cart?.discountAmount || 0;
//   const total = cart?.total ?? 0;
//   const itemCount = cart?.itemCount ?? items.length;

//   return (
//     <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
//       <CartHeader
//         itemCount={itemCount}
//         hasItems={items.length > 0}
//         onClearClick={() => setIsClearOpen(true)}
//       />

//       {loadError && !isLoading && <CartLoadError />}

//       {isLoading ? (
//         <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
//           <Card className="overflow-hidden divide-y divide-(--color-border) rounded-2xl border border-(--color-border) bg-(--color-surface) p-0">
//             <CartLineSkeleton />
//             <CartLineSkeleton />
//             <CartLineSkeleton />
//           </Card>

//           <div className="sticky top-24 space-y-4 self-start">
//             <PromoCodeCardSkeleton />
//             <OrderSummaryCardSkeleton />
//           </div>
//         </div>
//       ) : items.length === 0 ? (
//         <CartEmpty />
//       ) : (
//         <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
//           {/* Left Column */}
//           <div className="space-y-4">
//             <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)">
//               <CartItemsList
//                 itemsWithStock={itemsWithStock}
//                 itemCount={itemCount}
//                 isUpdating={isUpdating}
//                 money={money}
//                 onQuantityChange={handleQuantityChange}
//                 onSaveForLater={handleSaveForLater}
//                 onRemove={handleRemove}
//               />

//               <SavedForLater
//                 savedItems={savedItems}
//                 isOpen={isSavedOpen}
//                 onOpenChange={setIsSavedOpen}
//                 money={money}
//                 onMoveToCart={handleMoveToCart}
//               />
//             </div>

//             <ContinueShoppingLink />
//           </div>

//           {/* Right Column */}
//           <div className="space-y-4">
//             <PromoCodeCard
//               promoCode={promoCode}
//               setPromoCode={setPromoCode}
//               isApplyingPromo={isApplyingPromo}
//               isRemovingCoupon={isRemovingCoupon}
//               coupon={cart.coupon}
//               discount={discount}
//               money={money}
//               onApply={handleApplyPromo}
//               onRemoveCoupon={handleRemoveCoupon}
//             />

//             <OrderSummaryCard
//               itemCount={itemCount}
//               subtotal={cart.subtotal}
//               discount={discount}
//               total={total}
//               hasBlockingStockIssue={hasBlockingStockIssue}
//               money={money}
//               items={items}
//               coupon={cart.coupon}
//             />
//           </div>
//         </div>
//       )}

//       <ClearCartDialog
//         isOpen={isClearOpen}
//         setIsOpen={setIsClearOpen}
//         isClearing={isClearing}
//         onConfirm={handleClear}
//       />
//     </div>
//   );
// }

import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";

import useCart from "@/hooks/useCart";
import useCartPage from "@/features/cart/useCartPage";
import { formatCurrency, ORDER_CURRENCY } from "@/utils/formatCurrency";
import { CartLineSkeleton } from "@/features/cart/components/CartLineSkeleton";
import CartHeader from "@/features/cart/components/Cartheader";
import CartLoadError from "@/features/cart/components/Cartloaderror";
import CartEmpty from "@/features/cart/components/Cartempty";
import CartItemsList from "@/features/cart/components/Cartitemslist";

import SavedForLater from "@/features/cart/components/Savedforlater";
import ContinueShoppingLink from "@/features/cart/components/Continueshoppinglink";
import PromoCodeCard from "@/features/cart/components/Promocodecard";
import OrderSummaryCard from "@/features/cart/components/Ordersummarycard";
import PromoCodeCardSkeleton from "@/features/cart/components/Promoskeleton";
import OrderSummaryCardSkeleton from "@/features/cart/components/Summaryskeleton";
import ClearCartDialog from "@/features/cart/components/Clearcartdialog";

export default function Cart() {
  const { i18n, t } = useTranslation();

  const {
    cart,
    isLoading,
    isUpdating,
    loadError,
    removeItem,
    updateQuantity,
    clear,
    applyCoupon,
    removeCoupon,
    addItem,
  } = useCart();

  const items = cart?.items || [];
  const itemIdsKey = items.map((item) => item.id).join(",");

  const {
    isClearOpen,
    setIsClearOpen,
    isClearing,

    promoCode,
    setPromoCode,
    isApplyingPromo,
    isRemovingCoupon,

    savedItems,
    isSavedOpen,
    setIsSavedOpen,

    itemsWithStock,
    hasBlockingStockIssue,

    handleRemove,
    handleQuantityChange,
    handleClear,
    handleApplyPromo,
    handleRemoveCoupon,
    handleSaveForLater,
    handleMoveToCart,
  } = useCartPage({
    items,
    itemIdsKey,
    isUpdating,
    removeItem,
    updateQuantity,
    clear,
    applyCoupon,
    removeCoupon,
    addItem,
    t,
  });

  const locale = i18n.language || "en-US";

  const money = (value) => formatCurrency(value, ORDER_CURRENCY, locale);

  const discount = cart?.discountAmount || 0;
  const total = cart?.total ?? 0;
  const itemCount = cart?.itemCount ?? items.length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <CartHeader
        itemCount={itemCount}
        hasItems={items.length > 0}
        onClearClick={() => setIsClearOpen(true)}
      />

      {loadError && !isLoading && <CartLoadError />}

      {isLoading ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <Card className="overflow-hidden divide-y divide-(--color-border) rounded-2xl border border-(--color-border) bg-(--color-surface) p-0">
            <CartLineSkeleton />
            <CartLineSkeleton />
            <CartLineSkeleton />
          </Card>

          <div className="space-y-4">
            <PromoCodeCardSkeleton />
            <OrderSummaryCardSkeleton />
          </div>
        </div>
      ) : items.length === 0 ? (
        <CartEmpty />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)">
              <CartItemsList
                itemsWithStock={itemsWithStock}
                itemCount={itemCount}
                isUpdating={isUpdating}
                money={money}
                onQuantityChange={handleQuantityChange}
                onSaveForLater={handleSaveForLater}
                onRemove={handleRemove}
              />

              <SavedForLater
                savedItems={savedItems}
                isOpen={isSavedOpen}
                onOpenChange={setIsSavedOpen}
                money={money}
                onMoveToCart={handleMoveToCart}
              />
            </div>

            <ContinueShoppingLink />
          </div>

          {/* Right Column */}
          <div className="sticky top-24 space-y-4 self-start">
            <PromoCodeCard
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              isApplyingPromo={isApplyingPromo}
              isRemovingCoupon={isRemovingCoupon}
              coupon={cart.coupon}
              discount={discount}
              money={money}
              onApply={handleApplyPromo}
              onRemoveCoupon={handleRemoveCoupon}
            />

            <OrderSummaryCard
              itemCount={itemCount}
              subtotal={cart.subtotal}
              discount={discount}
              total={total}
              hasBlockingStockIssue={hasBlockingStockIssue}
              money={money}
              items={items}
              coupon={cart.coupon}
            />
          </div>
        </div>
      )}

      <ClearCartDialog
        isOpen={isClearOpen}
        setIsOpen={setIsClearOpen}
        isClearing={isClearing}
        onConfirm={handleClear}
      />
    </div>
  );
}