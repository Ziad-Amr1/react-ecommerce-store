// import { useState } from "react";
// import { Link } from "react-router";
// import { useTranslation } from "react-i18next";
// import { toast } from "sonner";
// import {
//   BadgePercent,
//   LogIn,
//   Minus,
//   PackageOpen,
//   Plus,
//   ShoppingCart,
//   Trash2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Empty,
//   EmptyContent,
//   EmptyDescription,
//   EmptyHeader,
//   EmptyMedia,
//   EmptyTitle,
// } from "@/components/ui/empty";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogMedia,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import useAuth from "@/hooks/useAuth";
// import useCart from "@/hooks/useCart";
// import { formatCurrency, ORDER_CURRENCY } from "@/utils/formatCurrency";

// function CartLineSkeleton() {
//   return (
//     <div className="flex gap-4 p-4">
//       <div className="size-20 shrink-0 animate-pulse rounded-lg bg-(--color-surface-secondary)" />
//       <div className="flex-1 space-y-2 py-1">
//         <div className="h-4 w-1/2 animate-pulse rounded bg-(--color-surface-secondary)" />
//         <div className="h-3 w-1/4 animate-pulse rounded bg-(--color-surface-secondary)" />
//       </div>
//       <div className="h-8 w-20 animate-pulse self-end rounded bg-(--color-surface-secondary)" />
//     </div>
//   );
// }

// export default function Cart() {
//   const { t, i18n } = useTranslation();
//   const { user } = useAuth();
//   const {
//     cart,
//     isLoading,
//     isUpdating,
//     isSignedIn,
//     removeItem,
//     updateQuantity,
//     clear,
//   } = useCart();
//   const [isClearOpen, setIsClearOpen] = useState(false);
//   const [isClearing, setIsClearing] = useState(false);

//   const isGuest = !user;
//   const locale = i18n.language || "en-US";
//   const money = (value) => formatCurrency(value, ORDER_CURRENCY, locale);

//   const handleRemove = async (item) => {
//     try {
//       await removeItem(item.id);
//       toast.success(t("cart.removed", { name: item.name }));
//     } catch {
//       toast.error(t("cart.removeFailed"));
//     }
//   };

//   const handleQuantityChange = async (item, quantity) => {
//     if (isUpdating || quantity < 1) {
//       return;
//     }

//     try {
//       await updateQuantity(item.id, quantity);
//     } catch {
//       toast.error(t("cart.updateFailed"));
//     }
//   };

//   const handleClear = async () => {
//     if (isClearing) {
//       return;
//     }

//     setIsClearing(true);

//     try {
//       await clear();
//       toast.success(t("cart.cleared"));
//       setIsClearOpen(false);
//     } catch {
//       toast.error(t("cart.clearFailed"));
//     } finally {
//       setIsClearing(false);
//     }
//   };

//   return (
//     <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//       <div className="flex flex-wrap items-baseline justify-between gap-2">
//         <h1 className="font-display text-2xl font-bold text-foreground">
//           {t("cart.title")}
//         </h1>
//         {cart.itemCount > 0 && (
//           <p className="text-sm text-muted-foreground">
//             {t("cart.itemsCount", { count: cart.itemCount })}
//           </p>
//         )}
//       </div>

//       {isLoading ? (
//         <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
//           <Card className="divide-y divide-border border-(--color-border)">
//             <CartLineSkeleton />
//             <CartLineSkeleton />
//             <CartLineSkeleton />
//           </Card>
//           <Card className="h-56 animate-pulse border-(--color-border)" />
//         </div>
//       ) : cart.items.length === 0 ? (
//         <Empty className="mt-6 border border-dashed">
//           <EmptyHeader>
//             <EmptyMedia variant="icon">
//               <ShoppingCart className="size-6" aria-hidden="true" />
//             </EmptyMedia>
//             <EmptyTitle>{t("cart.emptyTitle")}</EmptyTitle>
//             <EmptyDescription>{t("cart.emptyDescription")}</EmptyDescription>
//           </EmptyHeader>

//           <EmptyContent>
//             <Button asChild>
//               <Link to="/products">{t("cart.browseProducts")}</Link>
//             </Button>
//           </EmptyContent>
//         </Empty>
//       ) : (
//         <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
//           {/* Lines */}
//           <Card className="border-(--color-border)">
//             <ul className="divide-y divide-(--color-border)">
//               {cart.items.map((item) => (
//                 <li key={item.id}>
//                   <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
//                     <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-(--color-surface-secondary)">
//                       {item.image ? (
//                         <img
//                           src={item.image}
//                           alt={item.name}
//                           className="h-full w-full object-cover"
//                         />
//                       ) : (
//                         <div className="flex h-full w-full items-center justify-center">
//                           <PackageOpen
//                             className="size-5 text-(--color-text-disabled)"
//                             aria-hidden="true"
//                           />
//                         </div>
//                       )}
//                     </div>

//                     <div className="min-w-0 flex-1">
//                       <Link
//                         to={`/products/${item.id}`}
//                         className="line-clamp-2 font-medium text-(--color-text-primary) transition-colors hover:text-(--color-primary)"
//                       >
//                         {item.name}
//                       </Link>
//                       <p className="mt-1 text-sm text-muted-foreground">
//                         {t("cart.unitPrice", {
//                           price: money(item.price),
//                         })}
//                       </p>

//                       <div className="mt-3 flex items-center gap-2">
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="icon-sm"
//                           className="cursor-pointer"
//                           onClick={() => handleQuantityChange(item, item.quantity - 1)}
//                           disabled={isUpdating || item.quantity <= 1}
//                           aria-label={t("cart.minus")}
//                         >
//                           <Minus className="size-3.5" aria-hidden="true" />
//                         </Button>

//                         <span
//                           className="min-w-8 text-center text-sm font-semibold tabular-nums text-(--color-text-primary)"
//                           aria-label={t("cart.quantity")}
//                         >
//                           {item.quantity}
//                         </span>

//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="icon-sm"
//                           className="cursor-pointer"
//                           onClick={() => handleQuantityChange(item, item.quantity + 1)}
//                           disabled={isUpdating}
//                           aria-label={t("cart.plus")}
//                         >
//                           <Plus className="size-3.5" aria-hidden="true" />
//                         </Button>
//                       </div>
//                     </div>

//                     <div className="flex shrink-0 flex-col items-end justify-between gap-2">
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon-sm"
//                         className="cursor-pointer text-muted-foreground hover:text-(--color-error)"
//                         onClick={() => handleRemove(item)}
//                         disabled={isUpdating}
//                         aria-label={t("cart.removeItem", { name: item.name })}
//                       >
//                         <Trash2 className="size-4" aria-hidden="true" />
//                       </Button>
//                       <p className="font-semibold tabular-nums text-(--color-text-primary)">
//                         {money(item.price * item.quantity)}
//                       </p>
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </Card>

//           {/* Summary */}
//           <div className="space-y-4">
//             {isGuest && (
//               <div className="flex items-start gap-3 rounded-xl border border-(--color-border) bg-(--color-surface-secondary) p-4">
//                 <LogIn className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
//                 <p className="text-sm text-muted-foreground">
//                   {t("cart.guestNote")}
//                 </p>
//               </div>
//             )}

//             <Card className="border-(--color-border)">
//               <CardContent className="space-y-4 pt-6">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">{t("cart.subtotal")}</span>
//                   <span className="font-medium tabular-nums text-foreground">
//                     {money(cart.subtotal)}
//                   </span>
//                 </div>

//                 {isSignedIn && cart.discountAmount > 0 && (
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="flex items-center gap-1.5 text-success">
//                       <BadgePercent className="size-4" aria-hidden="true" />
//                       {t("cart.discount")}
//                       {cart.coupon ? ` · ${cart.coupon}` : ""}
//                     </span>
//                     <span className="tabular-nums text-success">
//                       -{money(cart.discountAmount)}
//                     </span>
//                   </div>
//                 )}

//                 <div className="flex items-center justify-between border-t border-(--color-border) pt-4">
//                   <span className="font-medium text-foreground">{t("cart.total")}</span>
//                   <span className="font-display text-xl font-bold tabular-nums text-foreground">
//                     {money(cart.total)}
//                   </span>
//                 </div>

//                 <div className="flex flex-col gap-2 pt-1">
//                   <Button
//                     asChild
//                     className="bg-(--color-primary) text-primary-foreground hover:bg-(--color-secondary)"
//                   >
//                     <Link to="/products">{t("cart.continueShopping")}</Link>
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="border-(--color-border) text-muted-foreground hover:text-(--color-error)"
//                     onClick={() => setIsClearOpen(true)}
//                   >
//                     <Trash2 className="size-4" aria-hidden="true" />
//                     {t("cart.clear")}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       )}

//       {/* Clear cart confirmation */}
//       <AlertDialog
//         open={isClearOpen}
//         onOpenChange={(open) => !open && !isClearing && setIsClearOpen(false)}
//       >
//         <AlertDialogContent size="sm">
//           <AlertDialogHeader>
//             <AlertDialogMedia className="bg-error-bg text-error">
//               <Trash2 aria-hidden="true" />
//             </AlertDialogMedia>
//             <AlertDialogTitle className="font-display">
//               {t("cart.clearTitle")}
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               {t("cart.clearDescription")}
//             </AlertDialogDescription>
//           </AlertDialogHeader>

//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isClearing}>
//               {t("cart.cancel")}
//             </AlertDialogCancel>
//             <AlertDialogAction
//               variant="destructive"
//               onClick={handleClear}
//               disabled={isClearing}
//             >
//               {isClearing ? t("cart.clearing") : t("cart.clearConfirm")}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

// import { useState } from "react";
// import { Link } from "react-router";
// import { useTranslation } from "react-i18next";
// import { toast } from "sonner";
// import {
//   Minus,
//   PackageOpen,
//   Plus,
//   ShoppingCart,
//   Trash2,
//   Tag,
//   X,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   Empty,
//   EmptyContent,
//   EmptyDescription,
//   EmptyHeader,
//   EmptyMedia,
//   EmptyTitle,
// } from "@/components/ui/empty";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogMedia,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import useAuth from "@/hooks/useAuth";
// import useCart from "@/hooks/useCart";
// import { formatCurrency, ORDER_CURRENCY } from "@/utils/formatCurrency";

// function CartLineSkeleton() {
//   return (
//     <div className="flex items-center gap-4 p-4">
//       <div className="size-16 shrink-0 animate-pulse rounded-lg bg-(--color-surface-secondary)" />
//       <div className="flex-1 space-y-2">
//         <div className="h-4 w-1/3 animate-pulse rounded bg-(--color-surface-secondary)" />
//         <div className="h-3 w-1/4 animate-pulse rounded bg-(--color-surface-secondary)" />
//       </div>
//       <div className="h-8 w-24 animate-pulse rounded bg-(--color-surface-secondary)" />
//       <div className="h-5 w-16 animate-pulse rounded bg-(--color-surface-secondary)" />
//     </div>
//   );
// }

// export default function Cart() {
//   const { t, i18n } = useTranslation();
//   const { user } = useAuth();
//   const {
//     cart,
//     isLoading,
//     isUpdating,
//     isSignedIn,
//     removeItem,
//     updateQuantity,
//     clear,
//     applyCoupon, // إذا كان موجوداً في الـ hook
//     removeCoupon, // إذا كان موجوداً في الـ hook
//   } = useCart();

//   const [isClearOpen, setIsClearOpen] = useState(false);
//   const [isClearing, setIsClearing] = useState(false);
//   const [promoCode, setPromoCode] = useState("");

//   const locale = i18n.language || "en-US";
//   const money = (value) => formatCurrency(value, ORDER_CURRENCY, locale);

//   const handleRemove = async (item) => {
//     try {
//       await removeItem(item.id);
//       toast.success(t("cart.removed", { name: item.name }));
//     } catch {
//       toast.error(t("cart.removeFailed"));
//     }
//   };

//   const handleQuantityChange = async (item, quantity) => {
//     if (isUpdating || quantity < 1) return;

//     try {
//       await updateQuantity(item.id, quantity);
//     } catch {
//       toast.error(t("cart.updateFailed"));
//     }
//   };

//   const handleClear = async () => {
//     if (isClearing) return;
//     setIsClearing(true);

//     try {
//       await clear();
//       toast.success(t("cart.cleared"));
//       setIsClearOpen(false);
//     } catch {
//       toast.error(t("cart.clearFailed"));
//     } finally {
//       setIsClearing(false);
//     }
//   };

//   const handleApplyPromo = (e) => {
//     e.preventDefault();
//     if (!promoCode.trim()) return;
//     if (applyCoupon) {
//       applyCoupon(promoCode);
//     } else {
//       toast.info("Promo code applied");
//     }
//   };

//   return (
//     <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
//       {/* Title Header */}
//       <div className="mb-6 space-y-1">
//         <h1 className="text-2xl font-semibold text-(--color-text-primary)">
//           {t("cart.title", "Your cart")}
//         </h1>
//         {cart?.itemCount > 0 && (
//           <p className="text-sm text-(--color-text-muted)">
//             {t("cart.itemsCount", {
//               count: cart.itemCount,
//               defaultValue: `${cart.itemCount} items`,
//             })}
//           </p>
//         )}
//       </div>

//       {isLoading ? (
//         <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
//           <Card className="divide-y divide-(--color-border) rounded-2xl border border-(--color-border) bg-white p-2">
//             <CartLineSkeleton />
//             <CartLineSkeleton />
//             <CartLineSkeleton />
//           </Card>
//           <Card className="h-80 animate-pulse rounded-2xl border border-(--color-border) bg-(--color-surface-secondary)" />
//         </div>
//       ) : !cart?.items || cart.items.length === 0 ? (
//         <Empty className="mt-6 border border-dashed rounded-2xl">
//           <EmptyHeader>
//             <EmptyMedia variant="icon">
//               <ShoppingCart className="size-6" aria-hidden="true" />
//             </EmptyMedia>
//             <EmptyTitle>
//               {t("cart.emptyTitle", "Your cart is empty")}
//             </EmptyTitle>
//             <EmptyDescription>
//               {t(
//                 "cart.emptyDescription",
//                 "Explore our products and add items to your cart.",
//               )}
//             </EmptyDescription>
//           </EmptyHeader>

//           <EmptyContent>
//             <Button asChild className="rounded-xl">
//               <Link to="/products">
//                 {t("cart.browseProducts", "Browse Products")}
//               </Link>
//             </Button>
//           </EmptyContent>
//         </Empty>
//       ) : (
//         <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
//           {/* Cart Items Box */}
//           <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-white">
//             <ul className="divide-y divide-(--color-border)">
//               {cart.items.map((item) => (
//                 <li key={item.id} className="p-4 sm:p-5">
//                   <div className="flex items-center gap-4">
//                     {/* Item Image */}
//                     <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-[#F3F4F6]">
//                       {item.image ? (
//                         <img
//                           src={item.image}
//                           alt={item.name}
//                           className="h-full w-full object-cover"
//                         />
//                       ) : (
//                         <div className="flex h-full w-full items-center justify-center">
//                           <PackageOpen className="size-5 text-(--color-text-disabled)" />
//                         </div>
//                       )}
//                     </div>

//                     {/* Item Details */}
//                     <div className="min-w-0 flex-1">
//                       <Link
//                         to={`/products/${item.id}`}
//                         className="line-clamp-1 font-medium text-sm text-(--color-text-primary) hover:underline"
//                       >
//                         {item.name}
//                       </Link>
//                       <p className="mt-0.5 text-xs text-(--color-text-muted)">
//                         {money(item.price)}
//                       </p>
//                     </div>

//                     {/* Quantity Stepper */}
//                     <div className="flex items-center gap-2 rounded-lg border border-(--color-border) px-2 py-1">
//                       <button
//                         type="button"
//                         onClick={() =>
//                           handleQuantityChange(item, item.quantity - 1)
//                         }
//                         disabled={isUpdating || item.quantity <= 1}
//                         className="text-gray-500 hover:text-black disabled:opacity-30 cursor-pointer"
//                       >
//                         <Minus className="size-3.5" />
//                       </button>
//                       <span className="w-5 text-center text-sm font-medium tabular-nums">
//                         {item.quantity}
//                       </span>
//                       <button
//                         type="button"
//                         onClick={() =>
//                           handleQuantityChange(item, item.quantity + 1)
//                         }
//                         disabled={isUpdating}
//                         className="text-gray-500 hover:text-black disabled:opacity-30 cursor-pointer"
//                       >
//                         <Plus className="size-3.5" />
//                       </button>
//                     </div>

//                     {/* Item Total Price */}
//                     <div className="min-w-[90px] text-right text-sm font-semibold text-(--color-text-primary) tabular-nums">
//                       {money(item.price * item.quantity)}
//                     </div>

//                     {/* Delete Icon */}
//                     <button
//                       type="button"
//                       onClick={() => handleRemove(item)}
//                       disabled={isUpdating}
//                       className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
//                     >
//                       <Trash2 className="size-4" />
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Order Summary Side Panel */}
//           <div className="rounded-2xl border border-(--color-border) bg-[#F8FAFC] p-5 space-y-5">
//             <h2 className="text-base font-semibold text-(--color-text-primary)">
//               {t("cart.orderSummary", "Order summary")}
//             </h2>

//             {/* Promo Code Input */}
//             <form onSubmit={handleApplyPromo} className="flex gap-2">
//               <input
//                 type="text"
//                 placeholder={t("cart.promoPlaceholder", "Promo code")}
//                 value={promoCode}
//                 onChange={(e) => setPromoCode(e.target.value)}
//                 className="flex-1 rounded-xl border border-(--color-border) bg-white px-3 py-2 text-sm text-(--color-text-primary) placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
//               />
//               <Button
//                 type="submit"
//                 variant="outline"
//                 className="rounded-xl border-(--color-border) bg-white px-4 text-sm font-medium text-(--color-text-primary) hover:bg-gray-50 cursor-pointer"
//               >
//                 {t("cart.apply", "Apply")}
//               </Button>
//             </form>

//             {/* Active Coupon Badge (Matching image) */}
//             {(cart.coupon || cart.discountAmount > 0) && (
//               <div className="flex items-center justify-between rounded-lg bg-[#EFFFF6] px-3 py-2 text-sm text-[#2E7D32]">
//                 <div className="flex items-center gap-2">
//                   <Tag className="size-4" />
//                   <span className="font-semibold">
//                     {cart.coupon || "SAVE10"}
//                   </span>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => removeCoupon && removeCoupon()}
//                   className="text-gray-400 hover:text-gray-600 cursor-pointer"
//                 >
//                   <X className="size-4" />
//                 </button>
//               </div>
//             )}

//             {/* Subtotal & Discount Lines */}
//             <div className="space-y-2.5 text-sm">
//               <div className="flex justify-between text-(--color-text-muted)">
//                 <span>{t("cart.subtotal", "Subtotal")}</span>
//                 <span className="font-medium text-(--color-text-primary) tabular-nums">
//                   {money(cart.subtotal)}
//                 </span>
//               </div>

//               {(cart.discountAmount > 0 || cart.coupon) && (
//                 <div className="flex justify-between text-(--color-text-muted)">
//                   <span>{t("cart.discount", "Discount")}</span>
//                   <span className="font-medium text-[#2E7D32] tabular-nums">
//                     -{money(cart.discountAmount || cart.subtotal * 0.1)}
//                   </span>
//                 </div>
//               )}
//             </div>

//             <hr className="border-(--color-border)" />

//             {/* Total */}
//             <div className="flex items-center justify-between font-semibold text-base text-(--color-text-primary)">
//               <span>{t("cart.total", "Total")}</span>
//               <span className="tabular-nums">{money(cart.total)}</span>
//             </div>

//             {/* Checkout Button */}
//             <Button
//               asChild
//               className="w-full rounded-xl bg-[#1E293B] py-6 text-sm font-medium text-white hover:bg-[#0F172A] cursor-pointer"
//             >
//               <Link to="/checkout">
//                 {t("cart.goCheckout", "Go to checkout")}
//               </Link>
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Clear Cart Confirmation Dialog */}
//       <AlertDialog
//         open={isClearOpen}
//         onOpenChange={(open) => !open && !isClearing && setIsClearOpen(false)}
//       >
//         <AlertDialogContent size="sm">
//           <AlertDialogHeader>
//             <AlertDialogMedia className="bg-error-bg text-error">
//               <Trash2 aria-hidden="true" />
//             </AlertDialogMedia>
//             <AlertDialogTitle className="font-display">
//               {t("cart.clearTitle", "Clear Cart")}
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               {t(
//                 "cart.clearDescription",
//                 "Are you sure you want to remove all items from your cart?",
//               )}
//             </AlertDialogDescription>
//           </AlertDialogHeader>

//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isClearing}>
//               {t("cart.cancel", "Cancel")}
//             </AlertDialogCancel>
//             <AlertDialogAction
//               variant="destructive"
//               onClick={handleClear}
//               disabled={isClearing}
//             >
//               {isClearing
//                 ? t("cart.clearing", "Clearing...")
//                 : t("cart.clearConfirm", "Clear")}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Minus,
  PackageOpen,
  Plus,
  ShoppingCart,
  Trash2,
  Tag,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import { formatCurrency, ORDER_CURRENCY } from "@/utils/formatCurrency";

function CartLineSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 sm:p-5">
      <div className="size-16 shrink-0 animate-pulse rounded-xl bg-(--color-surface-secondary)" />

      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-1/3 animate-pulse rounded bg-(--color-surface-secondary)" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-(--color-surface-secondary)" />
      </div>

      <div className="h-9 w-24 animate-pulse rounded-lg bg-(--color-surface-secondary)" />

      <div className="h-5 w-16 animate-pulse rounded bg-(--color-surface-secondary)" />
    </div>
  );
}

export default function Cart() {
  const { t, i18n } = useTranslation();

  const { user } = useAuth();

  const {
    cart,
    isLoading,
    isUpdating,
    isSignedIn,
    removeItem,
    updateQuantity,
    clear,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [isClearOpen, setIsClearOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const locale = i18n.language || "en-US";

  const money = (value) => formatCurrency(value, ORDER_CURRENCY, locale);

  const handleRemove = async (item) => {
    try {
      await removeItem(item.id);

      toast.success(t("cart.removed", { name: item.name }));
    } catch {
      toast.error(t("cart.removeFailed"));
    }
  };

  const handleQuantityChange = async (item, quantity) => {
    if (isUpdating || quantity < 1) return;

    try {
      await updateQuantity(item.id, quantity);
    } catch {
      toast.error(t("cart.updateFailed"));
    }
  };

  const handleClear = async () => {
    if (isClearing) return;

    setIsClearing(true);

    try {
      await clear();

      toast.success(t("cart.cleared"));
      setIsClearOpen(false);
    } catch {
      toast.error(t("cart.clearFailed"));
    } finally {
      setIsClearing(false);
    }
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();

    const code = promoCode.trim();

    if (!code) return;

    if (applyCoupon) {
      applyCoupon(code);
      setPromoCode("");
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6 space-y-1">
        <h1 className="font-display text-2xl font-semibold text-(--color-text-primary)">
          {t("cart.title", "Your cart")}
        </h1>

        {cart?.itemCount > 0 && (
          <p className="text-sm text-(--color-text-muted)">
            {t("cart.itemsCount", {
              count: cart.itemCount,
              defaultValue: `${cart.itemCount} items`,
            })}
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <Card className="overflow-hidden divide-y divide-(--color-border) rounded-2xl border border-(--color-border) bg-(--color-surface) p-0">
            <CartLineSkeleton />
            <CartLineSkeleton />
            <CartLineSkeleton />
          </Card>

          <Card className="h-80 animate-pulse rounded-2xl border border-(--color-border) bg-(--color-surface-secondary)" />
        </div>
      ) : !cart?.items || cart.items.length === 0 ? (
        /* Empty Cart */
        <Empty className="mt-6 rounded-2xl border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingCart className="size-6" aria-hidden="true" />
            </EmptyMedia>

            <EmptyTitle>
              {t("cart.emptyTitle", "Your cart is empty")}
            </EmptyTitle>

            <EmptyDescription>
              {t(
                "cart.emptyDescription",
                "Explore our products and add items to your cart.",
              )}
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <Button asChild className="rounded-xl">
              <Link to="/products">
                {t("cart.browseProducts", "Browse Products")}
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        /* Cart Content */
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
          {/* Cart Items */}
          <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)">
            <ul className="divide-y divide-(--color-border)">
              {cart.items.map((item) => (
                <li key={item.id} className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
                    {/* Product Image */}
                    <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-(--color-surface-secondary)">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <PackageOpen
                            className="size-5 text-(--color-text-disabled)"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/products/${item.id}`}
                        className="line-clamp-2 text-sm font-medium text-(--color-text-primary) hover:underline"
                      >
                        {item.name}
                      </Link>

                      <p className="mt-1 text-xs text-(--color-text-muted)">
                        {money(item.price)}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="order-3 flex w-full items-center justify-between sm:order-none sm:w-auto sm:justify-start">
                      <div className="flex items-center rounded-lg border border-(--color-border) bg-(--color-surface)">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(item, item.quantity - 1)
                          }
                          disabled={isUpdating || item.quantity <= 1}
                          aria-label={t(
                            "cart.decreaseQuantity",
                            "Decrease quantity",
                          )}
                          className="flex size-9 items-center justify-center rounded-l-lg text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-secondary) hover:text-(--color-text-primary) disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Minus className="size-3.5" aria-hidden="true" />
                        </button>

                        <span className="flex h-9 w-8 items-center justify-center text-sm font-medium tabular-nums text-(--color-text-primary)">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(item, item.quantity + 1)
                          }
                          disabled={isUpdating}
                          aria-label={t(
                            "cart.increaseQuantity",
                            "Increase quantity",
                          )}
                          className="flex size-9 items-center justify-center rounded-r-lg text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-secondary) hover:text-(--color-text-primary) disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Plus className="size-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      {/* Mobile Price */}
                      <div className="text-sm font-semibold tabular-nums text-(--color-text-primary) sm:hidden">
                        {money(item.price * item.quantity)}
                      </div>
                    </div>

                    {/* Item Total - Desktop */}
                    <div className="hidden min-w-[90px] text-right text-sm font-semibold tabular-nums text-(--color-text-primary) sm:block">
                      {money(item.price * item.quantity)}
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      disabled={isUpdating}
                      aria-label={t("cart.removeItem", {
                        name: item.name,
                      })}
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg p-1 text-(--color-text-disabled) transition-colors hover:bg-(--color-error-bg) hover:text-(--color-error) disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Summary */}
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface-secondary) p-5">
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-(--color-text-primary)">
                {t("cart.orderSummary", "Order summary")}
              </h2>

              {/* Promo Code */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <label htmlFor="promo-code" className="sr-only">
                  {t("cart.promoPlaceholder", "Promo code")}
                </label>

                <input
                  id="promo-code"
                  type="text"
                  placeholder={t("cart.promoPlaceholder", "Promo code")}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-(--color-border) bg-(--color-surface) px-3 py-2.5 text-sm text-(--color-text-primary) placeholder:text-(--color-text-disabled) focus:border-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-focus-ring)/20"
                />

                <Button
                  type="submit"
                  variant="outline"
                  disabled={!promoCode.trim()}
                  className="shrink-0 rounded-xl border-(--color-border) bg-(--color-surface) px-4 text-sm font-medium text-(--color-text-primary) hover:bg-(--color-surface-secondary)"
                >
                  {t("cart.apply", "Apply")}
                </Button>
              </form>

              {/* Active Coupon */}
              {(cart.coupon || cart.discountAmount > 0) && (
                <div className="flex items-center justify-between rounded-lg bg-(--color-success-bg) px-3 py-2 text-sm text-(--color-success)">
                  <div className="flex items-center gap-2">
                    <Tag className="size-4" aria-hidden="true" />

                    <span className="font-semibold">
                      {cart.coupon || "SAVE10"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCoupon && removeCoupon()}
                    aria-label={t("cart.removeCoupon", "Remove coupon")}
                    className="flex size-7 items-center justify-center rounded-md text-(--color-text-disabled) transition-colors hover:bg-(--color-surface) hover:text-(--color-text-secondary)"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
              )}

              {/* Prices */}
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between text-(--color-text-muted)">
                  <span>{t("cart.subtotal", "Subtotal")}</span>

                  <span className="font-medium tabular-nums text-(--color-text-primary)">
                    {money(cart.subtotal)}
                  </span>
                </div>

                {(cart.discountAmount > 0 || cart.coupon) && (
                  <div className="flex items-center justify-between text-(--color-text-muted)">
                    <span>{t("cart.discount", "Discount")}</span>

                    <span className="font-medium tabular-nums text-(--color-success)">
                      -{money(cart.discountAmount || cart.subtotal * 0.1)}
                    </span>
                  </div>
                )}
              </div>

              <div className="h-px bg-(--color-border)" aria-hidden="true" />

              {/* Total */}
              <div className="flex items-center justify-between text-base font-semibold text-(--color-text-primary)">
                <span>{t("cart.total", "Total")}</span>

                <span className="tabular-nums">{money(cart.total)}</span>
              </div>

              {/* Checkout */}
              <Button
                asChild
                className="w-full rounded-xl bg-(--color-primary) py-6 text-sm font-medium text-(--color-on-primary) hover:bg-(--color-primary-hover)"
              >
                <Link to="/checkout">
                  {t("cart.goCheckout", "Go to checkout")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Cart Dialog */}
      <AlertDialog
        open={isClearOpen}
        onOpenChange={(open) => !open && !isClearing && setIsClearOpen(false)}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-(--color-error-bg) text-(--color-error)">
              <Trash2 aria-hidden="true" />
            </AlertDialogMedia>

            <AlertDialogTitle className="font-display">
              {t("cart.clearTitle", "Clear Cart")}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {t(
                "cart.clearDescription",
                "Are you sure you want to remove all items from your cart?",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>
              {t("cart.cancel", "Cancel")}
            </AlertDialogCancel>

            <AlertDialogAction
              variant="destructive"
              onClick={handleClear}
              disabled={isClearing}
            >
              {isClearing
                ? t("cart.clearing", "Clearing...")
                : t("cart.clearConfirm", "Clear")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}